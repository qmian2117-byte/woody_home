-- ================================================================================
-- GLOSSY WOODS SEED DATA (Valid Hexadecimal UUIDs: 0-9, a-f)
-- ================================================================================

-- 1. Insert Categories
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Lamps', 'lamps', 'Handcrafted wooden ambient and decorative lamps.', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_robot_dog_lamp_6.webp'),
    ('c0000000-0000-0000-0000-000000000002', 'Home Decor', 'home-decor', 'Artisan wooden sculptures, desk accessories, and organizers.', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_markhor_coffee_table.webp'),
    ('c0000000-0000-0000-0000-000000000003', 'Cars', 'cars', 'Handcrafted wooden vintage vehicles and collectible models.', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_jeep_office_desk_1.webp'),
    ('c0000000-0000-0000-0000-000000000004', 'Air Crafts', 'air-crafts', 'Handcrafted aircraft models and fighter jets.', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/collections/wooden_jet_isometric.webp')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Products
INSERT INTO products (id, category_id, title, slug, body_html, vendor, product_type, is_published)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-000000000001',
        'Hexagon Wooden Table Lamp | Handmade Decorative Light',
        'hexagon-wooden-table-lamp',
        '<p>Bring warmth and character into your home with our Hexagon Wooden Table Lamp featuring a unique geometric hexagon-inspired wooden frame.</p>',
        'Glossy Woods',
        'Lamps',
        true
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-000000000001',
        'Custom Name Wooden LED Lamp',
        'custom-name-wooden-led-lamp',
        '<p>Make your space more personal with our Personalized Wooden Name LED Lamp, beautifully crafted to display a name or special text in an elegant wooden design.</p>',
        'Glossy Woods',
        'Lamps',
        true
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-000000000002',
        'Mini Handcrafted Wooden Deer Sculpture – Rustic Gift Décor',
        'mini-handcrafted-wooden-deer-sculpture',
        '<p>Simple, elegant and beautifully handcrafted wooden deer sculpture featuring a slender silhouette, detailed antlers and a rich polished finish.</p>',
        'Glossy Woods',
        'Home Decor',
        true
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-000000000003',
        'Handcrafted Wooden Jeep Model – Rustic Vintage Car Décor',
        'handcrafted-wooden-jeep-model-vintage-car',
        '<p>A timeless piece for automobile and military-style décor lovers. Features rugged body, detailed wheels and classic boxy styling in natural wood.</p>',
        'Glossy Woods',
        'Cars',
        true
    )
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Product Variants
INSERT INTO product_variants (id, product_id, title, sku, price, compare_at_price, inventory_quantity, requires_shipping, weight_grams, is_available)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Default Title', 'GW-HXL-001', 2400.00, 2900.00, 25, true, 800, true),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Default Title', 'GW-PNL-001', 2599.00, 3400.00, 50, true, 900, true),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Default Title', 'GW-DER-010', 2399.00, 2899.00, 15, true, 500, true),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'Default Title', 'GW-JEP-009', 1999.00, 2799.00, 30, true, 1100, true)
ON CONFLICT (sku) DO NOTHING;

-- 4. Insert Product Images
INSERT INTO product_images (product_id, image_url, alt_text, position)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083', 'Hexagon Wooden Table Lamp Front View', 1),
    ('a0000000-0000-0000-0000-000000000002', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/WhatsAppImage2026-09-06at4.24.36PM.jpg?v=1788694196', 'Custom Name Wooden LED Lamp Glow', 1),
    ('a0000000-0000-0000-0000-000000000003', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_markhor_office_d92d6497-7baf-433e-a5f3-66334d9399a8.webp?v=1786692222', 'Wooden Deer Sculpture On Desk', 1),
    ('a0000000-0000-0000-0000-000000000004', 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_jeep_office_desk_1.webp?v=1786691837', 'Wooden Jeep Vintage Car Desk View', 1);

-- 5. Insert Product Tags
INSERT INTO product_tags (product_id, tag)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'hexagon lamp'),
    ('a0000000-0000-0000-0000-000000000001', 'table lamp'),
    ('a0000000-0000-0000-0000-000000000001', 'ambient lighting'),
    ('a0000000-0000-0000-0000-000000000002', 'custom name lamp'),
    ('a0000000-0000-0000-0000-000000000002', 'personalized gift'),
    ('a0000000-0000-0000-0000-000000000002', 'LED lamp'),
    ('a0000000-0000-0000-0000-000000000003', 'deer sculpture'),
    ('a0000000-0000-0000-0000-000000000003', 'handmade gift'),
    ('a0000000-0000-0000-0000-000000000004', 'wooden jeep'),
    ('a0000000-0000-0000-0000-000000000004', 'vintage car decor')
ON CONFLICT DO NOTHING;

-- 6. Insert Store Policies
INSERT INTO store_policies (type, title, content)
VALUES
    ('shipping', 'Shipping Policy', 'We deliver across Pakistan via reliable courier services (TCS, Trax, Leopard). Delivery typically takes 3-5 business days. Cash on delivery (COD) is available nationwide.'),
    ('return', 'Return & Refund Policy', 'We offer a 7-day checking warranty on all non-customized products. If an item arrives damaged, notify us immediately on WhatsApp (+923326457322) with unboxing photos for a free replacement.'),
    ('contact', 'Contact Information', 'Glossy Woods Customer Support: Phone/WhatsApp: +923326457322. Operating hours: Monday to Saturday, 10:00 AM to 8:00 PM PKT.')
ON CONFLICT (type) DO UPDATE SET content = EXCLUDED.content;

-- 7. Insert Store FAQs
INSERT INTO store_faqs (question, answer, category)
VALUES
    ('How can I customize my name on a wooden lamp?', 'You can enter your name in the personalization text field on the product page or contact us directly on WhatsApp (+923326457322) with your order number.', 'customization'),
    ('Do you offer Cash on Delivery (COD)?', 'Yes, Cash on Delivery is available across all cities and towns in Pakistan.', 'payment'),
    ('How long does delivery take?', 'Standard delivery takes 3 to 5 business days across Pakistan. Custom engraved lamps may take 1-2 additional days for carving.', 'shipping'),
    ('What is your customer support contact?', 'You can reach us directly via WhatsApp or phone call at +923326457322.', 'support');
