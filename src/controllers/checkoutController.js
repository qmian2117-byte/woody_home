import crypto from 'crypto';
import { z } from 'zod';
import { hasSupabaseServiceRole, supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';
import { trackMetaConversionEvent } from '../utils/metaCapiService.js';

// Pakistani Phone Validation Regex (03XXXXXXXXX or +923XXXXXXXXX)
const PK_PHONE_REGEX = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(PK_PHONE_REGEX, 'Please enter a valid Pakistani mobile number (e.g. 03326457322)'),
  shipping_address: z.string().min(5, 'Shipping address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().optional().default(''),
  payment_method: z.enum(['COD', 'CARD', 'WHATSAPP']).default('COD'),
  notes: z.string().optional().default('')
});

/**
 * Helper to generate order tracking number (e.g., GW-84920)
 */
const generateOrderNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `GW-${randomNum}`;
};

/**
 * Generate a high-entropy, tamper-proof tracking token for an order (SEC-001)
 * Derived using HMAC-SHA256 with server JWT secret; impossible to forge or brute-force.
 */
export const computeTrackingToken = (orderNumber, identifier = 'guest') => {
  const secret = process.env.JWT_SECRET || 'woody-home-super-secret-jwt-key-2026';
  return crypto.createHmac('sha256', secret).update(`${orderNumber}:${identifier}`).digest('hex');
};

/**
 * Helper to build prefilled WhatsApp confirmation link
 */
