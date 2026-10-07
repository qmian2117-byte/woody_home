import { hasSupabaseServiceRole, supabase, supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * GET /api/products
 * Query Params: category, sort, page, limit
 */
export const getProducts = async (req, res, next) => {
  try {
    const { category, sort = 'latest', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        body_html,
        vendor,
        product_type,
        created_at,
        category:categories(id, name, slug),
        variants:product_variants(id, title, sku, price, compare_at_price, inventory_quantity, is_available),
        images:product_images(id, image_url, alt_text, position),
        tags:product_tags(tag)
      `, { count: 'exact' })
      .eq('is_published', true);

    // Filter by Category Slug
    if (category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .maybeSingle();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    // Sorting
    if (sort === 'price_asc') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'price_desc') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data: products, count, error } = await query;

    if (error) throw error;

    // Format products for clean Next.js ingestion (matching ProductCardProps)
    const formattedProducts = (products || []).map(p => {
      const defaultVariant = p.variants?.[0] || null;
      const sortedImages = (p.images || []).sort((a, b) => a.position - b.position);
      const priceNum = defaultVariant ? parseFloat(defaultVariant.price) : 0;
      const compareNum = defaultVariant?.compare_at_price ? parseFloat(defaultVariant.compare_at_price) : null;
      const savePercent = compareNum && compareNum > priceNum
        ? Math.round(((compareNum - priceNum) / compareNum) * 100)
        : 0;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.body_html,
        vendor: p.vendor || 'Woody Home',
        product_type: p.product_type,
        category: p.category,
        primary_image: sortedImages[0]?.image_url || '',
        image: sortedImages[0]?.image_url || '',
        images: sortedImages.map(img => img.image_url),
        href: `/products/${p.slug}`,
        price: `Rs. ${priceNum.toLocaleString()}`,
        priceRaw: priceNum,
        comparePrice: compareNum ? `Rs. ${compareNum.toLocaleString()}` : undefined,
        compareRaw: compareNum || undefined,
        savePercent: savePercent > 0 ? savePercent : undefined,
        badge: savePercent > 0 ? 'sale' : 'new',
        rating: 4.8,
        reviewCount: 248,
        is_available: defaultVariant?.is_available ?? false,
        variants: p.variants,
        tags: (p.tags || []).map(t => t.tag)
      };
    });

    return successResponse(res, 'Products retrieved successfully', {
      products: formattedProducts,
      pagination: {
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil((count || 0) / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/products/:slug
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        body_html,
        vendor,
        product_type,
        created_at,
        category:categories(id, name, slug),
        variants:product_variants(id, title, sku, price, compare_at_price, inventory_quantity, weight_grams, requires_shipping, is_available),
        images:product_images(id, image_url, alt_text, position),
        tags:product_tags(tag)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    if (!product) {
      return errorResponse(res, 'Product not found', null, 404);
    }

    const sortedImages = (product.images || []).sort((a, b) => a.position - b.position);
    const defaultVariant = product.variants?.[0] || null;
    const priceNum = defaultVariant ? parseFloat(defaultVariant.price) : 0;
    const compareNum = defaultVariant?.compare_at_price ? parseFloat(defaultVariant.compare_at_price) : null;
    const savePercent = compareNum && compareNum > priceNum
      ? Math.round(((compareNum - priceNum) / compareNum) * 100)
      : 0;

    // Colors list from variants or default
    const colors = product.variants?.length > 1
      ? product.variants.map(v => v.title)
      : ['Natural Polished', 'Dark Walnut', 'Teak'];

    // Fetch recommendations (related products)
    const { data: relatedProducts } = await supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        vendor,
        variants:product_variants(price, compare_at_price),
        images:product_images(image_url, position)
      `)
      .neq('id', product.id)
      .limit(4);

    const formattedRecommendations = (relatedProducts || []).map(rp => {
      const rpVar = rp.variants?.[0];
      const rpPrice = rpVar ? parseFloat(rpVar.price) : 0;
      const rpCompare = rpVar?.compare_at_price ? parseFloat(rpVar.compare_at_price) : undefined;
      const rpImages = (rp.images || []).sort((a, b) => a.position - b.position);

      return {
        title: rp.title,
        price: `Rs. ${rpPrice.toLocaleString()}`,
        comparePrice: rpCompare ? `Rs. ${rpCompare.toLocaleString()}` : undefined,
        saveBadge: rpCompare ? `Save ${Math.round(((rpCompare - rpPrice) / rpCompare) * 100)}%` : undefined,
        image: rpImages[0]?.image_url || '',
        href: `/products/${rp.slug}`,
        vendor: rp.vendor || 'Woody Home',
        rating: 5,
        reviewCount: 220
      };
    });

    const formattedProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      vendor: product.vendor || 'Woody Home',
      price: `Rs. ${priceNum.toLocaleString()}`,
      priceRaw: priceNum,
      comparePrice: compareNum ? `Rs. ${compareNum.toLocaleString()}` : undefined,
      compareRaw: compareNum || undefined,
      savePercent: savePercent > 0 ? savePercent : undefined,
      rating: 4.9,
      reviewCount: 261,
      category: product.category?.name || 'Handcrafted Decor',
      categorySlug: product.category?.slug || 'home-decor',
      tags: (product.tags || []).map(t => t.tag).join(', '),
      sku: defaultVariant?.sku || 'GW-001',
      inStock: defaultVariant?.is_available ?? true,
      colors: colors,
      images: sortedImages.map(img => img.image_url),
      variants: product.variants,
      description: {
        heading: product.title,
        intro: [product.body_html?.replace(/<[^>]*>?/gm, '') || 'Premium handcrafted woodwork from Glossy Woods.'],
        customizationNote: product.title.toLowerCase().includes('custom') || product.title.toLowerCase().includes('name')
          ? 'Enter your name or special text below for custom carving. Our artisans will craft it specially for you.'
          : undefined,
        whatsappNote: 'Contact us directly on WhatsApp (+923326457322) for custom design proofs and personalization requests.',
        highlights: [
          'Crafted from 100% genuine natural wood with rich organic grain',
          'Hand-polished smooth protective finish',
          'Generations of artisan craftsmanship from Chiniot, Pakistan',
          'Perfect for home, executive desk, bedside, or premium gifting'
        ],
        specifications: [
          { label: 'Brand', value: 'Woody Home' },
          { label: 'Material', value: 'Premium Natural Sheesham Wood' },
          { label: 'Finish', value: 'Artisan Hand-Polished' },
          { label: 'Origin', value: 'Chiniot, Punjab, Pakistan' },
          { label: 'SKU', value: defaultVariant?.sku || 'GW-PROD' },
          { label: 'Shipping', value: 'Nationwide Delivery with Cash on Delivery (COD)' }
        ],
        bestFor: ['Home Decor', 'Office & Desk', 'Special Gift', 'Birthday & Anniversary'],
        packageIncludes: ['1x Handcrafted Masterpiece', 'Protective Cushion Packaging', 'Care Instruction Card']
      },
      shippingReturns: {
        standard: '3 – 5 business days delivery nationwide across Pakistan.',
        express: 'Priority dispatch available upon request via WhatsApp.',
        freeShipping: 'Cash on Delivery (COD) available in all major cities and towns.',
        returns: '7-day checking warranty for unboxing inspection. Direct replacement on transit damage.'
      },
      sizeGuide: 'Standard handcrafted tabletop dimensions. Suitable for desks, shelves, and bedside stands.',
      recommendations: formattedRecommendations
    };

    return successResponse(res, 'Product retrieved successfully', formattedProduct);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/collections (Categories)
 */
export const getCollections = async (req, res, next) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        slug,
        description,
        image_url,
        products:products(count)
      `)
      .order('name');

    if (error) throw error;

    const formatted = (categories || []).map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.image_url,
      products_count: c.products?.[0]?.count || 0
    }));

    return successResponse(res, 'Collections retrieved successfully', formatted);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/faqs
 */
export const getFaqs = async (req, res, next) => {
  try {
    const { data: faqs, error } = await supabase
      .from('store_faqs')
      .select('id, question, answer, category')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return successResponse(res, 'FAQs retrieved', faqs || []);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/products
 */
export const createProduct = async (req, res, next) => {
  try {
    if (!hasSupabaseServiceRole) {
      return errorResponse(res, 'Supabase service role key is required for admin product creation', null, 503);
    }

    const {
      title,
      slug,
      category_id,
      body_html,
      product_type,
      vendor = 'Woody Home',
      variants = [],
      images = [],
      tags = []
    } = req.body;

    if (!title || !slug || !product_type) {
      return errorResponse(res, 'Title, slug, and product_type are required', null, 400);
    }

    const { data: product, error: prodError } = await supabaseAdmin
      .from('products')
      .insert([{ title, slug, category_id, body_html, product_type, vendor }])
      .select()
      .single();

    if (prodError) throw prodError;

    if (variants.length > 0) {
      const variantRows = variants.map(v => ({
        product_id: product.id,
        title: v.title || 'Default Title',
        sku: v.sku,
        price: v.price || 0,
        compare_at_price: v.compare_at_price || null,
        inventory_quantity: v.inventory_quantity ?? 10,
        is_available: v.is_available ?? true
      }));
      await supabaseAdmin.from('product_variants').insert(variantRows);
    }

    if (images.length > 0) {
      const imageRows = images.map((img, idx) => ({
        product_id: product.id,
        image_url: typeof img === 'string' ? img : img.image_url,
        alt_text: img.alt_text || title,
        position: idx + 1
      }));
      await supabaseAdmin.from('product_images').insert(imageRows);
    }

    if (tags.length > 0) {
      const tagRows = tags.map(tag => ({
        product_id: product.id,
        tag
      }));
      await supabaseAdmin.from('product_tags').insert(tagRows);
    }

    return successResponse(res, 'Product created successfully', product, 201);
  } catch (err) {
    next(err);
  }
};
