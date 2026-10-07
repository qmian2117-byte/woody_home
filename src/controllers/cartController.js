import { supabaseAdmin } from '../config/supabase.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Helper to fetch complete cart with full variant and product details
 */
const fetchFormattedCart = async (cartId, sessionToken) => {
  if (!cartId) {
    return {
      id: null,
      session_token: sessionToken,
      item_count: 0,
      total_price: 0,
      currency: 'PKR',
      items: []
    };
  }

  const { data: items, error } = await supabaseAdmin
    .from('cart_items')
    .select(`
      id,
      quantity,
      custom_properties,
      created_at,
      variant:product_variants(
        id,
        title,
        sku,
        price,
        compare_at_price,
        inventory_quantity,
        is_available,
        product:products(
          id,
          title,
          slug,
          images:product_images(image_url, position)
        )
      )
    `)
    .eq('cart_id', cartId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  let totalItemCount = 0;
  let totalPrice = 0;

  const formattedItems = (items || []).map(item => {
    const variant = item.variant;
    const product = variant?.product;
    const sortedImages = (product?.images || []).sort((a, b) => a.position - b.position);
    const unitPrice = variant ? parseFloat(variant.price) : 0;
    const linePrice = unitPrice * item.quantity;

    totalItemCount += item.quantity;
    totalPrice += linePrice;

    return {
      id: item.id,
      variant_id: variant?.id,
      product_id: product?.id,
      product_title: product?.title,
      product_slug: product?.slug,
      variant_title: variant?.title,
      sku: variant?.sku,
      image_url: sortedImages[0]?.image_url || null,
      unit_price: unitPrice,
      line_price: linePrice,
      quantity: item.quantity,
      custom_properties: item.custom_properties || {},
      is_available: variant?.is_available ?? false
    };
  });

  return {
    id: cartId,
    session_token: sessionToken,
    item_count: totalItemCount,
    total_price: totalPrice,
    currency: 'PKR',
    items: formattedItems
  };
};

/**
 * GET /api/cart
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await fetchFormattedCart(req.cartId, req.cartSessionToken);
    return successResponse(res, 'Cart retrieved', cart);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/cart/add
 * Body: { variant_id, quantity = 1, custom_properties = {} }
 */
export const addToCart = async (req, res, next) => {
  try {
    const { variant_id, quantity = 1, custom_properties = {} } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    if (!variant_id) {
      return errorResponse(res, 'variant_id is required', null, 400);
    }
    if (qty <= 0) {
      return errorResponse(res, 'Quantity must be at least 1', null, 400);
    }

    // Verify variant exists and is available
    const { data: variant, error: varError } = await supabaseAdmin
      .from('product_variants')
      .select('id, is_available, inventory_quantity')
      .eq('id', variant_id)
      .maybeSingle();

    if (varError || !variant) {
      return errorResponse(res, 'Product variant not found', null, 404);
    }

    if (!variant.is_available) {
      return errorResponse(res, 'Product variant is currently out of stock', null, 400);
    }

    // Check if identical item with identical custom_properties already in cart
    const { data: existingItem } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity, custom_properties')
      .eq('cart_id', req.cartId)
      .eq('variant_id', variant_id)
      .maybeSingle();

    const isSameCustomization = JSON.stringify(existingItem?.custom_properties || {}) === JSON.stringify(custom_properties || {});

    if (existingItem && isSameCustomization) {
      // Increment quantity
      await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existingItem.quantity + qty })
        .eq('id', existingItem.id);
    } else {
      // Insert new line item
      await supabaseAdmin
        .from('cart_items')
        .insert([{
          cart_id: req.cartId,
          variant_id,
          quantity: qty,
          custom_properties
        }]);
    }

    const updatedCart = await fetchFormattedCart(req.cartId, req.cartSessionToken);
    return successResponse(res, 'Item added to cart', updatedCart);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/cart/item/:id
 * Body: { quantity, custom_properties }
 */
export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity, custom_properties } = req.body;

    const qty = parseInt(quantity, 10);

    if (qty <= 0) {
      // Delete if quantity is 0 or negative
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('cart_id', req.cartId);
    } else {
      const updateData = {};
      if (!isNaN(qty)) updateData.quantity = qty;
      if (custom_properties !== undefined) updateData.custom_properties = custom_properties;

      await supabaseAdmin
        .from('cart_items')
        .update(updateData)
        .eq('id', id)
        .eq('cart_id', req.cartId);
    }

    const updatedCart = await fetchFormattedCart(req.cartId, req.cartSessionToken);
    return successResponse(res, 'Cart updated', updatedCart);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart/item/:id
 */
export const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('cart_id', req.cartId);

    const updatedCart = await fetchFormattedCart(req.cartId, req.cartSessionToken);
    return successResponse(res, 'Item removed from cart', updatedCart);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/cart/clear
 */
export const clearCart = async (req, res, next) => {
  try {
    await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', req.cartId);

    const updatedCart = await fetchFormattedCart(req.cartId, req.cartSessionToken);
    return successResponse(res, 'Cart cleared', updatedCart);
  } catch (err) {
    next(err);
  }
};
