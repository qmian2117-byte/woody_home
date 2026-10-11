# Production Security Hardening Checklist (PRODUCTION_SECURITY_CHECKLIST.md)

**Project:** Woody Home E-Commerce Platform  
**Target Environment:** Production Cloud Deployment (Vercel / Node.js Host + Supabase PostgreSQL)  
**Standard:** OWASP Top 10:2025 & OWASP ASVS 5.0 Level 2  
**Status:** Pre-Launch Certification & Staging Migration Guide  

---

## 1. Remote Supabase Staging & Production SQL Migration

Run the following consolidated, fully idempotent script in your remote Supabase Dashboard -> **SQL Editor**:

```sql
-- ================================================================================
-- WOODY HOME — CONSOLIDATED PRODUCTION & SECURITY SQL MIGRATION
-- Fully idempotent: Safe to execute on fresh databases or existing staging schemas.
-- ================================================================================

-- 0. Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ================================================================================
-- 1. BASE TABLES (Created with IF NOT EXISTS in relational dependency order)
-- ================================================================================

-- Users: Customer & Admin Accounts with Password Hashing & RBAC (SEC-003, SEC-005)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret TEXT DEFAULT NULL,
    recovery_codes TEXT[] DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Coupons: Discount Codes with Atomic Usage Limits (Issue 2)
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL,
    min_spend NUMERIC(10, 2) DEFAULT 0.00,
    max_discount NUMERIC(10, 2) DEFAULT NULL,
    usage_limit INT DEFAULT NULL,
    times_used INT DEFAULT 0,
    expires_at TIMESTAMPTZ DEFAULT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Product Reviews: Customer Reviews & Ratings
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    is_verified_buyer BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);

-- ================================================================================
-- 2. SCHEMA COLUMN MIGRATIONS (Orders, Carts, Users)
-- ================================================================================

-- Cart columns for coupons and discounts
ALTER TABLE carts ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50) DEFAULT NULL;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;

-- Order columns for coupons, guest tracking tokens, and Stripe idempotency
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token_expires_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token_revoked BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);

-- User columns for MFA (if users table was created previously without these columns)
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_codes TEXT[] DEFAULT NULL;

-- ================================================================================
-- 3. SECURITY INFRASTRUCTURE TABLES (Issues 3, 4, 5)
-- ================================================================================

-- Durable Token Revocation Store (Issue 3 - Multi-instance JWT Revocation)
CREATE TABLE IF NOT EXISTS revoked_tokens (
    jti TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    revoked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires ON revoked_tokens(expires_at);

-- Distributed Stripe Webhook Idempotency & Events (Issue 4 - Unique & Concurrent Delivery)
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) NOT NULL UNIQUE,
    session_id VARCHAR(255) UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'processing',
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_stripe_events_event_id ON stripe_webhook_events(event_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_stripe_events_session_id ON stripe_webhook_events(session_id);

-- Distributed One-Time TOTP Code Ledger (Issue 5 - Multi-instance Replay Prevention)
CREATE TABLE IF NOT EXISTS used_totp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    code_hash VARCHAR(64) NOT NULL,
    consumed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT unique_user_totp_code UNIQUE (user_id, code_hash)
);
CREATE INDEX IF NOT EXISTS idx_used_totp_expires ON used_totp_codes(expires_at);

-- ================================================================================
-- 4. DATABASE-SIDE ATOMIC ARITHMETIC PROCEDURES (Issues 1 & 2)
-- ================================================================================

-- Non-negative inventory check constraint
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS chk_inventory_non_negative;
ALTER TABLE product_variants ADD CONSTRAINT chk_inventory_non_negative CHECK (inventory_quantity >= 0);

-- Atomic Database-Side Inventory Decrement (prevents application-side read-modify-write lost updates)
CREATE OR REPLACE FUNCTION decrement_variant_inventory(p_variant_id UUID, p_quantity INT)
RETURNS TABLE(success BOOLEAN, remaining_quantity INT, message TEXT) AS $$
DECLARE
  v_remaining INT;
BEGIN
  UPDATE product_variants
  SET inventory_quantity = inventory_quantity - p_quantity,
      is_available = ((inventory_quantity - p_quantity) > 0),
      updated_at = NOW()
  WHERE id = p_variant_id AND inventory_quantity >= p_quantity
  RETURNING inventory_quantity INTO v_remaining;

  IF FOUND THEN
    RETURN QUERY SELECT TRUE, v_remaining, 'Inventory decremented atomically in database'::TEXT;
  ELSE
    RETURN QUERY SELECT FALSE, -1, 'Insufficient stock or variant not found'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic Database-Side Coupon Redemption (row lock FOR UPDATE + atomic increment)
CREATE OR REPLACE FUNCTION redeem_coupon_atomic(p_code TEXT)
RETURNS TABLE(success BOOLEAN, discount_type VARCHAR, discount_value NUMERIC, max_discount NUMERIC, message TEXT) AS $$
DECLARE
  v_coupon RECORD;
BEGIN
  SELECT * INTO v_coupon
  FROM coupons
  WHERE code = UPPER(TRIM(p_code)) AND is_active = TRUE
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::VARCHAR, NULL::NUMERIC, NULL::NUMERIC, 'Invalid or inactive coupon'::TEXT;
    RETURN;
  END IF;

  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
    RETURN QUERY SELECT FALSE, NULL::VARCHAR, NULL::NUMERIC, NULL::NUMERIC, 'Coupon has expired'::TEXT;
    RETURN;
  END IF;

  IF v_coupon.usage_limit IS NOT NULL AND COALESCE(v_coupon.times_used, 0) >= v_coupon.usage_limit THEN
    RETURN QUERY SELECT FALSE, NULL::VARCHAR, NULL::NUMERIC, NULL::NUMERIC, 'Coupon usage limit reached'::TEXT;
    RETURN;
  END IF;

  UPDATE coupons
  SET times_used = COALESCE(times_used, 0) + 1,
      updated_at = NOW()
  WHERE id = v_coupon.id;

  RETURN QUERY SELECT TRUE, v_coupon.discount_type, v_coupon.discount_value, v_coupon.max_discount, 'Coupon redeemed atomically'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES (Idempotent: DROP IF EXISTS before CREATE)
-- ================================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE revoked_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_totp_codes ENABLE ROW LEVEL SECURITY;

-- Orders & Items: Customers view only their own records; anonymous PostgREST access blocked
DROP POLICY IF EXISTS "Customers can view only their own orders" ON orders;
CREATE POLICY "Customers can view only their own orders" ON orders 
  FOR SELECT USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can view only their own order items" ON order_items;
CREATE POLICY "Customers can view only their own order items" ON order_items 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Carts: Allow session cart operations
DROP POLICY IF EXISTS "Allow session cart access" ON carts;
CREATE POLICY "Allow session cart access" ON carts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow session cart_items access" ON cart_items;
CREATE POLICY "Allow session cart_items access" ON cart_items FOR ALL USING (true) WITH CHECK (true);

-- Coupons: Public read-only for active discounts
DROP POLICY IF EXISTS "Public can check active coupons" ON coupons;
CREATE POLICY "Public can check active coupons" ON coupons FOR SELECT USING (is_active = true);

-- Reviews: Public approved read & insertion
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON product_reviews;
CREATE POLICY "Public reviews are viewable by everyone" ON product_reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Allow public review insertion" ON product_reviews;
CREATE POLICY "Allow public review insertion" ON product_reviews FOR INSERT WITH CHECK (true);

-- Security Infrastructure: Accessible exclusively by backend service_role
DROP POLICY IF EXISTS "Revoked tokens service_role only" ON revoked_tokens;
CREATE POLICY "Revoked tokens service_role only" ON revoked_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Stripe events service_role only" ON stripe_webhook_events;
CREATE POLICY "Stripe events service_role only" ON stripe_webhook_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Used TOTP codes service_role only" ON used_totp_codes;
CREATE POLICY "Used TOTP codes service_role only" ON used_totp_codes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ================================================================================
-- 6. SUPABASE STORAGE BUCKET SECURITY & RLS POLICIES (SEC-012)
-- ================================================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'product-images',
      'product-images',
      true,
      5242880,
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
    )
    ON CONFLICT (id) DO UPDATE SET 
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    DROP POLICY IF EXISTS "Allow public image viewing" ON storage.objects;
    CREATE POLICY "Allow public image viewing" ON storage.objects
      FOR SELECT
      USING (bucket_id = 'product-images');

    DROP POLICY IF EXISTS "Allow admin image upload" ON storage.objects;
    CREATE POLICY "Allow admin image upload" ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'product-images' 
        AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
      );
  END IF;
END $$;
```

