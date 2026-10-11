import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const couponCreateSchema = z.object({
  code: z.string().min(3).max(50),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().positive(),
  min_spend: z.number().nonnegative().optional().default(0),
  max_discount: z.number().positive().optional().nullable(),
  usage_limit: z.number().int().positive().optional().nullable(),
  expires_at: z.string().optional().nullable()
});

/**
 * POST /api/cart/apply-coupon
 */
export const applyCoupon = async (req, res, next) => {
  try {
    const sessionToken = req.cartSessionToken;
    const { code } = req.body;

    if (!code) {
      return errorResponse(res, 'Coupon Code Required', 'Please enter a coupon code.', 400);
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Fetch Coupon
    const { data: coupon, error: couponError } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('is_active', true)
      .maybeSingle();

    if (couponError) throw couponError;

    if (!coupon) {
      return errorResponse(res, 'Invalid Coupon', 'The coupon code entered is invalid or expired.', 404);
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return errorResponse(res, 'Expired Coupon', 'This coupon code has expired.', 400);
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return errorResponse(res, 'Coupon Limit Reached', 'This coupon is no longer available.', 400);
    }

    // 2. Fetch Active Cart
    const { data: cart } = await supabaseAdmin
      .from('carts')
      .select(`
        id,
        items:cart_items(
          quantity,
          variant:product_variants(price)
        )
      `)
      .eq('session_token', sessionToken)
      .maybeSingle();

    if (!cart || !cart.items || cart.items.length === 0) {
      return errorResponse(res, 'Empty Cart', 'Your cart is empty. Add items before applying a coupon.', 400);
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce((acc, item) => {
      const price = item.variant ? parseFloat(item.variant.price) : 0;
      return acc + (price * item.quantity);
    }, 0);

    // Check minimum spend
    if (coupon.min_spend && subtotal < parseFloat(coupon.min_spend)) {
      return errorResponse(
        res,
        'Minimum Spend Not Met',
        `This coupon requires a minimum order value of Rs. ${parseFloat(coupon.min_spend).toLocaleString()}.`,
        400
      );
    }

    // 3. Calculate Discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (subtotal * parseFloat(coupon.discount_value)) / 100;
      if (coupon.max_discount && discountAmount > parseFloat(coupon.max_discount)) {
        discountAmount = parseFloat(coupon.max_discount);
      }
    } else {
      discountAmount = Math.min(parseFloat(coupon.discount_value), subtotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    // 4. Update cart
    const { error: updateError } = await supabaseAdmin
      .from('carts')
      .update({
        coupon_code: coupon.code,
        discount_amount: discountAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', cart.id);

    if (updateError) throw updateError;

    return successResponse(res, 'Coupon Applied Successfully', {
      coupon_code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: discountAmount,
      subtotal,
      final_total: Math.max(0, subtotal - discountAmount)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cart/remove-coupon
 */
export const removeCoupon = async (req, res, next) => {
  try {
    const sessionToken = req.cartSessionToken;

    const { error } = await supabaseAdmin
      .from('carts')
      .update({
        coupon_code: null,
        discount_amount: 0.00,
        updated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken);

    if (error) throw error;

    return successResponse(res, 'Coupon removed successfully', null);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/coupons (Admin Only)
 */
export const getAdminCoupons = async (req, res, next) => {
  try {
    const { data: coupons, error } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return successResponse(res, 'Coupons fetched successfully', { coupons: coupons || [] });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/coupons (Admin Only)
 */
export const createAdminCoupon = async (req, res, next) => {
  try {
    const parse = couponCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return errorResponse(res, 'Validation Error', parse.error.errors[0]?.message, 400);
    }

    const { code, discount_type, discount_value, min_spend, max_discount, usage_limit, expires_at } = parse.data;

    const { data: coupon, error } = await supabaseAdmin
      .from('coupons')
      .insert({
        code: code.trim().toUpperCase(),
        discount_type,
        discount_value,
        min_spend,
        max_discount,
        usage_limit,
        expires_at
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse(res, 'Coupon created successfully', { coupon }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/coupons/:id (Admin Only)
 */
export const deleteAdminCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return successResponse(res, 'Coupon deleted successfully', null);
  } catch (error) {
    next(error);
  }
};
