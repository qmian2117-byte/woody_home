import Stripe from 'stripe';
import { supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || /your|placeholder|replace/i.test(key)) {
    return new Stripe('sk_test_dummy_key_for_signature_verification');
  }
  return new Stripe(key);
};

const generateOrderNumber = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `GW-${randomNum}`;
};

const generateWhatsAppLink = (orderNumber, customerName, total, phone) => {
  const shopPhone = process.env.WHATSAPP_PHONE || '923428762481';
  const message = `Hello Woody Home! 🪵\nI just completed payment via Card/Stripe for:\n\n*Order #:* ${orderNumber}\n*Name:* ${customerName}\n*Phone:* ${phone}\n*Total Paid:* Rs. ${total.toLocaleString()}\n*Payment Status:* Paid (Stripe Verified)\n\nPlease process and dispatch my order!`;
  return `https://wa.me/${shopPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * POST /api/checkout/stripe-session
 * Creates Stripe Checkout Session from the user's active cart
 */
export const createStripeSession = async (req, res, next) => {
  try {
    const {
      customer_name,
      phone,
      email,
      shipping_address,
      city,
      province,
      postal_code = '',
      notes = ''
    } = req.body;

    if (!customer_name || !phone || !shipping_address || !city) {
      return errorResponse(res, 'Name, phone, address, and city are required for checkout', null, 400);
    }

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
          product:products(id, title, images:product_images(image_url, position))
        )
      `)
      .eq('cart_id', req.cartId);

    if (cartError) throw cartError;
    if (!cartItems || cartItems.length === 0) {
      return errorResponse(res, 'Your cart is empty', null, 400);
    }

    const stripe = getStripe();
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Mock Mode fallback if real Stripe key hasn't been added yet
    if (!stripe) {
      // Simulate Stripe session for test/demo mode
      const mockSessionId = 'cs_test_mock_' + Date.now();
      const mockOrderNumber = generateOrderNumber();

      let subtotal = 0;
      for (const item of cartItems) {
        subtotal += parseFloat(item.variant?.price || 0) * item.quantity;
      }

      return successResponse(res, 'Stripe session created (Demo Mode)', {
        sessionId: mockSessionId,
        url: `${FRONTEND_URL}/orders/success?session_id=${mockSessionId}&demo=true`,
        isDemo: true
      });
    }

    // 2. Build Stripe Line Items
    const line_items = cartItems.map((item) => {
      const unitPrice = parseFloat(item.variant?.price || 0);
      const product = item.variant?.product;
      const sortedImages = (product?.images || []).sort((a, b) => a.position - b.position);
      const primaryImage = sortedImages[0]?.image_url;

      const customName = item.custom_properties?.['Personalized Name'];
      const descParts = [`Variant: ${item.variant?.title || 'Default'}`];
      if (customName) descParts.push(`Name Carved: ${customName}`);

      return {
        price_data: {
          currency: 'pkr',
          product_data: {
            name: product?.title || 'Handcrafted Wooden Decor',
            description: descParts.join(' | '),
            images: primaryImage ? [primaryImage] : []
          },
          unit_amount: Math.round(unitPrice * 100) // Stripe expects smallest currency unit (paisa)
        },
        quantity: item.quantity
      };
    });

    // 3. Create Checkout Session (Dynamic Payment Methods enabled via Stripe Dashboard)
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email || undefined,
      client_reference_id: req.cartId,
      metadata: {
        cart_id: req.cartId,
        customer_name,
        phone,
        shipping_address,
        city,
        province,
        postal_code,
        notes
      },
      success_url: `${FRONTEND_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/`
    });

    return successResponse(res, 'Stripe Checkout Session created', {
      sessionId: session.id,
      url: session.url
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/checkout/stripe-verify/:session_id
 * Verifies payment on Stripe and creates order in database
 */
export const verifyStripeSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const stripe = getStripe();

    // Check if order already created for this session
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        customer_name,
        phone,
        total_price,
        payment_method,
        payment_status,
        order_status,
        items:order_items(id, product_title, variant_title, unit_price, quantity)
      `)
      .eq('notes', `Stripe Session: ${session_id}`)
      .maybeSingle();

    if (existingOrder) {
      const waLink = generateWhatsAppLink(
        existingOrder.order_number,
        existingOrder.customer_name,
        existingOrder.total_price,
        existingOrder.phone
      );
      return successResponse(res, 'Order already verified', {
        ...existingOrder,
        whatsapp_confirmation_url: waLink
      });
    }

    let customerName = 'Valued Customer';
    let customerPhone = '03326457322';
    let customerEmail = '';
    let shippingAddress = 'Provided on Checkout';
    let city = 'Pakistan';
    let province = 'Punjab';
    let postalCode = '';
    let cartId = req.cartId;
    let isPaid = false;

    if (!stripe || session_id.startsWith('cs_test_mock_')) {
      // Demo mode verification
      isPaid = true;
      customerName = 'Demo Buyer';
    } else {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== 'paid') {
        return errorResponse(res, 'Payment has not been completed on Stripe', null, 400);
      }
      isPaid = true;
      customerName = session.metadata?.customer_name || session.customer_details?.name || customerName;
      customerPhone = session.metadata?.phone || customerPhone;
      customerEmail = session.customer_email || session.customer_details?.email || '';
      shippingAddress = session.metadata?.shipping_address || shippingAddress;
      city = session.metadata?.city || city;
      province = session.metadata?.province || province;
      postalCode = session.metadata?.postal_code || postalCode;
      cartId = session.metadata?.cart_id || cartId;
    }

    if (!isPaid) {
      return errorResponse(res, 'Payment verification failed', null, 400);
    }

    // Fetch cart items to snapshot order
    const { data: cartItems } = await supabaseAdmin
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
      .eq('cart_id', cartId);

    let subtotal = 0;
    const orderItemsPayload = [];

    if (!cartItems || cartItems.length === 0) {
      return errorResponse(res, 'No cart items found for this Stripe session', null, 400);
    }

    for (const item of cartItems) {
      const unitPrice = parseFloat(item.variant?.price || 0);
      subtotal += unitPrice * item.quantity;

      orderItemsPayload.push({
        product_id: item.variant?.product?.id,
        variant_id: item.variant?.id,
        product_title: item.variant?.product?.title || 'Handcrafted Product',
        variant_title: item.variant?.title || 'Default Title',
        sku: item.variant?.sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        custom_properties: item.custom_properties || {}
      });
    }

    const orderNumber = generateOrderNumber();

    // Insert paid order into Supabase
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_name: customerName,
        email: customerEmail || null,
        phone: customerPhone,
        shipping_address: shippingAddress,
        city,
        province,
        postal_code: postalCode,
        payment_method: 'CARD_STRIPE',
        payment_status: 'paid',
        order_status: 'confirmed',
        subtotal,
        shipping_fee: 0,
        total_price: subtotal,
        notes: `Stripe Session: ${session_id}`
      }])
      .select()
      .single();

    if (orderErr) throw orderErr;

    if (orderItemsPayload.length > 0) {
      const itemsToInsert = orderItemsPayload.map(i => ({ ...i, order_id: order.id }));
      await supabaseAdmin.from('order_items').insert(itemsToInsert);
    }

    // Clear cart
    if (cartId) {
      await supabaseAdmin.from('cart_items').delete().eq('cart_id', cartId);
    }

    const waLink = generateWhatsAppLink(order.order_number, order.customer_name, order.total_price, order.phone);

    return successResponse(res, 'Payment verified and order created', {
      order_id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      total_price: order.total_price,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.order_status,
      whatsapp_confirmation_url: waLink
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/webhook/stripe
 * Stripe Webhook Handler for asynchronous events like checkout.session.completed
 */
export const handleStripeWebhook = async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) {
    return res.status(400).send('Stripe is not configured');
  }

  // Reject unconfigured or placeholder webhook secrets
  if (!webhookSecret || /your|placeholder|replace/i.test(webhookSecret)) {
    console.error('[Security Warning] Stripe webhook rejected: STRIPE_WEBHOOK_SECRET is not configured.');
    return res.status(400).send('Webhook secret is not configured');
  }

  // Reject missing signature headers (prevent forged requests)
  if (!sig) {
    console.warn('[Security Warning] Webhook call rejected: Missing stripe-signature header.');
    return res.status(400).send('Missing stripe-signature header');
  }

  let event;

  try {
    // Strictly verify signature using raw body and Stripe SDK
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('[Security Alert] Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;

    // Reject unpaid sessions (SEC-018: Failed or canceled payments cannot produce paid orders)
    if (session.payment_status !== 'paid') {
      console.warn(`[Webhook Warning] Ignored session ${sessionId}: payment_status is '${session.payment_status}', not 'paid'.`);
      return res.status(200).json({ received: true, status: 'unpaid_ignored' });
    }

    try {
      const eventId = event.id || `evt_${sessionId}`;

      // 1. Database-Level Unique Idempotency Claim (Issue 4)
      // Enforces database unique constraint on stripe_webhook_events(event_id, session_id)
      const { error: claimError } = await supabaseAdmin
        .from('stripe_webhook_events')
        .insert([{
          event_id: eventId,
          session_id: sessionId,
          event_type: event.type,
          status: 'processing'
        }]);

      if (claimError && (claimError.code === '23505' || claimError.message?.includes('duplicate key') || claimError.message?.includes('unique'))) {
        console.log(`[Webhook Idempotency] Event ${eventId} or Session ${sessionId} already claimed. Skipping parallel duplicate delivery.`);
        return res.json({ received: true, duplicate: true });
      }

      // 2. Transactional check on orders table
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id, order_number')
        .or(`stripe_session_id.eq.${sessionId},notes.eq.Stripe Session: ${sessionId}`)
        .maybeSingle();

      if (existingOrder) {
        console.log(`[Webhook Idempotency] Order ${existingOrder.order_number} already exists for session ${sessionId}. Skipping duplicate fulfillment.`);
        return res.json({ received: true, duplicate: true });
      }

      const cartId = session.metadata?.cart_id;
      const customerName = session.metadata?.customer_name || session.customer_details?.name || 'Customer';
      const customerPhone = session.metadata?.phone || '0000000000';
      const customerEmail = session.customer_email || session.customer_details?.email || null;
      const shippingAddress = session.metadata?.shipping_address || 'Address provided on checkout';
      const city = session.metadata?.city || 'Pakistan';
      const province = session.metadata?.province || 'Punjab';
      const postalCode = session.metadata?.postal_code || '';

      // Fetch cart items
      let cartItems = [];
      if (cartId) {
        const { data } = await supabaseAdmin
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
          .eq('cart_id', cartId);
        cartItems = data || [];
      }

      let subtotal = 0;
      const orderItemsPayload = [];

      for (const item of cartItems) {
        const unitPrice = parseFloat(item.variant?.price || 0);
        subtotal += unitPrice * item.quantity;

        orderItemsPayload.push({
          product_id: item.variant?.product?.id,
          variant_id: item.variant?.id,
          product_title: item.variant?.product?.title || 'Handcrafted Product',
          variant_title: item.variant?.title || 'Default Title',
          sku: item.variant?.sku,
          unit_price: unitPrice,
          quantity: item.quantity,
          custom_properties: item.custom_properties || {}
        });
      }

      const totalAmount = subtotal > 0 ? subtotal : (session.amount_total ? session.amount_total / 100 : 0);
      const orderNumber = generateOrderNumber();

      const orderPayload = {
        order_number: orderNumber,
        customer_name: customerName,
        email: customerEmail,
        phone: customerPhone,
        shipping_address: shippingAddress,
        city,
        province,
        postal_code: postalCode,
        payment_method: 'CARD_STRIPE',
        payment_status: 'paid',
        order_status: 'confirmed',
        subtotal: totalAmount,
        shipping_fee: 0,
        total_price: totalAmount,
        notes: `Stripe Session: ${sessionId}`,
        stripe_session_id: sessionId
      };

      let { data: newOrder, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      // Graceful fallback if stripe_session_id column has not yet migrated in staging
      if (orderErr && orderErr.message && orderErr.message.includes('stripe_session_id')) {
        delete orderPayload.stripe_session_id;
        const retryResult = await supabaseAdmin
          .from('orders')
          .insert([orderPayload])
          .select()
          .single();
        newOrder = retryResult.data;
        orderErr = retryResult.error;
      }

      if (orderErr) {
        console.error('Error inserting order via webhook:', orderErr);
      } else {
        if (orderItemsPayload.length > 0) {
          const itemsToInsert = orderItemsPayload.map(i => ({ ...i, order_id: newOrder.id }));
          await supabaseAdmin.from('order_items').insert(itemsToInsert);

          // Atomic database-side inventory decrement (Issue 1)
          for (const item of cartItems) {
            if (item.variant?.id) {
              const { error: rpcErr } = await supabaseAdmin.rpc('decrement_variant_inventory', {
                p_variant_id: item.variant.id,
                p_quantity: item.quantity
              });

              if (rpcErr) {
                // Fallback conditional decrement
                const currentStock = item.variant.inventory_quantity || 10;
                const newQty = Math.max(0, currentStock - item.quantity);
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
        }

        if (cartId) {
          await supabaseAdmin.from('cart_items').delete().eq('cart_id', cartId);
        }
        console.log(`[Webhook] Order ${newOrder.order_number} created successfully.`);
      }
    } catch (processErr) {
      console.error('Error processing checkout.session.completed:', processErr);
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.warn(`[Webhook Alert] Payment intent ${paymentIntent.id} failed. Reason: ${paymentIntent.last_payment_error?.message || 'unknown'}`);
  }

  return res.json({ received: true });
};

