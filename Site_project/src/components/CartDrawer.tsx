"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CheckoutModal } from './CheckoutModal';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  if (!isOpen) return null;

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

            {/* Free Shipping Progress bar */}
            <div className="bg-[#f9f9f7] px-5 py-2.5 border-b border-neutral-200 text-xs flex items-center justify-between">
              <span className="text-neutral-600 font-medium">Delivery:</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Free Nationwide Delivery (COD)
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
              {cart?.items && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          Woodcraft
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product_slug}`}
                          onClick={closeCart}
                          className="text-xs font-extrabold text-neutral-900 hover:text-[#C9A84C] line-clamp-2 transition-colors"
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

            {/* Footer Summary */}
            {cart?.items && cart.items.length > 0 && (
              <div className="p-5 border-t border-neutral-100 bg-[#fbfbf9] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 font-medium">Subtotal</span>
                  <span className="font-black text-neutral-900 text-base">
                    Rs. {(cart.total_price || 0).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => {
                    closeCart();
                    setCheckoutModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl font-black text-sm text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-lg shadow-[#C9A84C]/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </>
  );
}
