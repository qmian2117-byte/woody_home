"use client";

import Link from "next/link";
import { salesContent } from "@/app/sales/content";
import { salesStyles } from "@/app/sales/style";
import { ProductCard } from "@/components/ProductCard";

interface SalesPageProps {
  liveProducts?: any[];
}

export function SalesPage({ liveProducts }: SalesPageProps) {
  const productsToDisplay = liveProducts && liveProducts.length > 0
    ? liveProducts
    : salesContent.saleProducts;

  return (
    <div className="flex flex-col w-full">
      {/* ═══ Products Heading ═══ */}
      <section className="bg-[#f9f9f7] border-b border-[#e5e5e5] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold tracking-tight"
            style={{ color: "#4E2B13", fontSize: "44px" }}
          >
            All Products & Masterpieces
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            Explore authentic handcrafted Sheesham wood art pieces and decor
          </p>
        </div>
      </section>

      {/* ═══ Sale Products Grid ═══ */}
      <section className={salesStyles.products.section}>
        <div className={salesStyles.products.grid}>
          {productsToDisplay.map((product) => (
            <ProductCard
              key={product.slug || product.title}
              title={product.title}
              price={product.price}
              comparePrice={product.comparePrice}
              vendor={product.vendor || 'Woody Home'}
              image={product.image || product.primary_image}
              href={product.href || `/products/${product.slug}`}
              badge={product.badge}
              rating={product.rating || 5}
              reviewCount={product.reviewCount || 240}
              savePercent={product.savePercent}
              desktopStyle={11}
              mobileStyle={11}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow transition-all duration-200"
          >
            Explore All Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
