"use client";

import Link from "next/link";
import { salesContent } from "@/app/sales/content";
import { salesStyles } from "@/app/sales/style";
import { ProductCard } from "@/components/ProductCard";

export function SalesPage() {

  return (
    <div className="flex flex-col w-full">
      {/* ═══ Products Heading ═══ */}
      <section className="bg-[#f9f9f7] border-b border-[#e5e5e5] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold tracking-tight"
            style={{ color: "#4E2B13", fontSize: "44px" }}
          >
            Products
          </h1>
        </div>
      </section>

      {/* ═══ Sale Products Grid ═══ */}
      <section className={salesStyles.products.section}>
        <div className={salesStyles.products.grid}>
          {salesContent.saleProducts.map((product) => (
            <ProductCard
              key={product.title}
              title={product.title}
              price={product.price}
              comparePrice={product.comparePrice}
              vendor={product.vendor}
              image={product.image}
              href={product.href}
              badge={product.badge}
              rating={product.rating}
              reviewCount={product.reviewCount}
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
