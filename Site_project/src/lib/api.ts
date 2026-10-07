/**
 * Woody Home Next.js API Client
 * Connects frontend directly to Node.js + Supabase Backend (http://localhost:5000/api)
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  vendor: string;
  product_type: string;
  primary_image: string;
  image: string;
  images: string[];
  href: string;
  price: string;
  priceRaw: number;
  comparePrice?: string;
  compareRaw?: number;
  savePercent?: number;
  badge?: 'sale' | 'new' | 'hot' | 'sold';
  rating: number;
  reviewCount: number;
  is_available: boolean;
  variants: any[];
  tags: string[];
}

export interface ApiCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  products_count: number;
}

export interface ApiCartItem {
  id: string;
  variant_id: string;
  product_id: string;
  product_title: string;
  product_slug: string;
  variant_title: string;
  sku: string;
  image_url: string;
  unit_price: number;
  line_price: number;
  quantity: number;
  custom_properties: Record<string, string>;
  is_available: boolean;
}

export interface ApiCart {
  id: string | null;
  session_token: string;
  item_count: number;
  total_price: number;
  currency: string;
  items: ApiCartItem[];
}

export interface CreateOrderPayload {
  customer_name: string;
  email?: string;
  phone: string;
  shipping_address: string;
  city: string;
  province: string;
  postal_code?: string;
  payment_method?: 'COD' | 'CARD' | 'WHATSAPP';
  notes?: string;
}

export interface CreateOrderResponse {
  order_id: string;
  order_number: string;
  total_price: number;
  currency: string;
  payment_method: string;
  order_status: string;
  whatsapp_confirmation_url: string;
}

// ─── Products & Collections ──────────────────────────────────────────────

export async function fetchProducts(params: { category?: string; sort?: string; page?: number; limit?: number } = {}) {
  try {
    const url = new URL(`${API_BASE}/products`);
    if (params.category) url.searchParams.set('category', params.category);
    if (params.sort) url.searchParams.set('sort', params.sort);
    if (params.page) url.searchParams.set('page', params.page.toString());
    if (params.limit) url.searchParams.set('limit', params.limit.toString());

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data?.products || [];
  } catch (err) {
    console.warn('Backend fetchProducts error, falling back:', err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn(`Backend fetchProductBySlug (${slug}) error:`, err);
    return null;
  }
}

export async function fetchCollections(): Promise<ApiCollection[]> {
  try {
    const res = await fetch(`${API_BASE}/collections`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('Backend fetchCollections error:', err);
    return [];
  }
}

// ─── Search Auto-Suggest ──────────────────────────────────────────────────

export async function fetchSearchSuggestions(query: string) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.results || [];
  } catch (err) {
    console.warn('Backend search error:', err);
    return [];
  }
}

// ─── AJAX Cart Operations ────────────────────────────────────────────────

export async function fetchCart(): Promise<ApiCart | null> {
  try {
    const res = await fetch(`${API_BASE}/cart`, {
      credentials: 'include'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.warn('Backend fetchCart error:', err);
    return null;
  }
}

export async function apiAddToCart(variantId: string, quantity = 1, customProperties: Record<string, string> = {}) {
  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      variant_id: variantId,
      quantity,
      custom_properties: customProperties
    })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || 'Failed to add item to cart');
  return json.data as ApiCart;
}

export async function apiUpdateCartItem(itemId: string, quantity: number, customProperties?: Record<string, string>) {
  const res = await fetch(`${API_BASE}/cart/item/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      quantity,
      custom_properties: customProperties
    })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update cart');
  return json.data as ApiCart;
}

export async function apiRemoveCartItem(itemId: string) {
  const res = await fetch(`${API_BASE}/cart/item/${itemId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to remove item');
  return json.data as ApiCart;
}

export async function apiClearCart() {
  const res = await fetch(`${API_BASE}/cart/clear`, {
    method: 'DELETE',
    credentials: 'include'
  });
  const json = await res.json();
  return json.data as ApiCart;
}

// ─── Cash on Delivery Checkout ───────────────────────────────────────────

export async function apiCreateOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/checkout/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || 'Order failed');
  return json.data as CreateOrderResponse;
}

// ─── Stripe Card Checkout ────────────────────────────────────────────────

export interface StripeSessionResponse {
  sessionId: string;
  url: string;
  isDemo?: boolean;
}

export async function apiCreateStripeSession(payload: CreateOrderPayload): Promise<StripeSessionResponse> {
  const res = await fetch(`${API_BASE}/checkout/stripe-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || 'Failed to start Stripe checkout');
  return json.data as StripeSessionResponse;
}

export async function apiVerifyStripeSession(sessionId: string): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/checkout/stripe-verify/${sessionId}`, {
    credentials: 'include'
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || json.message || 'Failed to verify Stripe payment');
  return json.data as CreateOrderResponse;
}

// ─── Contact Form & FAQs ──────────────────────────────────────────────────

export async function apiSubmitContact(data: { name: string; phone: string; email?: string; inquiry_type?: string; message?: string }) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to send inquiry');
  return json.data;
}

export async function fetchFaqs() {
  try {
    const res = await fetch(`${API_BASE}/faqs`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    return [];
  }
}
