"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquare, Send } from 'lucide-react';
import { fetchProductReviews, apiSubmitProductReview, type ApiProductReview } from '@/lib/api';

interface ProductReviewsProps {
  productSlug: string;
  productTitle: string;
}

export function ProductReviews({ productSlug, productTitle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ApiProductReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(5.0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProductReviews(productSlug);
      if (data) {
        setReviews(data.reviews || []);
        setAverageRating(data.average_rating || 5.0);
        setTotalReviews(data.total_reviews || 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setFormError('Please enter your name and review comment.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await apiSubmitProductReview(productSlug, {
        customer_name: name.trim(),
        customer_email: email.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim()
      });

      setSubmitSuccess(true);
      setShowForm(false);
      setName('');
      setEmail('');
      setTitle('');
      setComment('');
      // Refresh reviews
      await loadReviews();
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-12 border-t border-neutral-200">
      {/* Header & Rating Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-2xl font-black text-neutral-900 tracking-tight font-[family-name:var(--font-playfair)]">
            Customer Reviews & Experiences
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex text-[#C9A84C]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-[#C9A84C]'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-extrabold text-neutral-900 text-lg">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-500">
              based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#C9A84C] hover:text-neutral-950 transition-all self-start md:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="p-4 mb-8 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thank you! Your verified review has been submitted successfully.</span>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 bg-[#fbfbf9] border border-neutral-200 rounded-2xl mb-10 space-y-5 animate-in fade-in"
        >
          <h4 className="font-extrabold text-lg text-neutral-900">
            Write a Review for {productTitle}
          </h4>

          {formError && (
            <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
              {formError}
            </p>
          )}

          {/* Star Rating Select */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
              Rating
            </label>
            <div className="flex gap-1.5 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-[#C9A84C] hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#C9A84C]'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Usman Ali"
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Beautiful Sheesham wood finish!"
              className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
              Your Feedback *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the craft quality, packaging, and details..."
              className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#C9A84C] text-[#111] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#e8c96b] transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-neutral-500">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 md:p-6 bg-white border border-neutral-100 rounded-2xl shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#111] text-[#C9A84C] flex items-center justify-center font-bold text-xs uppercase">
                    {rev.customer_name[0]}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-neutral-900 block">
                      {rev.customer_name}
                    </span>
                    {rev.is_verified_buyer && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex text-[#C9A84C]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= rev.rating ? 'fill-[#C9A84C]' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && (
                <h5 className="font-bold text-sm text-neutral-900 mt-2">{rev.title}</h5>
              )}
              <p className="text-xs text-neutral-600 leading-relaxed mt-1">{rev.comment}</p>
            </div>
          ))
        ) : (
          <div className="py-10 text-center bg-[#fbfbf9] rounded-2xl border border-neutral-200/60 p-6">
            <p className="text-sm text-neutral-600 font-medium">
              No reviews yet for this masterpiece. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
