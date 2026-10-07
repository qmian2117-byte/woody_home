import { supabaseAdmin } from '../config/supabase.js';

async function seed() {
  console.log('🌱 Starting automatic seed data insertion into Supabase...');

  try {
    // 1. Categories
    const categories = [
      { id: 'c1111111-1111-1111-1111-111111111111', name: 'Lamps', slug: 'lamps', description: 'Handcrafted wooden ambient and decorative lamps.', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_robot_dog_lamp_6.webp' },
      { id: 'c2222222-2222-2222-2222-222222222222', name: 'Home Decor', slug: 'home-decor', description: 'Artisan wooden sculptures, desk accessories, and organizers.', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_markhor_coffee_table.webp' },
      { id: 'c3333333-3333-3333-3333-333333333333', name: 'Cars', slug: 'cars', description: 'Handcrafted wooden vintage vehicles and collectible models.', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_jeep_office_desk_1.webp' },
      { id: 'c4444444-4444-4444-4444-444444444444', name: 'Air Crafts', slug: 'air-crafts', description: 'Handcrafted aircraft models and fighter jets.', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/collections/wooden_jet_isometric.webp' }
    ];

    const { error: catErr } = await supabaseAdmin.from('categories').upsert(categories, { onConflict: 'slug' });
    if (catErr) console.error('Categories error:', catErr.message);
    else console.log('✅ Categories seeded successfully.');

    // 2. Products
    const products = [
      {
        id: 'p1111111-1111-1111-1111-111111111111',
        category_id: 'c1111111-1111-1111-1111-111111111111',
        title: 'Hexagon Wooden Table Lamp | Handmade Decorative Light',
        slug: 'hexagon-wooden-table-lamp',
        body_html: '<p>Bring warmth and character into your home with our Hexagon Wooden Table Lamp featuring a unique geometric hexagon-inspired wooden frame.</p>',
        vendor: 'Glossy Woods',
        product_type: 'Lamps',
        is_published: true
      },
      {
        id: 'p2222222-2222-2222-2222-222222222222',
        category_id: 'c1111111-1111-1111-1111-111111111111',
        title: 'Custom Name Wooden LED Lamp',
        slug: 'custom-name-wooden-led-lamp',
        body_html: '<p>Make your space more personal with our Personalized Wooden Name LED Lamp, beautifully crafted to display a name or special text in an elegant wooden design.</p>',
        vendor: 'Glossy Woods',
        product_type: 'Lamps',
        is_published: true
      },
      {
        id: 'p3333333-3333-3333-3333-333333333333',
        category_id: 'c2222222-2222-2222-2222-222222222222',
        title: 'Mini Handcrafted Wooden Deer Sculpture – Rustic Gift Décor',
        slug: 'mini-handcrafted-wooden-deer-sculpture',
        body_html: '<p>Simple, elegant and beautifully handcrafted wooden deer sculpture featuring a slender silhouette, detailed antlers and a rich polished finish.</p>',
        vendor: 'Glossy Woods',
        product_type: 'Home Decor',
        is_published: true
      },
      {
        id: 'p4444444-4444-4444-4444-444444444444',
        category_id: 'c3333333-3333-3333-3333-333333333333',
        title: 'Handcrafted Wooden Jeep Model – Rustic Vintage Car Décor',
        slug: 'handcrafted-wooden-jeep-model-vintage-car',
        body_html: '<p>A timeless piece for automobile and military-style décor lovers. Features rugged body, detailed wheels and classic boxy styling in natural wood.</p>',
        vendor: 'Glossy Woods',
        product_type: 'Cars',
        is_published: true
      }
    ];

    const { error: prodErr } = await supabaseAdmin.from('products').upsert(products, { onConflict: 'slug' });
    if (prodErr) console.error('Products error:', prodErr.message);
    else console.log('✅ Products seeded successfully.');

    // 3. Variants
    const variants = [
      { id: 'v1111111-1111-1111-1111-111111111111', product_id: 'p1111111-1111-1111-1111-111111111111', title: 'Default Title', sku: 'GW-HXL-001', price: 2400.00, compare_at_price: 2900.00, inventory_quantity: 25, is_available: true },
      { id: 'v2222222-2222-2222-2222-222222222222', product_id: 'p2222222-2222-2222-2222-222222222222', title: 'Default Title', sku: 'GW-PNL-001', price: 2599.00, compare_at_price: 3400.00, inventory_quantity: 50, is_available: true },
      { id: 'v3333333-3333-3333-3333-333333333333', product_id: 'p3333333-3333-3333-3333-333333333333', title: 'Default Title', sku: 'GW-DER-010', price: 2399.00, compare_at_price: 2899.00, inventory_quantity: 15, is_available: true },
      { id: 'v4444444-4444-4444-4444-444444444444', product_id: 'p4444444-4444-4444-4444-444444444444', title: 'Default Title', sku: 'GW-JEP-009', price: 1999.00, compare_at_price: 2799.00, inventory_quantity: 30, is_available: true }
    ];

    const { error: varErr } = await supabaseAdmin.from('product_variants').upsert(variants, { onConflict: 'sku' });
    if (varErr) console.error('Variants error:', varErr.message);
    else console.log('✅ Product Variants seeded successfully.');

    // 4. Images
    const images = [
      { product_id: 'p1111111-1111-1111-1111-111111111111', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083', alt_text: 'Hexagon Wooden Table Lamp Front View', position: 1 },
      { product_id: 'p2222222-2222-2222-2222-222222222222', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/WhatsAppImage2026-09-06at4.24.36PM.jpg?v=1788694196', alt_text: 'Custom Name Wooden LED Lamp Glow', position: 1 },
      { product_id: 'p3333333-3333-3333-3333-333333333333', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_markhor_office_d92d6497-7baf-433e-a5f3-66334d9399a8.webp?v=1786692222', alt_text: 'Wooden Deer Sculpture On Desk', position: 1 },
      { product_id: 'p4444444-4444-4444-4444-444444444444', image_url: 'https://cdn.shopify.com/s/files/1/1005/2812/8344/files/wooden_jeep_office_desk_1.webp?v=1786691837', alt_text: 'Wooden Jeep Vintage Car Desk View', position: 1 }
    ];

    const { error: imgErr } = await supabaseAdmin.from('product_images').insert(images);
    if (imgErr) console.warn('Images note:', imgErr.message);
    else console.log('✅ Images seeded successfully.');

    // 5. Tags
    const tags = [
      { product_id: 'p1111111-1111-1111-1111-111111111111', tag: 'hexagon lamp' },
      { product_id: 'p1111111-1111-1111-1111-111111111111', tag: 'table lamp' },
      { product_id: 'p2222222-2222-2222-2222-222222222222', tag: 'custom name lamp' },
      { product_id: 'p2222222-2222-2222-2222-222222222222', tag: 'personalized gift' },
      { product_id: 'p3333333-3333-3333-3333-333333333333', tag: 'deer sculpture' },
      { product_id: 'p4444444-4444-4444-4444-444444444444', tag: 'wooden jeep' }
    ];

    const { error: tagErr } = await supabaseAdmin.from('product_tags').insert(tags);
    if (tagErr) console.warn('Tags note:', tagErr.message);
    else console.log('✅ Product tags seeded successfully.');

    // 6. Policies
    const policies = [
      { type: 'shipping', title: 'Shipping Policy', content: 'We deliver across Pakistan via reliable courier services (TCS, Trax, Leopard). Delivery typically takes 3-5 business days. Cash on delivery (COD) is available nationwide.' },
      { type: 'return', title: 'Return & Refund Policy', content: 'We offer a 7-day checking warranty on all non-customized products. If an item arrives damaged, notify us immediately on WhatsApp (+923326457322) with unboxing photos for a free replacement.' },
      { type: 'contact', title: 'Contact Information', content: 'Glossy Woods Customer Support: Phone/WhatsApp: +923326457322. Operating hours: Monday to Saturday, 10:00 AM to 8:00 PM PKT.' }
    ];

    const { error: polErr } = await supabaseAdmin.from('store_policies').upsert(policies, { onConflict: 'type' });
    if (polErr) console.error('Policies error:', polErr.message);
    else console.log('✅ Store policies seeded successfully.');

    // 7. FAQs
    const faqs = [
      { question: 'How can I customize my name on a wooden lamp?', answer: 'You can enter your name in the personalization text field on the product page or contact us directly on WhatsApp (+923326457322) with your order number.', category: 'customization' },
      { question: 'Do you offer Cash on Delivery (COD)?', answer: 'Yes, Cash on Delivery is available across all cities and towns in Pakistan.', category: 'payment' },
      { question: 'How long does delivery take?', answer: 'Standard delivery takes 3 to 5 business days across Pakistan. Custom engraved lamps may take 1-2 additional days for carving.', category: 'shipping' },
      { question: 'What is your customer support contact?', answer: 'You can reach us directly via WhatsApp or phone call at +923326457322.', category: 'support' }
    ];

    const { error: faqErr } = await supabaseAdmin.from('store_faqs').insert(faqs);
    if (faqErr) console.warn('FAQs note:', faqErr.message);
    else console.log('✅ Store FAQs seeded successfully.');

    console.log('\n🎉 ALL GLOSSY WOODS DATA SEEDED SUCCESSFULLY INTO SUPABASE!');
  } catch (err) {
    console.error('Fatal seed error:', err);
  }
}

seed();
