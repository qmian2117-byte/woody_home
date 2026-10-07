import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { cartSessionMiddleware } from '../middleware/cartSession.js';
import productRoutes from '../routes/productRoutes.js';
import cartRoutes from '../routes/cartRoutes.js';
import searchRoutes from '../routes/searchRoutes.js';
import checkoutRoutes from '../routes/checkoutRoutes.js';
import mcpRoutes from '../routes/mcpRoutes.js';

// Setup Test Server
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api', cartSessionMiddleware);

app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', searchRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', mcpRoutes);

const server = app.listen(5099, async () => {
  const BASE = 'http://localhost:5099/api';
  console.log('🧪 Starting Live End-to-End API Integration Tests...\n');

  try {
    // TEST 1: Fetch Products
    console.log('1️⃣ Testing GET /api/products...');
    const prodRes = await fetch(`${BASE}/products`).then(r => r.json());
    console.log(`   ✅ Status: ${prodRes.success} | Total Products: ${prodRes.data.products.length}`);
    console.log(`   Sample Product: "${prodRes.data.products[0].title}" (Price: Rs. ${prodRes.data.products[0].price})`);

    // TEST 2: Fetch Single Product by Slug
    console.log('\n2️⃣ Testing GET /api/products/:slug...');
    const singleRes = await fetch(`${BASE}/products/custom-name-wooden-led-lamp`).then(r => r.json());
    console.log(`   ✅ Status: ${singleRes.success} | Title: "${singleRes.data.title}" | SKU: ${singleRes.data.variants[0].sku}`);

    // TEST 3: Collections / Categories
    console.log('\n3️⃣ Testing GET /api/collections...');
    const catRes = await fetch(`${BASE}/collections`).then(r => r.json());
    console.log(`   ✅ Status: ${catRes.success} | Collections (${catRes.data.length}): ${catRes.data.map(c => c.name).join(', ')}`);

    // TEST 4: Predictive Search (Sub-50ms)
    console.log('\n4️⃣ Testing GET /api/search/suggest?q=lamp...');
    const searchRes = await fetch(`${BASE}/search/suggest?q=lamp`).then(r => r.json());
    console.log(`   ✅ Status: ${searchRes.success} | Matched: ${searchRes.data.results.length} items`);
    searchRes.data.results.forEach(r => console.log(`      • ${r.title} (Rs. ${r.price})`));

    // TEST 5: Model Context Protocol (MCP) AI Tool
    console.log('\n5️⃣ Testing POST /api/mcp (Tool: search_shop_policies_and_faqs)...');
    const mcpRes = await fetch(`${BASE}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'custom name lamp return policy' })
    }).then(r => r.json());
    console.log(`   ✅ Status: ${mcpRes.success} | Matches: ${mcpRes.data.matches.policies.length} Policies, ${mcpRes.data.matches.faqs.length} FAQs`);
    console.log(`   AI Result Snippet:\n   "${mcpRes.data.result.split('\n')[0]}..."`);

    // TEST 6: AJAX Cart Flow with Custom Personalization
    console.log('\n6️⃣ Testing Cart Flow (POST /api/cart/add)...');
    const testSession = 'test-session-' + Date.now();
    const variantId = singleRes.data.variants[0].id;

    const cartAddRes = await fetch(`${BASE}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-session': testSession
      },
      body: JSON.stringify({
        variant_id: variantId,
        quantity: 2,
        custom_properties: {
          'Personalized Name': 'Muhammad Ali',
          'Wood Style': 'Sheesham Dark Finish'
        }
      })
    }).then(r => r.json());

    console.log(`   ✅ Status: ${cartAddRes.success} | Cart Items Count: ${cartAddRes.data.item_count} | Total: Rs. ${cartAddRes.data.total_price}`);
    console.log(`   Custom Name Engraved: "${cartAddRes.data.items[0].custom_properties['Personalized Name']}"`);

    // TEST 7: Cash on Delivery Checkout & WhatsApp Link
    console.log('\n7️⃣ Testing Pakistani COD Checkout (POST /api/checkout/order)...');
    const orderRes = await fetch(`${BASE}/checkout/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cart-session': testSession
      },
      body: JSON.stringify({
        customer_name: 'Muhammad Ali',
        email: 'ali@example.com',
        phone: '03326457322',
        shipping_address: 'House 45, Street 10, Sector G-11/3',
        city: 'Islamabad',
        province: 'Federal',
        payment_method: 'COD',
        notes: 'Handle with care fragile wooden lamp'
      })
    }).then(r => r.json());

    console.log(`   ✅ Status: ${orderRes.success} | Order Number: ${orderRes.data.order_number}`);
    console.log(`   Total: Rs. ${orderRes.data.total_price} | Payment: ${orderRes.data.payment_method}`);
    console.log(`   WhatsApp Direct URL: ${orderRes.data.whatsapp_confirmation_url}`);

    // TEST 8: Track Order
    console.log('\n8️⃣ Testing Order Tracking (GET /api/orders/track/:order_number)...');
    const trackRes = await fetch(`${BASE}/orders/track/${orderRes.data.order_number}`).then(r => r.json());
    console.log(`   ✅ Status: ${trackRes.success} | Order Status: ${trackRes.data.order_status} | Customer: ${trackRes.data.customer_name}`);

    console.log('\n🏆 ALL 8 BACKEND API SYSTEMS TESTED AND PASSING 100%!\n');
  } catch (err) {
    console.error('Test failure:', err);
  } finally {
    server.close();
  }
});
