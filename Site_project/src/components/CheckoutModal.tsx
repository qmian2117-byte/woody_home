"use client";

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Phone, MessageSquare, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiCreateOrder, apiCreateStripeSession } from '@/lib/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, refreshCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'STRIPE'>('COD');
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    shipping_address: '',
    city: '',
    province: 'Punjab',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (paymentMethod === 'STRIPE') {
        const stripeRes = await apiCreateStripeSession({
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email || undefined,
          shipping_address: formData.shipping_address,
          city: formData.city,
          province: formData.province,
          notes: formData.notes
        });

        if (stripeRes.url) {
          // Redirect to Stripe checkout hosted page (or mock success page)
          window.location.href = stripeRes.url;
          return;
        } else {
          throw new Error('Unable to generate Stripe checkout URL.');
        }
      } else {
        // COD order
        const res = await apiCreateOrder({
          customer_name: formData.customer_name,
          phone: formData.phone,
          email: formData.email || undefined,
          shipping_address: formData.shipping_address,
          city: formData.city,
          province: formData.province,
          payment_method: 'COD',
          notes: formData.notes
        });

        setOrderSuccess(res);
        await refreshCart();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-[#111] text-white">
          <div className="flex items-center gap-2">
            {paymentMethod === 'COD' ? (
              <Truck className="w-5 h-5 text-[#C9A84C]" />
            ) : (
              <CreditCard className="w-5 h-5 text-[#C9A84C]" />
            )}
            <h3 className="font-extrabold text-base tracking-wide uppercase font-[family-name:var(--font-playfair)]">
              {paymentMethod === 'COD' ? 'Cash on Delivery Checkout' : 'Stripe Card Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {orderSuccess ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-[#111] font-[family-name:var(--font-playfair)]">
                  Order Confirmed!
                </h4>
                <p className="text-sm font-bold text-[#C9A84C] mt-1">
                  Order #{orderSuccess.order_number}
                </p>
                <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto">
                  Thank you for shopping with Woody Home. We will dispatch your handcrafted order shortly via courier with Cash on Delivery.
                </p>
              </div>

              {orderSuccess.whatsapp_confirmation_url && (
                <div className="pt-2">
                  <a
                    href={orderSuccess.whatsapp_confirmation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl font-black text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Confirm Order on WhatsApp</span>
                  </a>
                  <p className="text-[11px] text-neutral-400 mt-2">
                    Click to send your order confirmation directly to our WhatsApp support.
                  </p>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Close &amp; Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#111] font-bold shadow-sm'
                        : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <Banknote className={`w-5 h-5 ${paymentMethod === 'COD' ? 'text-[#C9A84C]' : 'text-neutral-400'}`} />
                    <div className="leading-tight">
                      <div className="text-xs font-bold">Cash on Delivery</div>
                      <div className="text-[10px] text-neutral-500">Pay at doorstep</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('STRIPE')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'STRIPE'
                        ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#111] font-bold shadow-sm'
                        : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'STRIPE' ? 'text-[#C9A84C]' : 'text-neutral-400'}`} />
                    <div className="leading-tight">
                      <div className="text-xs font-bold">Card / Stripe</div>
                      <div className="text-[10px] text-neutral-500">Visa, Master, Online</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Summary Pill */}
              <div className="p-3.5 bg-[#f9f9f7] rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500">Cart Total ({cart?.item_count || 0} items):</span>
                  <div className="font-black text-[#111] text-sm">
                    Rs. {(cart?.total_price || 0).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Free Delivery
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                />
              </div>

              {/* Mobile Phone (Pakistan) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Mobile Number (for Courier &amp; WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="03326457322"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  We verify your order and delivery address on this number.
                </p>
              </div>

              {/* Email (Optional for COD, recommended for Stripe) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Email Address {paymentMethod === 'STRIPE' ? '(for payment receipt)' : '(Optional)'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tariq@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                  placeholder="House / Flat No., Street, Sector / Colony, Landmark"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                />
              </div>

              {/* City & Province */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lahore, Islamabad"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="Khyber Pakhtunkhwa">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Federal">Islamabad Capital</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  </select>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Order Notes / Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Please call before arriving or deliver after 2 PM"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none"
                />
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
                <span>
                  {paymentMethod === 'COD'
                    ? 'Pay securely in cash when parcel arrives at your doorstep.'
                    : '100% Encrypted & Protected by Stripe 256-bit SSL Security.'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !cart?.items?.length}
                className="w-full py-3.5 rounded-xl font-black text-sm text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-lg shadow-[#C9A84C]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Checkout...</span>
                ) : paymentMethod === 'STRIPE' ? (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay with Card via Stripe • Rs. {(cart?.total_price || 0).toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Place Cash on Delivery Order • Rs. {(cart?.total_price || 0).toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
