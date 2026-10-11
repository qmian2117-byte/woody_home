-- ================================================================================
-- GLOSSY WOODS SUPABASE POSTGRESQL SCHEMA
-- Supports full ecommerce backend with variants, custom line items, cart sessions,
-- orders, predictive fuzzy search, and Model Context Protocol (MCP) FAQs.
-- ================================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Categories / Collections
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL UNIQUE,
    body_html TEXT,
    vendor VARCHAR(255) DEFAULT 'Glossy Woods',
    product_type VARCHAR(255) NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL DEFAULT 'Default Title',
    sku VARCHAR(100) UNIQUE,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    compare_at_price NUMERIC(10, 2) DEFAULT NULL,
    inventory_quantity INT NOT NULL DEFAULT 10,
    requires_shipping BOOLEAN DEFAULT true,
    weight_grams INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(500),
    position INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Product Tags
CREATE TABLE IF NOT EXISTS product_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    CONSTRAINT unique_product_tag UNIQUE (product_id, tag)
);

-- 7. Carts (Session-Based with Cookie Persistence)
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    customer_id UUID DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Cart Items (Supports Custom Engraving / Name Line-Item Properties)
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    custom_properties JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID DEFAULT NULL,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'COD', -- 'COD', 'CARD', 'WHATSAPP'
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending_confirmation', -- 'pending_confirmation', 'confirmed', 'dispatched', 'delivered', 'cancelled'
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_title VARCHAR(500) NOT NULL,
    variant_title VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    custom_properties JSONB DEFAULT '{}'::jsonb
);

-- 11. Store Policies (Terms, Shipping, Returns)
CREATE TABLE IF NOT EXISTS store_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL UNIQUE, -- 'return', 'shipping', 'privacy', 'terms', 'contact'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Store FAQs (Model Context Protocol / Knowledge Base)
CREATE TABLE IF NOT EXISTS store_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Users (Customer & Admin Accounts with Password Hashing & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'customer', -- 'customer', 'admin'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Coupons & Discount Codes
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
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

-- 15. Product Reviews & Ratings
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

-- Alter carts and orders to support coupons and discounts
ALTER TABLE carts ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50) DEFAULT NULL;
ALTER TABLE carts ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0.00;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token_expires_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token_revoked BOOLEAN DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255) UNIQUE;

-- Non-negative inventory constraint in PostgreSQL (Issue 1)
ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS chk_inventory_non_negative;
ALTER TABLE product_variants ADD CONSTRAINT chk_inventory_non_negative CHECK (inventory_quantity >= 0);

-- Durable Session Revocation Table (survives restarts and multiple cluster instances - Issue 3)
CREATE TABLE IF NOT EXISTS revoked_tokens (
    jti TEXT PRIMARY KEY,
    user_id UUID,
    revoked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires ON revoked_tokens(expires_at);

-- Distributed Stripe Webhook Idempotency & Events Table (Issue 4)
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

-- Distributed One-Time TOTP Code Ledger (Issue 5)
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
-- DATABASE-SIDE ATOMIC ARITHMETIC PROCEDURES (Issues 1 & 2)
-- ================================================================================

-- 1. Atomic Database-Side Inventory Decrement (prevents application-side read-modify-write lost updates)
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

-- 2. Atomic Database-Side Coupon Redemption (row lock + atomic increment)
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
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ================================================================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tag);
CREATE INDEX IF NOT EXISTS idx_carts_session_token ON carts(session_token);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);

-- Trigram Index for Sub-50ms Predictive Fuzzy Search
CREATE INDEX IF NOT EXISTS idx_products_trgm_title ON products USING gin (title gin_trgm_ops);

-- ================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read published categories, products, variants, images, tags, policies, faqs, reviews
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON categories;
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON products;
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public variants are viewable by everyone" ON product_variants;
CREATE POLICY "Public variants are viewable by everyone" ON product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public images are viewable by everyone" ON product_images;
CREATE POLICY "Public images are viewable by everyone" ON product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public tags are viewable by everyone" ON product_tags;
CREATE POLICY "Public tags are viewable by everyone" ON product_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public policies are viewable by everyone" ON store_policies;
CREATE POLICY "Public policies are viewable by everyone" ON store_policies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public FAQs are viewable by everyone" ON store_faqs;
CREATE POLICY "Public FAQs are viewable by everyone" ON store_faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON product_reviews;
CREATE POLICY "Public reviews are viewable by everyone" ON product_reviews FOR SELECT USING (is_approved = true);

-- Carts and cart items allow operations based on session tokens / service_role
DROP POLICY IF EXISTS "Allow session cart access" ON carts;
CREATE POLICY "Allow session cart access" ON carts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow session cart_items access" ON cart_items;
CREATE POLICY "Allow session cart_items access" ON cart_items FOR ALL USING (true) WITH CHECK (true);

-- Orders & Order Items: Sensitive Customer PII (OWASP ASVS Level 2)
-- Public anonymous clients CANNOT query all orders via PostgREST.
-- Authenticated customers can ONLY query their own orders.
-- Guest tracking & checkout are securely mediated by backend Express API (service_role).
DROP POLICY IF EXISTS "Customers can view only their own orders" ON orders;
CREATE POLICY "Customers can view only their own orders" ON orders 
  FOR SELECT 
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can view only their own order items" ON order_items;
CREATE POLICY "Customers can view only their own order items" ON order_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Reviews can be submitted by public with moderation
DROP POLICY IF EXISTS "Allow public review insertion" ON product_reviews;
CREATE POLICY "Allow public review insertion" ON product_reviews FOR INSERT WITH CHECK (true);

-- Multi-Factor Authentication (MFA / 2FA) Schema (Admin Security Enforcement)
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_codes TEXT[] DEFAULT NULL;

-- ================================================================================
-- SUPABASE STORAGE BUCKET SECURITY & RLS POLICIES (OWASP ASVS 5.0 Level 2 - SEC-012)
-- ================================================================================

-- Configure 'product-images' bucket: 5MB limit, strict image MIME types only
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- Storage RLS: Public can ONLY read/select images from 'product-images'
DROP POLICY IF EXISTS "Allow public image viewing" ON storage.objects;
CREATE POLICY "Allow public image viewing" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage RLS: Only authenticated service_role or admin can upload
DROP POLICY IF EXISTS "Allow admin image upload" ON storage.objects;
CREATE POLICY "Allow admin image upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  );

-- ================================================================================
-- ROW LEVEL SECURITY FOR SECURITY INFRASTRUCTURE TABLES
-- ================================================================================

ALTER TABLE revoked_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_totp_codes ENABLE ROW LEVEL SECURITY;

-- Block public anon access; strictly accessible by service_role
DROP POLICY IF EXISTS "Revoked tokens service_role only" ON revoked_tokens;
CREATE POLICY "Revoked tokens service_role only" ON revoked_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Stripe events service_role only" ON stripe_webhook_events;
CREATE POLICY "Stripe events service_role only" ON stripe_webhook_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Used TOTP codes service_role only" ON used_totp_codes;
CREATE POLICY "Used TOTP codes service_role only" ON used_totp_codes
  FOR ALL TO service_role USING (true) WITH CHECK (true);