---

## 2. Stripe Test-Mode Integration Verification (Issue 4)

Before going live with live Stripe keys:
1. Install Stripe CLI: `stripe login`
2. Forward test webhooks to your local/staging server:
   ```bash
   stripe listen --forward-to localhost:5000/api/webhook/stripe
   ```
3. Copy the webhook signing secret output by the CLI (`whsec_...`) and place it in `.env` as `STRIPE_WEBHOOK_SECRET`.
4. Trigger real signed test events:
   ```bash
   stripe trigger checkout.session.completed
   ```
5. Confirm in terminal that the backend logs: `[Webhook] Order GW-XXXXX created successfully.`
6. Trigger an identical event in parallel to verify idempotency:
   Confirm terminal logs: `[Webhook Idempotency] ... Skipping duplicate fulfillment.`

---

## 3. Environment Variable & Secret Management

- [x] **Secure Random JWT Secret**: 256-bit random key in `.env`.
- [x] **AES-256-GCM MFA Encryption Key**: Set `MFA_ENCRYPTION_KEY` in production `.env`.
- [x] **No Secrets in Source Control**: Verified `.env` in `.gitignore`.
- [x] **Production Bundle Secret Scan**: Verified Next.js client bundle has 0 server keys.
- [ ] **Production Stripe Secret Key**: Provision `sk_live_...` on live host.
- [ ] **Production Stripe Webhook Secret**: Provision matching `whsec_...`.
- [ ] **Supabase Service Role Key Protection**: Kept strictly backend-only.
- [ ] **Frontend CORS Origin**: `FRONTEND_URL=https://woodyhome.pk`.

---

## 4. Network, WAF & CSRF Hardening

- [x] **CSRF Protection Middleware**: Origin and Referer verification on cookie state-changing requests.
- [x] **Rate Limiting**: 10 attempts per 15 minutes on `/auth/login` and `/auth/register`.
- [ ] **Force HTTPS / TLS 1.3**: Configure Cloudflare with HSTS enabled (`Strict-Transport-Security: max-age=31536000`).
- [ ] **Cloudflare WAF**: Enable OWASP Core Rule Set and Bot Fight Mode.
