"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  Quote,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  Truck,
  Sparkles,
  Shield,
  Phone,
  Store,
} from "lucide-react";
import { homeContent } from "@/app/_home/content";
import { homeStyles } from "@/app/_home/style";
import { CountUpNumber } from "@/components/CountUpNumber";
import { ProductCard } from "@/components/ProductCard";

function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

interface HomePageProps {
  liveProducts?: any[];
  liveCollections?: any[];
}

export function HomePage({ liveProducts, liveCollections }: HomePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const productsRef = useReveal<HTMLDivElement>();
  const teaserRef = useReveal<HTMLAnchorElement>();
  const uniqueProductsRef = useReveal<HTMLDivElement>();
  const collectionsRef = useReveal<HTMLDivElement>();
  const processRef = useReveal();
  const testimonialsRef = useReveal();
  const faqRef = useReveal();

  const displayedProducts = liveProducts && liveProducts.length > 0
    ? liveProducts
    : homeContent.featuredProducts;


  return (
    <div className="flex flex-col w-full">
      {/* ═══ Hero Section ═══ */}
      <section className={homeStyles.hero.section}>
        <div className={homeStyles.hero.heroBanner}>
          {/* Background Image */}
          <img
            src={homeContent.hero.backgroundImage}
            alt="Woody Home — Handcrafted Wooden Collectibles"
            className={homeStyles.hero.bgImage}
            loading="eager"
            decoding="async"
          />
          {/* Gradient Overlay */}
          <div className={homeStyles.hero.overlay} />

          {/* Content (Top Text 150px, Bottom Buttons 50px) */}
          <div className={homeStyles.hero.contentWrapper}>
            <div className={homeStyles.hero.textBlock}>
              <h1 className={homeStyles.hero.title}>
                {homeContent.hero.title}
              </h1>

              <h2 className={homeStyles.hero.subtitle}>
                {homeContent.hero.subtitle}
              </h2>

              <p className={homeStyles.hero.description}>
                {homeContent.hero.description}
              </p>
            </div>

            {/* Bottom CTAs */}
            <div className={homeStyles.hero.ctaRow}>
              <Link
                href={homeContent.hero.primaryCta.href}
                className={homeStyles.hero.primaryBtn}
              >
                {homeContent.hero.primaryCta.label}
              </Link>
              <Link
                href={homeContent.hero.secondaryCta.href}
                className={homeStyles.hero.outlineBtn}
              >
                {homeContent.hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Infinite Scrolling Trust Bar */}
        <div className={homeStyles.hero.trustBar}>
          <div className={homeStyles.hero.trustBarInner}>
            <div className="marquee-track">
              {/* Render items twice for seamless loop */}
              {[0, 1].map((pass) => (
                <React.Fragment key={pass}>
                  {homeContent.hero.trustBar.map((item, idx) => {
                    const iconMap: Record<string, React.ReactNode> = {
                      truck: <Truck className="w-4 h-4 text-black" />,
                      shield: <Shield className="w-4 h-4 text-black" />,
                      phone: <Phone className="w-4 h-4 text-black" />,
                      store: <Store className="w-4 h-4 text-black" />,
                    };
                    return (
                      <React.Fragment key={`${pass}-${idx}`}>
                        <div className={homeStyles.hero.trustItem}>
                          {iconMap[item.icon]}
                          <span>{item.text}</span>
                        </div>
                        <div className={homeStyles.hero.trustSeparator} />
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Stats Bar ═══ */}
      <section className="bg-[#f9f9f7] border-y border-[#f0f0f0]">
        <div className={homeStyles.container}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#f0f0f0]">
            {homeContent.stats.map((stat) => (
              <div
                key={stat.label}
                className="py-8 lg:py-10 px-6 text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#111] font-[family-name:var(--font-playfair)]">
                  <CountUpNumber value={stat.value} />
                  <span className="text-[#C9A84C]">{stat.suffix}</span>
                </div>
                <div className="text-sm font-semibold text-[#333] mt-1">
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div className="text-xs text-[#aaa] mt-0.5">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Featured Products ═══ */}
      <section
        ref={productsRef}
        className={`${homeStyles.sectionPadding} reveal-section`}
      >
        <div className={homeStyles.container}>
          <div className={homeStyles.sectionHeader}>
            <span className={homeStyles.eyebrow}>
              <Sparkles className="w-3.5 h-3.5" />
              Curated Collection
            </span>
            <h2 className={homeStyles.sectionTitle}>Featured Creations</h2>
            <p className={homeStyles.sectionSubtitle}>
              Each piece is hand-carved from premium sheesham wood by our master
              artisans in Chiniot, Pakistan.
            </p>
          </div>

          <div className={homeStyles.products.grid}>
            {displayedProducts.map((product: any) => (
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


          <div className="text-center mt-12 mb-4">
            <Link
              href="/sales"
              className="fp-view-all-btn"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Custom Orders Teaser (Have Something Special in Mind?) ═══ */}
      <div className={homeStyles.customOrdersTeaser.wrap}>
        <Link
          ref={teaserRef}
          href={homeContent.customOrdersTeaser.cta.href}
          className={homeStyles.customOrdersTeaser.card}
          style={{ textDecoration: "none" }}
        >
          <div className={homeStyles.customOrdersTeaser.art}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={homeStyles.customOrdersTeaser.logo}
              src={homeContent.customOrdersTeaser.logo}
              alt="Woody Home"
              loading="lazy"
              width={1500}
              height={744}
            />
          </div>
          <div className={homeStyles.customOrdersTeaser.copy}>
            <div className={homeStyles.customOrdersTeaser.eyebrow}>
              {homeContent.customOrdersTeaser.eyebrow}
            </div>
            <h2 className={homeStyles.customOrdersTeaser.heading}>
              {homeContent.customOrdersTeaser.heading}
            </h2>
            <p className={homeStyles.customOrdersTeaser.desc}>
              {homeContent.customOrdersTeaser.description}
            </p>
            <span className={homeStyles.customOrdersTeaser.btn}>
              {homeContent.customOrdersTeaser.cta.label}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>

      {/* ═══ Shop Unique Products (Explore Latest) ═══ */}
      <section
        ref={uniqueProductsRef}
        className={homeStyles.uniqueProducts.section}
      >
        <div className={homeStyles.uniqueProducts.header}>
          <span className={homeStyles.uniqueProducts.eyebrow}>
            {homeContent.uniqueProducts.eyebrow}
          </span>
          <h2 className={homeStyles.uniqueProducts.heading}>
            {homeContent.uniqueProducts.heading}
          </h2>
        </div>

        <div className={homeStyles.uniqueProducts.grid}>
          {homeContent.uniqueProducts.items.map((item) => (
            <div key={item.title} className={homeStyles.uniqueProducts.item}>
              <Link
                href={item.href}
                className={homeStyles.uniqueProducts.banner}
                data-delay={item.delay}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  srcSet={`${item.image.replace("width=1200", "width=600")} 600w, ${item.image.replace("width=1200", "width=900")} 900w, ${item.image} 1200w`}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  className={homeStyles.uniqueProducts.bannerImg}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className={homeStyles.uniqueProducts.overlay}>
                  <div className={homeStyles.uniqueProducts.content}>
                    <h3
                      className={homeStyles.uniqueProducts.title}
                      style={{ color: item.titleColor }}
                    >
                      {item.title}
                    </h3>
                    <span className={homeStyles.uniqueProducts.btn}>
                      {item.btnText}
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                href={item.href}
                className={homeStyles.uniqueProducts.mobileBtnWrap}
              >
                <span className={homeStyles.uniqueProducts.mobileBtn}>
                  {item.btnText}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Collections ═══ */}
      <section
        ref={collectionsRef}
        className={homeStyles.collections.section}
      >
        <div className={homeStyles.collections.header}>
          <span className={homeStyles.collections.eyebrow}>
            {homeContent.collectionsHeader.eyebrow}
          </span>
          <h2 className={homeStyles.collections.heading}>
            {homeContent.collectionsHeader.heading}
          </h2>
        </div>

        <div className={homeStyles.collections.grid}>
          {homeContent.collections.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className={homeStyles.collections.card}
              data-delay={col.delay}
            >
              <div className={homeStyles.collections.imgWrap}>
                <img
                  src={col.image}
                  alt={col.title}
                  srcSet={`${col.image.replace("width=700", "width=350")} 350w, ${col.image.replace("width=700", "width=500")} 500w, ${col.image} 700w`}
                  width={col.width}
                  height={col.height}
                  loading="lazy"
                  className={homeStyles.collections.imgMain}
                  sizes="(max-width: 700px) 50vw, 25vw"
                />
              </div>

              <div className={homeStyles.collections.info}>
                <h3 className={homeStyles.collections.title}>{col.title}</h3>
                <p className={homeStyles.collections.count}>{col.count}</p>
                <span className={homeStyles.collections.btn}>Shop Collection</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ Why Choose Us / Product Info ═══ */}
      <section
        ref={processRef}
        className={homeStyles.whyChooseUs.section}
      >
        <div className={homeStyles.whyChooseUs.wrap}>
          {/* Media Side */}
          <div className={homeStyles.whyChooseUs.media}>
            <div className={homeStyles.whyChooseUs.imgBox}>
              <img
                src={homeContent.whyChooseUs.image}
                alt={homeContent.whyChooseUs.imageAlt}
                loading="lazy"
                width={800}
                height={1000}
              />
            </div>

            <div className={homeStyles.whyChooseUs.badgeFloat}>
              <div className={homeStyles.whyChooseUs.badgeIcon}>
                {homeContent.whyChooseUs.badge.icon}
              </div>
              <div>
                <div className={homeStyles.whyChooseUs.badgeNum}>
                  {homeContent.whyChooseUs.badge.num}
                </div>
                <div className={homeStyles.whyChooseUs.badgeLabel}>
                  {homeContent.whyChooseUs.badge.label}
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className={homeStyles.whyChooseUs.content}>
            <span className={homeStyles.whyChooseUs.label}>
              {homeContent.whyChooseUs.label}
            </span>

            <h2 className={homeStyles.whyChooseUs.title}>
              {homeContent.whyChooseUs.title}
            </h2>

            <div className={homeStyles.whyChooseUs.desc}>
              {homeContent.whyChooseUs.description}
            </div>

            {/* Feature Points */}
            <div className={homeStyles.whyChooseUs.features}>
              {homeContent.whyChooseUs.features.map((feat) => (
                <div
                  key={feat.title}
                  className={homeStyles.whyChooseUs.feature}
                >
                  <div className={homeStyles.whyChooseUs.featIcon}>
                    {feat.icon}
                  </div>
                  <div>
                    <div className={homeStyles.whyChooseUs.featTitle}>
                      {feat.title}
                    </div>
                    <div className={homeStyles.whyChooseUs.featText}>
                      {feat.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={homeStyles.whyChooseUs.ctas}>
              <Link
                href={homeContent.whyChooseUs.primaryCta.href}
                className={homeStyles.whyChooseUs.btnPrimary}
              >
                {homeContent.whyChooseUs.primaryCta.label}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href={homeContent.whyChooseUs.secondaryCta.href}
                className={homeStyles.whyChooseUs.btnSecondary}
              >
                {homeContent.whyChooseUs.secondaryCta.label}
              </Link>
            </div>

            {/* Stats */}
            <div className={homeStyles.whyChooseUs.stats}>
              {homeContent.whyChooseUs.stats.map((stat) => (
                <div key={stat.label} className={homeStyles.whyChooseUs.stat}>
                  <div className={homeStyles.whyChooseUs.statNum}>
                    {stat.num}
                  </div>
                  <div className={homeStyles.whyChooseUs.statLabel}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section
        ref={testimonialsRef}
        className={`${homeStyles.sectionPadding} reveal-section`}
      >
        <div className={homeStyles.container}>
          <div className={homeStyles.sectionHeader}>
            <span className={homeStyles.eyebrow}>
              <Star className="w-3.5 h-3.5" />
              Customer Love
            </span>
            <h2 className={homeStyles.sectionTitle}>What Our Customers Say</h2>
            <p className={homeStyles.sectionSubtitle}>
              Real reviews from collectors, interior designers, and wood
              enthusiasts around the world.
            </p>
          </div>

          <div className={homeStyles.testimonials.grid}>
            {homeContent.testimonials.map((t) => (
              <div key={t.id} className={homeStyles.testimonials.card}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={homeStyles.testimonials.ratingPill}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </span>
                    <span className="text-xs text-[#aaa]">{t.date}</span>
                  </div>

                  <Quote className="w-6 h-6 text-[#C9A84C]/30 mb-2" />
                  <p className="text-sm text-[#555] leading-relaxed mb-4">
                    {t.text}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#f0f0f0]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#e8c96b] flex items-center justify-center text-sm font-bold text-[#111]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#111]">
                      {t.name}
                    </div>
                    <div className="text-xs text-[#aaa]">
                      {t.role} · {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#2a2a2a] text-white py-16 sm:py-20 rounded-3xl overflow-hidden shadow-2xl my-8 max-w-7xl mx-auto">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C9A84C]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center px-6 sm:px-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-[family-name:var(--font-playfair)]">
              Ready to Own a Masterpiece?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Browse our full collection or reach out for a custom piece crafted
              just for you. Free shipping on orders above PKR 5,000.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/sales" className={homeStyles.buttons.primaryLg}>
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
              <Link
                href="/contact"
                className={homeStyles.buttons.outlineLight}
              >
                Custom Order
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ Section ═══ */}
      <section
        ref={faqRef}
        id="faqs"
        className={`${homeStyles.sectionPadding} bg-[#f9f9f7] reveal-section`}
      >
        <div className={homeStyles.container}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className={homeStyles.eyebrow}>Common Questions</span>
              <h2 className={homeStyles.sectionTitle}>
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {homeContent.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`border rounded-xl transition-all duration-200 ${
                      isOpen
                        ? "border-[#C9A84C]/40 bg-white shadow-sm"
                        : "border-[#f0f0f0] bg-white"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="text-sm font-bold text-[#111] pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#aaa] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#C9A84C]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-[#666] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
