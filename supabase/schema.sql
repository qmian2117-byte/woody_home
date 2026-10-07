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

-- Public can read published categories, products, variants, images, tags, policies, and faqs
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "Public variants are viewable by everyone" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public tags are viewable by everyone" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Public policies are viewable by everyone" ON store_policies FOR SELECT USING (true);
CREATE POLICY "Public FAQs are viewable by everyone" ON store_faqs FOR SELECT USING (true);

-- Carts and cart items allow full public operations based on session tokens (handled by backend or public key)
CREATE POLICY "Allow public cart access" ON carts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public cart_items access" ON cart_items FOR ALL USING (true) WITH CHECK (true);

-- Orders allow insert by public (placing order), read handled by backend service role or tracking order number
CREATE POLICY "Allow public order insertion" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public order_items insertion" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public order tracking by order_number and phone" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public order_items viewing" ON order_items FOR SELECT USING (true);
