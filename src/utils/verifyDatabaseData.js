import { supabase } from '../config/supabase.js';

async function verifyDatabaseData() {
  console.log('🔍 Checking Live Database Records...');

  // 1. Categories
  const { data: categories, error: catErr } = await supabase.from('categories').select('name, slug');
  if (catErr) console.error('Categories Error:', catErr.message);
  else console.log(`📁 Categories Found (${categories.length}):`, categories.map(c => c.name).join(', '));

  // 2. Products
  const { data: products, error: prodErr } = await supabase.from('products').select('title, slug, product_type');
  if (prodErr) console.error('Products Error:', prodErr.message);
  else {
    console.log(`🪵 Products Found (${products.length}):`);
    products.forEach((p, idx) => console.log(`   ${idx + 1}. ${p.title} (${p.product_type})`));
  }

  // 3. Variants & Pricing
  const { data: variants, error: varErr } = await supabase.from('product_variants').select('sku, price, compare_at_price');
  if (varErr) console.error('Variants Error:', varErr.message);
  else {
    console.log(`💰 Variants Found (${variants.length}):`);
    variants.forEach(v => console.log(`   SKU: ${v.sku} | Price: Rs. ${v.price} (Compare: Rs. ${v.compare_at_price})`));
  }

  // 4. FAQs
  const { data: faqs, error: faqErr } = await supabase.from('store_faqs').select('question');
  if (faqErr) console.error('FAQs Error:', faqErr.message);
  else console.log(`🤖 Store FAQs Found (${faqs.length}):`, faqs.map(f => f.question).join(' | '));
}

verifyDatabaseData();
