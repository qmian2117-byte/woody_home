import { z } from 'zod';
import { hasSupabaseServiceRole, supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

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
 * Helper to build prefilled WhatsApp confirmation link
 */
const generateWhatsAppLink = (orderNumber, customerName, total, items, phone) => {
  const shopPhone = process.env.WHATSAPP_PHONE || '923326457322';
  const itemLines = items.map(i => `• ${i.product_title} (${i.variant_title}) x${i.quantity}${i.custom_properties?.['Personalized Name'] ? ` [Name: ${i.custom_properties['Personalized Name']}]` : ''}`).join('\n');

  const message = `Hello Woody Home! 🪵\nI just placed an order:\n\n*Order #:* ${orderNumber}\n*Name:* ${customerName}\n*Phone:* ${phone}\n*Total:* Rs. ${total.toLocaleString()}\n\n*Items:*\n${itemLines}\n\nPlease confirm my order!`;

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

    // 1. Fetch active cart items
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
          product:products(id, title)
        )
      `)
      .eq('cart_id', req.cartId);

    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return errorResponse(res, 'Your cart is empty', null, 400);
    }

    // 2. Calculate subtotal & shipping fee
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

    const shipping_fee = 0.00; // Free shipping default or flat rate
    const total_price = subtotal + shipping_fee;
    const order_number = generateOrderNumber();

    // 3. Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        order_number,
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
        shipping_fee,
        total_price,
        notes
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Insert order items
    const itemsToInsert = orderItemsPayload.map(i => ({
      ...i,
      order_id: order.id
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 5. Empty active cart
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', req.cartId);

    // 6. Generate WhatsApp direct confirmation link
    const whatsappLink = generateWhatsAppLink(
      order.order_number,
      order.customer_name,
      order.total_price,
      orderItemsPayload,
      order.phone
    );

    return successResponse(res, 'Order placed successfully!', {
      order_id: order.id,
      order_number: order.order_number,
      total_price: order.total_price,
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

    return successResponse(res, 'Order details retrieved', order);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    if (!hasSupabaseServiceRole) {
      return errorResponse(res, 'Supabase service role key is required for admin order updates', null, 503);
    }

    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const updateFields = {};
    if (order_status) updateFields.order_status = order_status;
    if (payment_status) updateFields.payment_status = payment_status;

    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(res, 'Order status updated', updatedOrder);
  } catch (err) {
    next(err);
  }
};
