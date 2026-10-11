import { z } from 'zod';
import { supabaseAdmin, supabase } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const reviewSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_email: z.string().email('Valid email is required').optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional().default(''),
  comment: z.string().min(5, 'Review must be at least 5 characters long')
});

/**
 * GET /api/products/:slug/reviews
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Fetch product ID
    const { data: product } = await supabase
      .from('products')
      .select('id, title')
      .eq('slug', slug)
      .maybeSingle();

    if (!product) {
      return errorResponse(res, 'Product Not Found', `No product found for slug: ${slug}`, 404);
    }

    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select('id, customer_name, rating, title, comment, is_verified_buyer, created_at')
      .eq('product_id', product.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalReviews = (reviews || []).length;
    const averageRating = totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 5.0;

    return successResponse(res, 'Reviews fetched successfully', {
      product_title: product.title,
      total_reviews: totalReviews,
      average_rating: averageRating,
      reviews: reviews || []
    });
  } catch (error) {
    next(error);
  }
};

const sanitizeText = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>"']/g, '') // Strip dangerous characters
    .trim();
};

/**
 * POST /api/products/:slug/reviews
 */
export const createProductReview = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const parse = reviewSchema.safeParse(req.body);
    if (!parse.success) {
      return errorResponse(res, 'Validation Error', parse.error.errors[0]?.message, 400);
    }

    const { customer_name, customer_email, rating, title, comment } = parse.data;

    // Sanitize user inputs against Stored XSS (SEC-011)
    const cleanName = sanitizeText(customer_name);
    const cleanTitle = sanitizeText(title);
    const cleanComment = sanitizeText(comment);

    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (!product) {
      return errorResponse(res, 'Product Not Found', `No product found for slug: ${slug}`, 404);
    }

    // Check if verified buyer (has placed an order with this email)
    let is_verified_buyer = false;
    let customer_id = req.user?.id || null;

    if (customer_email) {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('email', customer_email.toLowerCase())
        .limit(1)
        .maybeSingle();

      if (order) is_verified_buyer = true;
    }

    const { data: review, error } = await supabaseAdmin
      .from('product_reviews')
      .insert({
        product_id: product.id,
        customer_id,
        customer_name: cleanName,
        customer_email: customer_email ? customer_email.toLowerCase() : null,
        rating,
        title: cleanTitle,
        comment: cleanComment,
        is_verified_buyer,
        is_approved: true // Default to true or can be changed to false for moderation
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse(res, 'Review submitted successfully', { review }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/reviews (Admin Only)
 */
export const getAdminReviews = async (req, res, next) => {
  try {
    const { data: reviews, error } = await supabaseAdmin
      .from('product_reviews')
      .select(`
        id,
        rating,
        title,
        comment,
        customer_name,
        customer_email,
        is_verified_buyer,
        is_approved,
        created_at,
        product:products(id, title, slug)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse(res, 'All reviews fetched', { reviews: reviews || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/admin/reviews/:id/approve (Admin Only)
 */
export const toggleApproveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const { data: updated, error } = await supabaseAdmin
      .from('product_reviews')
      .update({ is_approved: is_approved ?? true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(res, 'Review approval updated', { review: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/reviews/:id (Admin Only)
 */
export const deleteAdminReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('product_reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse(res, 'Review deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
