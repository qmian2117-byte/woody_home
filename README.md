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
| `POST` | `/api/checkout/order` | Place Cash on Delivery (COD) order & generate WhatsApp link |
| `POST` | `/api/checkout/stripe-session` | Initialize Stripe checkout session |
| `GET`  | `/api/checkout/stripe-verify/:id` | Verify card payment & finalize order |

---

## 🛡️ Code Quality & Standards

- **TypeScript Strict Checking**: Frontend validated with `npm run build`
- **Unit & Integration Tests**: Run with `npm test`
- **Security**: Helmet HTTP headers, express rate limiting, protected `.env` credentials
- **Responsive Aesthetics**: Tailored gold/charcoal palette with high-contrast typography
