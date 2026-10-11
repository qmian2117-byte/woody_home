"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, CheckCircle2, CreditCard, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CheckoutModal } from './CheckoutModal';

export function CartDrawer() {
  const {
    cart,
    coupon,
    isOpen,
    closeCart,
    updateItem,
    removeItem,
    applyCouponCode,
    removeCouponCode,
    isLoading
  } = useCart();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState<'COD' | 'STRIPE'>('STRIPE');
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setPromoError('');
    setPromoSuccess('');
    setIsApplyingPromo(true);

    try {
      const res = await applyCouponCode(promoInput.trim());
      setPromoSuccess(`Applied: Rs. ${res.discount_amount.toLocaleString()} discount!`);
      setPromoInput('');
    } catch (err: any) {
      setPromoError(err.message || 'Invalid coupon code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setPromoError('');
    setPromoSuccess('');
    try {
      await removeCouponCode();
    } catch (err: any) {
      setPromoError(err.message || 'Failed to remove coupon');
    }
  };

  const subtotal = cart?.total_price || 0;
  const discount = coupon?.discount_amount || 0;
  const finalTotal = Math.max(0, subtotal - discount);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
        {/* Backdrop */}
        <div
          onClick={closeCart}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
            {/* Drawer Header */}
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-[#111] text-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#C9A84C]" />
                <h2 className="font-extrabold text-base tracking-wide uppercase font-[family-name:var(--font-playfair)]">
                  Your Cart ({cart?.item_count || 0})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product_slug}`}
                          onClick={closeCart}
                          className="text-sm font-bold text-neutral-900 hover:text-[#C9A84C] transition-colors line-clamp-1"
                        >
                          {item.product_title}
                        </Link>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Variant: {item.variant_title}
                        </div>

                        {/* Custom Engraved Name Display */}
                        {item.custom_properties && Object.keys(item.custom_properties).length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {Object.entries(item.custom_properties).map(([k, v]) => (
                              <span
                                key={k}
                                className="inline-block text-[10px] font-bold bg-[#C9A84C]/15 text-[#8f742f] px-2 py-0.5 rounded-md"
                              >
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price Controls */}
                      <div className="flex items-center justify-between mt-2 pt-2">
                        <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-neutral-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            disabled={isLoading}
                            className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-xs font-black text-neutral-900">
                            Rs. {item.line_price.toLocaleString()}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-neutral-800">Your cart is empty</h4>
                    <p className="text-xs text-neutral-500 max-w-xs mt-1">
                      Discover our handcrafted wooden lamps, animal sculptures, and home decor.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-5 py-2.5 bg-[#C9A84C] text-[#111] text-xs font-black rounded-xl hover:bg-[#e8c96b] transition-all"
                  >
                    Explore Handcrafted Decor
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary & Coupon Section */}
            {cart?.items && cart.items.length > 0 && (
              <div className="p-5 border-t border-neutral-100 bg-[#fbfbf9] space-y-3">
                {/* Promo Code Input or Applied Badge */}
                <div className="pt-1 pb-2">
                  {coupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#8f742f]" />
                        <span className="text-xs font-bold text-[#8f742f]">
                          Code: <strong>{coupon.coupon_code}</strong> (-Rs. {coupon.discount_amount.toLocaleString()})
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-neutral-500 hover:text-red-600 font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Promo or Voucher Code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-xl uppercase tracking-wider focus:outline-none focus:border-[#C9A84C] bg-white font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isApplyingPromo || !promoInput.trim()}
                        className="px-3.5 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                      >
                        {isApplyingPromo ? 'Applying...' : 'Apply'}
                      </button>
                    </form>
                  )}

                  {promoError && (
                    <p className="text-[11px] text-red-500 font-medium mt-1.5">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {promoSuccess}
                    </p>
                  )}
                </div>

                {/* Subtotal & Discounts */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {coupon && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>- Rs. {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-200">
                    <span className="font-bold text-neutral-900">Total</span>
                    <span className="font-black text-neutral-900 text-base">
                      Rs. {finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Dual Checkout Action Buttons: Stripe & COD */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      setCheckoutMethod('STRIPE');
                      closeCart();
                      setCheckoutModalOpen(true);
                    }}
                    className="w-full py-3.5 rounded-xl font-black text-sm text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-lg shadow-[#C9A84C]/25 transition-all flex items-center justify-center gap-2 group"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Card / Stripe</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      setCheckoutMethod('COD');
                      closeCart();
                      setCheckoutModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl font-bold text-xs text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-neutral-600" />
                    <span>Cash on Delivery (COD)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        initialMethod={checkoutMethod}
      />
    </>
  );
}
