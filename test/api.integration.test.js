import test from 'node:test';
import assert from 'node:assert/strict';

import app from '../src/app.js';
import { hasSupabaseServiceRole } from '../src/config/supabase.js';

const server = app.listen(0);
const BASE_URL = `http://127.0.0.1:${server.address().port}/api`;

test.after(() => new Promise((resolve, reject) => {
  server.close((err) => (err ? reject(err) : resolve()));
}));

const jsonRequest = async (path, options = {}) => {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
};

const createSession = (name) => `test-${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

test('backend API integration flow', async (t) => {
  let product;
  let variant;
  let orderId;
  let orderNumber;

  await t.test('health endpoint returns service status and creates a cart session', async () => {
    const { response, body } = await jsonRequest('/health');

    assert.equal(response.status, 200);
    assert.equal(body.status, 'healthy');
    assert.equal(body.name, 'Glossy Woods Custom Backend');
    assert.ok(body.cartSession);
  });

  await t.test('products endpoint returns seeded products with pagination', async () => {
    const { response, body } = await jsonRequest('/products?limit=12');

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data.products));
    assert.ok(body.data.products.length > 0, 'Supabase seed data should include products');
    assert.ok(body.data.pagination.total >= body.data.products.length);

    product = body.data.products[0];
    variant = product.variants.find((item) => item.is_available) || product.variants[0];
    assert.ok(product.slug);
    assert.ok(variant?.id, 'seeded product should include at least one variant');
  });

  await t.test('single product endpoint returns detail payload and recommendations', async () => {
    const { response, body } = await jsonRequest(`/products/${product.slug}`);

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.slug, product.slug);
    assert.ok(Array.isArray(body.data.images));
    assert.ok(Array.isArray(body.data.variants));
  });

  await t.test('collections and FAQs endpoints return list payloads', async () => {
    const collections = await jsonRequest('/collections');
    const faqs = await jsonRequest('/faqs');

    assert.equal(collections.response.status, 200);
    assert.equal(collections.body.success, true);
    assert.ok(Array.isArray(collections.body.data));

    assert.equal(faqs.response.status, 200);
    assert.equal(faqs.body.success, true);
    assert.ok(Array.isArray(faqs.body.data));
  });

  await t.test('search endpoint handles short and real queries', async () => {
    const shortQuery = await jsonRequest('/search/suggest?q=a');
    const realQuery = await jsonRequest(`/search/suggest?q=${encodeURIComponent(product.title.split(' ')[0])}`);

    assert.equal(shortQuery.response.status, 200);
    assert.equal(shortQuery.body.success, true);
    assert.deepEqual(shortQuery.body.data.results, []);

    assert.equal(realQuery.response.status, 200);
    assert.equal(realQuery.body.success, true);
    assert.ok(Array.isArray(realQuery.body.data.results));
  });

  await t.test('MCP endpoint returns policy/FAQ context or fallback text', async () => {
    const { response, body } = await jsonRequest('/mcp', {
      method: 'POST',
      body: JSON.stringify({ query: 'delivery return policy' })
    });

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.tool, 'search_shop_policies_and_faqs');
    assert.ok(typeof body.data.result === 'string');
  });

  await t.test('cart endpoint supports get, add, update, remove, and clear', async () => {
    const session = createSession('cart');
    const headers = { 'x-cart-session': session };

    const initialCart = await jsonRequest('/cart', { headers });
    assert.equal(initialCart.response.status, 200);
    assert.equal(initialCart.body.data.item_count, 0);

    const missingVariant = await jsonRequest('/cart/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({ variant_id: '00000000-0000-0000-0000-000000000000', quantity: 1 })
    });
    assert.equal(missingVariant.response.status, 404);

    const add = await jsonRequest('/cart/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        variant_id: variant.id,
        quantity: 2,
        custom_properties: { 'Personalized Name': 'Integration Test' }
      })
    });
    assert.equal(add.response.status, 200);
    assert.equal(add.body.success, true);
    assert.equal(add.body.data.item_count, 2);

    const itemId = add.body.data.items[0].id;
    const update = await jsonRequest(`/cart/item/${itemId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ quantity: 1 })
    });
    assert.equal(update.response.status, 200);
    assert.equal(update.body.data.item_count, 1);

    const remove = await jsonRequest(`/cart/item/${itemId}`, {
      method: 'DELETE',
      headers
    });
    assert.equal(remove.response.status, 200);
    assert.equal(remove.body.data.item_count, 0);

    const clear = await jsonRequest('/cart/clear', {
      method: 'DELETE',
      headers
    });
    assert.equal(clear.response.status, 200);
    assert.equal(clear.body.data.item_count, 0);
  });

  await t.test('contact endpoint validates required fields and creates WhatsApp handoff', async () => {
    const invalid = await jsonRequest('/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Ali' })
    });
    assert.equal(invalid.response.status, 400);

    const valid = await jsonRequest('/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Integration Tester',
        phone: '03326457322',
        inquiry_type: 'Testing',
        message: 'Automated integration test'
      })
    });
    assert.equal(valid.response.status, 201);
    assert.equal(valid.body.success, true);
    assert.match(valid.body.data.whatsapp_url, /^https:\/\/wa\.me\//);
  });

  await t.test('COD checkout validates data, creates an order, clears cart, and supports tracking', async () => {
    const session = createSession('checkout');
    const headers = { 'x-cart-session': session };

    const invalid = await jsonRequest('/checkout/order', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_name: 'A',
        phone: '123',
        shipping_address: 'x',
        city: 'L',
        province: 'P'
      })
    });
    assert.equal(invalid.response.status, 400);

    const emptyCart = await jsonRequest('/checkout/order', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_name: 'Integration Tester',
        phone: '03326457322',
        shipping_address: 'House 1, Street 2',
        city: 'Lahore',
        province: 'Punjab',
        payment_method: 'COD'
      })
    });
    assert.equal(emptyCart.response.status, 400);
    assert.equal(emptyCart.body.message, 'Your cart is empty');

    await jsonRequest('/cart/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({ variant_id: variant.id, quantity: 1 })
    });

    const order = await jsonRequest('/checkout/order', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_name: 'Integration Tester',
        email: 'integration@example.com',
        phone: '03326457322',
        shipping_address: 'House 1, Street 2',
        city: 'Lahore',
        province: 'Punjab',
        payment_method: 'COD',
        notes: 'Automated integration test order'
      })
    });
    assert.equal(order.response.status, 201);
    assert.equal(order.body.success, true);
    assert.match(order.body.data.order_number, /^GW-\d{5}$/);
    assert.match(order.body.data.whatsapp_confirmation_url, /^https:\/\/wa\.me\//);

    orderId = order.body.data.order_id;
    orderNumber = order.body.data.order_number;

    const cartAfterOrder = await jsonRequest('/cart', { headers });
    assert.equal(cartAfterOrder.body.data.item_count, 0);

    const tracking = await jsonRequest(`/orders/track/${orderNumber}`);
    assert.equal(tracking.response.status, 200);
    assert.equal(tracking.body.data.order_number, orderNumber);
    assert.equal(tracking.body.data.order_status, 'pending_confirmation');
  });

  await t.test('admin order status route updates the created test order when service role is configured', async () => {
    const updated = await jsonRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ order_status: 'confirmed', payment_status: 'pending' })
    });

    if (!hasSupabaseServiceRole) {
      assert.equal(updated.response.status, 503);
      assert.equal(updated.body.success, false);
      assert.match(updated.body.message, /service role key is required/i);
      return;
    }

    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.success, true);
    assert.equal(updated.body.data.order_status, 'confirmed');
  });

  await t.test('Stripe checkout validates input and creates a demo/real checkout session from cart', async () => {
    const session = createSession('stripe');
    const headers = { 'x-cart-session': session };

    const invalid = await jsonRequest('/checkout/stripe-session', {
      method: 'POST',
      headers,
      body: JSON.stringify({ customer_name: 'Integration Tester' })
    });
    assert.equal(invalid.response.status, 400);

    const emptyCart = await jsonRequest('/checkout/stripe-session', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_name: 'Integration Tester',
        phone: '03326457322',
        shipping_address: 'House 1, Street 2',
        city: 'Lahore',
        province: 'Punjab'
      })
    });
    assert.equal(emptyCart.response.status, 400);

    await jsonRequest('/cart/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({ variant_id: variant.id, quantity: 1 })
    });

    const stripe = await jsonRequest('/checkout/stripe-session', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer_name: 'Integration Tester',
        email: 'integration@example.com',
        phone: '03326457322',
        shipping_address: 'House 1, Street 2',
        city: 'Lahore',
        province: 'Punjab'
      })
    });

    assert.equal(stripe.response.status, 200);
    assert.equal(stripe.body.success, true);
    assert.ok(stripe.body.data.sessionId);
    assert.match(stripe.body.data.url, /^http/);
  });

  await t.test('Stripe verification rejects mock sessions when no cart items exist', async () => {
    const session = createSession('stripe-verify-empty');
    const mockSessionId = `cs_test_mock_empty_${Date.now()}`;
    const verify = await jsonRequest(`/checkout/stripe-verify/${mockSessionId}`, {
      headers: { 'x-cart-session': session }
    });

    assert.equal(verify.response.status, 400);
    assert.equal(verify.body.success, false);
    assert.match(verify.body.message, /No cart items found/i);
  });
});
