import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  generateProductMetadata,
} from "@/app/products/[slug]/content";
import { ProductDetailPage } from "@/page/product-detail";
import { fetchProductBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const liveProduct = await fetchProductBySlug(slug);
  const product = liveProduct || getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — Woody Home",
    };
  }

  return generateProductMetadata(product);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // 1. Try to fetch from live Node.js + Supabase Backend
  const liveProduct = await fetchProductBySlug(slug);
  // 2. Fallback to static content if backend is offline or static route
  const product = liveProduct || getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
