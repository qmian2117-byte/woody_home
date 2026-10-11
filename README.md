# 🪵 Woody Home — Fullstack eCommerce Platform

A production-ready fullstack architecture for **Woody Home** (handcrafted Sheesham wood decor, lamps, clocks & bespoke artisan pieces), featuring a Next.js storefront and a robust Node.js/Express + Supabase PostgreSQL backend.

---

## 🏛️ Project Architecture

```
abckend/
├── Site_project/             # Next.js 16 (App Router + Turbopack + TailwindCSS)
│   ├── src/
│   │   ├── app/              # Routes: /, /collections, /products/[slug], /sales, /contact, /about, /faqs
│   │   ├── components/       # Nav, Footer, ProductCard, CartDrawer, CheckoutModal, etc.
│   │   ├── context/          # Stateful Cart Context (Local + Supabase sync)
│   │   ├── lib/              # API Client & Backend Connectors
│   │   └── page/             # Modular Page View Components
│   └── package.json          # Frontend dependencies & scripts
│
├── src/                      # Node.js + Express Backend
│   ├── config/               # Supabase Client & Database configuration
│   ├── controllers/          # Products, Cart, Checkout (COD/Stripe), Contact, MCP
│   ├── middleware/           # Rate limiting, Cart sessions, Error handling
│   ├── routes/               # API route definitions (/api/*)
│   ├── utils/                # Standardized API response formatters & seed scripts
│   └── server.js             # Express application entrypoint
│
├── supabase/                 # Database Schema & Seed Data
│   ├── schema.sql            # Full PostgreSQL schema with RLS & indexes
│   └── seed.sql              # Woody Home product catalog seed dataset
│
├── test/                     # Automated Unit & Integration Tests
├── .env.example              # Sample environment variables
├── .gitignore                # Production git ignore rules
└── package.json              # Monorepo workspace scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- A [Supabase](https://supabase.com) account (or existing PostgreSQL database)

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root directory:
```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

FRONTEND_URL=http://localhost:3000
WHATSAPP_PHONE=923326457322

# Optional Stripe Integration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Installation & Running

```bash
# 1. Install Backend Dependencies
npm install

# 2. Install Frontend Dependencies
npm install --prefix Site_project

# 3. Run Backend Server (Runs on http://localhost:5000)
npm run dev

# 4. In a separate terminal, run Frontend (Runs on http://localhost:3000)
npm run dev:frontend
```

---

## 📡 Backend API Endpoints

### 1. Products & Collections (Catalog API)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Paginated product listing (`?category=lamps&page=1&limit=20`) |
| `GET` | `/api/products/:slug` | Detailed product information with variants & images |
| `GET` | `/api/collections` | All product collections with item counts |
| `GET` | `/api/search/suggest?q=...` | Predictive search suggestions |

### 2. Stateful Cart Sessions
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cart` | Retrieve current cart session |
| `POST`| `/api/cart/add` | Add variant with custom engraved name |
| `PATCH`| `/api/cart/item/:id` | Update item quantity or specifications |
| `DELETE`| `/api/cart/item/:id`| Remove single line item |
| `DELETE`| `/api/cart/clear` | Empty active cart |

### 3. Checkout & Payment
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/checkout/order` | Place Cash on Delivery (COD) order with coupon deduction, WhatsApp link & email |
| `POST` | `/api/checkout/stripe-session` | Initialize Stripe checkout session |
| `GET`  | `/api/checkout/stripe-verify/:id` | Verify card payment & finalize order |
| `GET`  | `/api/orders/track/:order_number` | Live order status tracking |

### 4. Coupons & Cart Discounts
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/cart/apply-coupon` | Validate & apply coupon code (`{ "code": "EID10" }`) |
| `DELETE`| `/api/cart/remove-coupon` | Remove coupon from active cart |
| `GET`  | `/api/admin/coupons` | [Admin] List all discount coupons |
| `POST` | `/api/admin/coupons` | [Admin] Create percentage or fixed discount coupon |
| `DELETE`| `/api/admin/coupons/:id` | [Admin] Delete coupon |

### 5. Product Reviews & Ratings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/products/:slug/reviews` | Retrieve approved reviews with average rating |
| `POST` | `/api/products/:slug/reviews` | Submit a customer rating and review |
| `GET`  | `/api/admin/reviews` | [Admin] Review moderation list |
| `PATCH`| `/api/admin/reviews/:id/approve` | [Admin] Toggle review approval status |
| `DELETE`| `/api/admin/reviews/:id` | [Admin] Delete spam/inappropriate review |

### 6. Customer & Admin Identity (IAM & RBAC)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account with password hashing |
| `POST` | `/api/auth/login` | Login with email & password, returns JWT token |
| `GET`  | `/api/auth/me` | Fetch authenticated user profile |
| `GET`  | `/api/auth/orders` | Fetch customer's personal order history |
| `POST` | `/api/auth/logout` | Clear authentication session |

### 7. Protected Admin Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/products` | [Admin] Create product with variants, images, & tags |
| `PUT`  | `/api/admin/products/:id` | [Admin] Update product metadata & pricing |
| `DELETE`| `/api/admin/products/:id` | [Admin] Delete/archive product |
| `PATCH`| `/api/admin/variants/:id/inventory` | [Admin] Update stock quantity & price |
| `POST` | `/api/admin/categories` | [Admin] Create collection/category |
| `PUT`  | `/api/admin/categories/:id` | [Admin] Update category |
| `DELETE`| `/api/admin/categories/:id` | [Admin] Delete category |
| `GET`  | `/api/admin/orders` | [Admin] Paginated order list with search & status filters |
| `PATCH`| `/api/admin/orders/:id/status` | [Admin] Update order fulfillment status |

---

## 🛡️ Code Quality & Standards

- **TypeScript Strict Checking**: Frontend validated with `npm run build`
- **Unit & Integration Tests**: Run with `npm test`
- **Security**: Helmet HTTP headers, express rate limiting, JWT + bcrypt authentication
- **Responsive Aesthetics**: Tailored gold/charcoal palette with high-contrast typography

