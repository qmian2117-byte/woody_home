import { supabase } from '../config/supabase.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * GET /api/search/suggest?q={term}
 * High-performance predictive search for Next.js search bar
 */
export const searchSuggest = async (req, res, next) => {
  try {
    const { q = '', limit = 8 } = req.query;
    const queryTerm = q.trim();

    if (!queryTerm || queryTerm.length < 2) {
      return successResponse(res, 'Empty search', { results: [] });
    }

    const limitNum = Math.min(parseInt(limit, 10) || 8, 20);

    // Search across products title, body_html, and tags
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        product_type,
        variants:product_variants(id, price, compare_at_price, is_available),
        images:product_images(image_url, position)
      `)
      .eq('is_published', true)
      .ilike('title', `%${queryTerm}%`)
      .limit(limitNum);

    if (error) throw error;

    const formattedResults = (products || []).map(p => {
      const defaultVariant = p.variants?.[0] || null;
      const sortedImages = (p.images || []).sort((a, b) => a.position - b.position);

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: p.product_type,
        url: `/products/${p.slug}`,
        thumbnail: sortedImages[0]?.image_url || null,
        price: defaultVariant ? parseFloat(defaultVariant.price) : 0,
        compare_at_price: defaultVariant?.compare_at_price ? parseFloat(defaultVariant.compare_at_price) : null,
        is_available: defaultVariant?.is_available ?? false
      };
    });

    return successResponse(res, 'Search suggestions retrieved', {
      query: queryTerm,
      count: formattedResults.length,
      results: formattedResults
    });
  } catch (err) {
    next(err);
  }
};
