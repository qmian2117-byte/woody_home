# 🪵 Glossy Woods Backend (Node.js + Supabase)

Custom eCommerce backend built for seamless integration with **Next.js**. Replicates every single feature of [Glossy Woods](https://www.glossywoods.shop/).

---

## 🚀 Quick Setup Guide

### 1. Configure Supabase Database
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Copy and run the contents of [supabase/schema.sql](file:///e:/PROJECT%20AI/abckend/supabase/schema.sql).
4. *(Optional)* Run [supabase/seed.sql](file:///e:/PROJECT%20AI/abckend/supabase/seed.sql) to populate real Glossy Woods products, categories, tags, policies, and FAQs.

### 2. Configure Environment Variables
Open your [.env](file:///e:/PROJECT%20AI/abckend/.env) file and add your Supabase credentials:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

FRONTEND_URL=http://localhost:3000
WHATSAPP_PHONE=923326457322
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-reload on file change)
npm run dev
```

Server runs on: **`http://localhost:5000`**

---

## 📡 API Endpoints Documentation for Next.js

### 1. Products & Collections (PIM)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Get paginated products (`?category=lamps&page=1&limit=20`) |
| `GET` | `/api/products/:slug` | Get single product with all variants, images & tags |
| `GET` | `/api/collections` | Get all collections/categories with product counts |
| `POST`| `/api/admin/products`| Add new product, variants, and tags (Admin) |

### 2. AJAX Cart & Sessions (Stateful Cart)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's cart (via HTTP-only cookie or `x-cart-session` header) |
| `POST`| `/api/cart/add` | Add variant to cart with custom properties |
| `PATCH`| `/api/cart/item/:id` | Update item quantity or custom properties |
| `DELETE`| `/api/cart/item/:id`| Remove single item from cart |
| `DELETE`| `/api/cart/clear` | Clear entire cart |

#### Example: Add to Cart with Custom Engraving (Personalized Name Lamp)
```json
POST /api/cart/add
Content-Type: application/json

{
  "variant_id": "v2222222-2222-2222-2222-222222222222",
  "quantity": 1,
  "custom_properties": {
    "Personalized Name": "Ali Khan",
    "Glow Color": "Warm Yellow"
  }
}
```

### 3. Predictive Auto-Suggest Search (Sub-50ms)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/search/suggest?q=lamp` | Returns instant live suggestions with thumbnail, price, and URL |

### 4. Pakistani Cash on Delivery (COD) Checkout
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/checkout/order` | Place order from active cart & get WhatsApp direct confirmation link |
| `GET` | `/api/orders/track/:order_number` | Live order tracking (`/api/orders/track/GW-84920`) |
| `PATCH`| `/api/admin/orders/:id/status` | Update status (`confirmed`, `dispatched`, `delivered`) |

#### Example: Place COD Order
```json
POST /api/checkout/order
Content-Type: application/json

{
  "customer_name": "Hamza Ahmed",
  "email": "hamza@example.com",
  "phone": "03326457322",
  "shipping_address": "House 12, Street 4, F-8/2",
  "city": "Islamabad",
  "province": "Federal",
  "postal_code": "44000",
  "payment_method": "COD",
  "notes": "Please call before delivery"
}
```

### 5. Model Context Protocol (MCP) & AI FAQs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/mcp` | Natural language query tool (`search_shop_policies_and_faqs`) |

---

## 💻 Next.js Frontend Integration Snippet

In your Next.js project:

```javascript
// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fetch products
export async function getProducts(category) {
  const res = await fetch(`${API_BASE}/products${category ? `?category=${category}` : ''}`, {
    cache: 'no-store'
  });
  return res.json();
}

// Fetch active cart (pass credentials so cookie is included)
export async function getCart() {
  const res = await fetch(`${API_BASE}/cart`, {
    credentials: 'include'
  });
  return res.json();
}

// Predictive search
export async function searchSuggest(query) {
  const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(query)}`);
  return res.json();
}
```
# woody_home
