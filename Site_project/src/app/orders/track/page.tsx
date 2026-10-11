"use client";

import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle, Phone } from 'lucide-react';
import { apiTrackOrder } from '@/lib/api';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setOrderData(null);

    try {
      const data = await apiTrackOrder(orderNumber.trim());
      setOrderData(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Order not found. Please check your tracking number.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending_confirmation':
        return 1;
      case 'confirmed':
        return 2;
      case 'dispatched':
      case 'in_transit':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(orderData?.order_status);

  return (
    <div className="min-h-screen bg-[#fafaf8] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-[#C9A84C]/15 text-[#8f742f] mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight font-[family-name:var(--font-playfair)]">
            Track Your Order
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2">
            Enter your 7-character order tracking number (e.g. <strong>GW-84920</strong>) provided on checkout or confirmation email.
          </p>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleTrack}
          className="p-3 bg-white rounded-2xl shadow-sm border border-neutral-200 flex gap-2 mb-8 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. GW-58291"
              className="w-full pl-11 pr-4 py-3 text-sm font-mono uppercase tracking-wider rounded-xl focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !orderNumber.trim()}
            className="px-6 py-3 bg-[#111] hover:bg-[#C9A84C] hover:text-[#111] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Order Details Card */}
        {orderData && (
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-md overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="p-6 sm:p-8 bg-[#111] text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider">
                  Tracking Number
                </span>
                <h2 className="text-2xl font-black font-mono tracking-wider">
                  {orderData.order_number}
                </h2>
                <span className="text-xs text-neutral-400 mt-1 block">
                  Placed on: {new Date(orderData.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-[#C9A84C] text-[#111] text-xs font-black uppercase tracking-wider rounded-full">
                  {orderData.order_status?.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-neutral-400 block mt-1">
                  Payment: {orderData.payment_method === 'COD' ? 'Cash On Delivery' : 'Online Paid'} ({orderData.payment_status})
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="p-6 sm:p-8 border-b border-neutral-100 bg-[#fbfbf9]">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    currentStep >= 1 ? 'bg-[#C9A84C] text-[#111]' : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800">Received</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    currentStep >= 2 ? 'bg-[#C9A84C] text-[#111]' : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800">Confirmed</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    currentStep >= 3 ? 'bg-[#C9A84C] text-[#111]' : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800">Dispatched</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                    currentStep >= 4 ? 'bg-[#C9A84C] text-[#111]' : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800">Delivered</span>
                </div>
              </div>
            </div>

            {/* Destination & Customer Summary */}
            <div className="p-6 sm:p-8 border-b border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                  Recipient
                </span>
                <span className="font-extrabold text-neutral-900 text-sm block">
                  {orderData.customer_name}
                </span>
                <span className="text-neutral-500">
                  Destination: {orderData.city}, {orderData.province}
                </span>
              </div>

              <div>
                <span className="text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                  Need Help?
                </span>
                <a
                  href={`https://wa.me/923326457322?text=${encodeURIComponent(`Hi Woody Home, I have a query regarding order ${orderData.order_number}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Support (+92 332 6457322)
                </a>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="p-6 sm:p-8">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
                Items in this package
              </h3>

              <div className="divide-y divide-neutral-100">
                {orderData.items?.map((item: any) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-neutral-900">
                        {item.product_title}
                      </div>
                      <div className="text-neutral-500 mt-0.5">
                        {item.variant_title} • Qty: {item.quantity}
                      </div>
                      {item.custom_properties?.['Personalized Name'] && (
                        <span className="inline-block mt-1 text-[10px] bg-[#C9A84C]/15 text-[#8f742f] font-bold px-2 py-0.5 rounded-md">
                          Engraved Name: {item.custom_properties['Personalized Name']}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-neutral-900 text-sm">
                      Rs. {(Number(item.unit_price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="mt-6 pt-4 border-t border-neutral-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>Rs. {Number(orderData.subtotal).toLocaleString()}</span>
                </div>
                {Number(orderData.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- Rs. {Number(orderData.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span>{Number(orderData.shipping_fee) === 0 ? 'FREE' : `Rs. ${Number(orderData.shipping_fee).toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="text-[#C9A84C]">Rs. {Number(orderData.total_price).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