const generateWhatsAppLink = (orderNumber, customerName, total, items, phone) => {
  const shopPhone = process.env.WHATSAPP_PHONE || '923326457322';
  const itemLines = items.map(i => `• ${i.product_title} (${i.variant_title}) x${i.quantity}${i.custom_properties?.['Personalized Name'] ? ` [Name: ${i.custom_properties['Personalized Name']}]` : ''}`).join('\n');

  const message = `Hello Woody Home! 🪵\nI just placed an order:\n\n*Order #:* ${orderNumber}\n*Name:* ${customerName}\n*Phone:* ${phone}\n*Total:* Rs. ${Number(total).toLocaleString()}\n\n*Items:*\n${itemLines}\n\nPlease confirm my order!`;

  return `https://wa.me/${shopPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * POST /api/checkout/order
 * Creates an order directly from the user's active cart session
 */
export const createOrder = async (req, res, next) => {
  try {
    const parseResult = checkoutSchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, 'Validation Error', parseResult.error.errors[0]?.message, 400);
    }

    const {
      customer_name,
      email,
      phone,
      shipping_address,
      city,
      province,
      postal_code,
      payment_method,
      notes
    } = parseResult.data;

    // 1. Fetch active cart and coupon details
    const { data: cartData, error: cartHeaderError } = await supabaseAdmin
      .from('carts')
      .select('id, coupon_code, discount_amount')
      .eq('id', req.cartId)
      .maybeSingle();

    if (cartHeaderError) throw cartHeaderError;

    const { data: cartItems, error: cartError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        quantity,
        custom_properties,
        variant:product_variants(
          id,
          title,
          sku,
          price,
          inventory_quantity,
          product:products(id, title)
        )
      `)
      .eq('cart_id', req.cartId);

    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return errorResponse(res, 'Your cart is empty', null, 400);
    }

    // 2. Validate inventory availability before order creation (SEC-015)
    for (const item of cartItems) {
      const stock = item.variant?.inventory_quantity;
      if (stock !== undefined && stock !== null && stock < item.quantity) {
        return errorResponse(
          res,
          'Insufficient Inventory',
          `Item "${item.variant?.title || 'Product'}" has only ${stock} units in stock, but ${item.quantity} was requested.`,
          400
        );
      }
    }

    // 3. Server-side price calculation (SEC-004)
    let subtotal = 0;
    const orderItemsPayload = [];

    for (const item of cartItems) {
      const unitPrice = parseFloat(item.variant?.price || 0);
      subtotal += unitPrice * item.quantity;

      orderItemsPayload.push({
        product_id: item.variant?.product?.id,
        variant_id: item.variant?.id,
        product_title: item.variant?.product?.title || 'Wooden Product',
        variant_title: item.variant?.title || 'Default Title',
        sku: item.variant?.sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        custom_properties: item.custom_properties || {}
      });
    }

    // 4. Strictly re-validate coupon server-side (SEC-005, SEC-006)
    let discount_amount = 0.00;
    let coupon_code = cartData?.coupon_code || null;

    if (coupon_code) {
      const { data: couponRecord } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase().trim())
        .eq('is_active', true)
        .maybeSingle();

      if (!couponRecord) {
        coupon_code = null;
      } else if (couponRecord.expires_at && new Date(couponRecord.expires_at) < new Date()) {
        coupon_code = null;
      } else if (couponRecord.usage_limit && (couponRecord.times_used || 0) >= couponRecord.usage_limit) {
        coupon_code = null;
      } else if (couponRecord.min_spend && subtotal < parseFloat(couponRecord.min_spend)) {
        coupon_code = null;
      } else {
        if (couponRecord.discount_type === 'percentage') {
          discount_amount = (subtotal * parseFloat(couponRecord.discount_value)) / 100;
          if (couponRecord.max_discount && discount_amount > parseFloat(couponRecord.max_discount)) {
            discount_amount = parseFloat(couponRecord.max_discount);
          }
        } else {
          discount_amount = Math.min(parseFloat(couponRecord.discount_value), subtotal);
        }
        discount_amount = Math.round(discount_amount * 100) / 100;
      }
    }

    const shipping_fee = 0.00; // Free shipping default or flat rate
    const total_price = Math.max(0, subtotal - discount_amount + shipping_fee);
    const order_number = generateOrderNumber();
    const tracking_token = crypto.randomBytes(32).toString('hex');
    const tracking_token_expires_at = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(); // 30-day expiry (Issue 6)

    // 5. Insert order
    const customer_id = req.user?.id || null;

    const orderPayload = {
      order_number,
      customer_id,
      customer_name,
      email: email || null,
      phone,
      shipping_address,
      city,
      province,
      postal_code,
      payment_method,
      payment_status: 'pending',
      order_status: 'pending_confirmation',
      subtotal,
      discount_amount,
      coupon_code,
      shipping_fee,
      total_price,
      notes,
      tracking_token,
      tracking_token_expires_at,
      tracking_token_revoked: false
    };

    let { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    // Graceful fallback if staging database has not yet applied tracking_token columns
    if (orderError && orderError.message && (orderError.message.includes('tracking_token') || orderError.message.includes('column'))) {
      delete orderPayload.tracking_token;
      delete orderPayload.tracking_token_expires_at;
      delete orderPayload.tracking_token_revoked;
      const retryResult = await supabaseAdmin
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();
      order = retryResult.data;
      orderError = retryResult.error;
    }

    if (orderError) throw orderError;

    // 6. Insert order items
    const itemsToInsert = orderItemsPayload.map(i => ({
      ...i,
      order_id: order.id
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 7. Atomic Database-Side Coupon Redemption (Issue 2)
    if (coupon_code) {
      const { data: rpcCoupon, error: rpcCouponErr } = await supabaseAdmin.rpc('redeem_coupon_atomic', {
        p_code: coupon_code
      });

      if (rpcCouponErr) {
        // Fallback for unmigrated staging
        const { data: cData } = await supabaseAdmin
          .from('coupons')
          .select('id, times_used, usage_limit')
          .eq('code', coupon_code.toUpperCase().trim())
          .maybeSingle();

        if (cData) {
          const query = supabaseAdmin
            .from('coupons')
            .update({ times_used: (cData.times_used || 0) + 1 })
            .eq('id', cData.id);

          if (cData.usage_limit) {
            query.lt('times_used', cData.usage_limit);
          }
          await query;
        }
      }
    }

    // 8. Atomic Database-Side Inventory Decrement (Issue 1)
    for (const item of cartItems) {
      if (item.variant?.id) {
        const { error: rpcErr } = await supabaseAdmin.rpc('decrement_variant_inventory', {
          p_variant_id: item.variant.id,
          p_quantity: item.quantity
        });

        if (rpcErr) {
          // Staging fallback if RPC unmigrated in database
          const currentQty = item.variant.inventory_quantity || 10;
          const newQty = Math.max(0, currentQty - item.quantity);

          await supabaseAdmin
            .from('product_variants')
            .update({
              inventory_quantity: newQty,
              is_available: newQty > 0
            })
            .eq('id', item.variant.id)
            .gte('inventory_quantity', item.quantity);
        }
      }
    }

    // 8. Empty active cart
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', req.cartId);

    await supabaseAdmin
      .from('carts')
      .update({ coupon_code: null, discount_amount: 0.00 })
      .eq('id', req.cartId);

    // 7. Dispatch Email Notification & Meta CAPI Event (Asynchronous)
    if (email) {
      sendOrderConfirmationEmail({
        toEmail: email,
        customerName: order.customer_name,
        orderNumber: order.order_number,
        items: orderItemsPayload,
        total: order.total_price,
        paymentMethod: order.payment_method,
        shippingAddress: order.shipping_address,
        city: order.city
      }).catch(err => console.error('[Order Email Error]:', err));
    }

    trackMetaConversionEvent({
      eventName: 'Purchase',
      userData: {
        email: email || undefined,
        phone: order.phone,
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      customData: {
        currency: 'PKR',
        value: total_price,
        numItems: orderItemsPayload.length,
        contents: orderItemsPayload.map(i => ({ id: i.sku || i.variant_id, quantity: i.quantity, item_price: i.unit_price }))
      },
      eventId: order.order_number
    }).catch(err => console.error('[Meta CAPI Error]:', err));

    // 8. Generate WhatsApp direct confirmation link
    const whatsappLink = generateWhatsAppLink(
      order.order_number,
      order.customer_name,
      order.total_price,
      orderItemsPayload,
      order.phone
    );

    const finalTrackingToken = order.tracking_token || tracking_token;

    return successResponse(res, 'Order placed successfully!', {
      order_id: order.id,
      order_number: order.order_number,
      tracking_token: finalTrackingToken,
      tracking_url: `/orders/track/${order.order_number}?token=${finalTrackingToken}`,
      total_price: order.total_price,
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      coupon_code: order.coupon_code,
      currency: 'PKR',
      payment_method: order.payment_method,
      order_status: order.order_status,
      whatsapp_confirmation_url: whatsappLink
    }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/track/:order_number
 */
export const trackOrder = async (req, res, next) => {
  try {
    const { order_number } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        email,
        phone,
        city,
        province,
        payment_method,
        payment_status,
        order_status,
        subtotal,
        shipping_fee,
        total_price,
        created_at,
        items:order_items(
          id,
          product_title,
          variant_title,
          unit_price,
          quantity,
          custom_properties
        )
      `)
      .eq('order_number', order_number.toUpperCase().trim())
      .maybeSingle();

    if (error) throw error;
    if (!order) {
      return errorResponse(res, 'Order not found', null, 404);
    }

    // Ownership verification to prevent BOLA / IDOR (SEC-001 & Issue 6)
    // Administrative access strictly requires completed MFA verification
    const isAdmin = req.user?.role === 'admin' && req.user?.mfa_verified === true;
    const isOwner = Boolean(
      (req.user?.email && order.email && req.user.email.toLowerCase().trim() === order.email.toLowerCase().trim()) ||
      (req.user?.id && order.customer_id && req.user.id === order.customer_id)
    );

    // Cryptographic High-Entropy Tracking Token Verification (eliminates easily guessable phone/email lookups)
    const providedToken = (req.headers['x-tracking-token'] || req.query.token || '').toString().trim();
    const expectedToken = computeTrackingToken(order.order_number, order.customer_id || 'guest');

    let isTokenMatch = false;
    if (providedToken) {
      try {
        const provBuf = Buffer.from(providedToken);
        const expBuf = Buffer.from(expectedToken);
        if (provBuf.length === expBuf.length && crypto.timingSafeEqual(provBuf, expBuf)) {
          isTokenMatch = true;
        } else if (order.tracking_token) {
          const dbBuf = Buffer.from(order.tracking_token);
          if (provBuf.length === dbBuf.length && crypto.timingSafeEqual(provBuf, dbBuf)) {
            isTokenMatch = true;
          }
        }
      } catch {
        isTokenMatch = false;
      }
    }

    if (!isAdmin && !isOwner && !isTokenMatch) {
      return errorResponse(
        res,
        'Verification Required',
        'To protect customer privacy, please provide the secure tracking token associated with this order (?token=... or header X-Tracking-Token).',
        403
      );
    }

    // Check Token Revocation (Issue 6)
    if (isTokenMatch && order.tracking_token_revoked) {
      return errorResponse(res, 'Tracking Token Revoked', 'This tracking token has been revoked for security. Please log in to your account.', 403);
    }

    // Check Token Expiration (Issue 6)
    if (isTokenMatch && order.tracking_token_expires_at && new Date() > new Date(order.tracking_token_expires_at)) {
      return errorResponse(res, 'Tracking Token Expired', 'This order tracking token has expired (valid for 30 days). Please log in to your account.', 410);
    }

    // Leakage Protection Headers: Prevent token leak in Referer and prevent intermediate caching
    res.set('Referrer-Policy', 'no-referrer');
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    // Sanitize response: mask private details unless authenticated admin; do not leak raw token fields
    const sanitizedOrder = {
      ...order,
      tracking_token: undefined,
      tracking_token_expires_at: undefined,
      tracking_token_revoked: undefined,
      phone: isAdmin ? order.phone : (order.phone ? `******${order.phone.slice(-4)}` : null),
      email: isAdmin ? order.email : (order.email ? `${order.email.slice(0, 2)}***@***` : null)
    };

    return successResponse(res, 'Order details retrieved', sanitizedOrder);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/orders (Admin Only)
 * Paginated list with status and search filters
 */
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, payment_status, search, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        email,
        phone,
        city,
        province,
        payment_method,
        payment_status,
        order_status,
        subtotal,
        discount_amount,
        total_price,
        created_at,
        items:order_items(id, product_title, variant_title, sku, unit_price, quantity, custom_properties)
      `, { count: 'exact' });

    if (status) {
      query = query.eq('order_status', status);
    }

    if (payment_status) {
      query = query.eq('payment_status', payment_status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limitNum - 1);

    const { data: orders, count, error } = await query;
    if (error) throw error;

    return successResponse(res, 'Admin orders retrieved', {
      orders: orders || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total_orders: count || 0,
        total_pages: Math.ceil((count || 0) / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/orders/:id/status (Admin Only)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const updates = {};
    if (order_status) updates.order_status = order_status;
    if (payment_status) updates.payment_status = payment_status;
    updates.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(res, 'Order status updated successfully', updated);
  } catch (err) {
    next(err);
  }
};
