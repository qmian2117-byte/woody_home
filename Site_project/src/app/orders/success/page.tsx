"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShoppingBag, MessageSquare } from 'lucide-react';
import { apiVerifyStripeSession } from '@/lib/api';
import { useCart } from '@/context/CartContext';

function StripeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshCart } = useCart();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function verifyPayment() {
      try {
        const data = await apiVerifyStripeSession(sessionId as string);
        if (isMounted) {
          setOrderData(data);
          await refreshCart();
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Payment verification failed');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, refreshCart]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-[#C9A84C] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-900 font-[family-name:var(--font-playfair)]">
          Verifying your Stripe Payment...
        </h2>
        <p className="text-sm text-neutral-500 mt-2 max-w-sm">
          Please wait while we confirm your card transaction and create your order.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2 font-[family-name:var(--font-playfair)]">
          Payment Verification Issue
        </h2>
        <p className="text-sm text-neutral-600 mb-6">{error}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#111] text-white font-medium hover:bg-neutral-800 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const order = orderData?.order;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#111] to-[#222] p-6 text-white text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wide font-[family-name:var(--font-playfair)]">
            Payment Successful!
          </h1>
          <p className="text-sm text-neutral-300 mt-1">
            Thank you for ordering with Woody Home
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#EBE3D5]">
            <div className="flex justify-between items-center py-1 border-b border-[#E3D9C9] text-sm">
              <span className="text-neutral-500">Order Number</span>
              <span className="font-bold text-neutral-900">{order?.order_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#E3D9C9] text-sm">
              <span className="text-neutral-500">Payment Status</span>
              <span className="font-semibold text-emerald-600">Paid (Stripe Verified)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#E3D9C9] text-sm">
              <span className="text-neutral-500">Total Amount</span>
              <span className="font-bold text-[#C9A84C]">
                Rs. {Number(order?.total_amount || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 text-sm">
              <span className="text-neutral-500">Deliver To</span>
              <span className="font-medium text-neutral-800 text-right">
                {order?.customer_name} ({order?.city})
              </span>
            </div>
          </div>

          {orderData?.whatsapp_url && (
            <a
              href={orderData.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md shadow-emerald-600/20"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Confirm on WhatsApp</span>
            </a>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/collections"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-sm font-semibold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#111] hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
            >
              <span>Home</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StripeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
        </div>
      }
    >
      <StripeSuccessContent />
    </Suspense>
  );
}
