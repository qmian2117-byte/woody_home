"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ShoppingBag, MessageCircle } from "lucide-react";
import { collectionDetailStyles } from "@/app/collections/[slug]/style";
import type { getCollectionBySlug } from "@/app/collections/[slug]/content";

interface CollectionDetailProps {
  collection: NonNullable<ReturnType<typeof getCollectionBySlug>>;
}

export function CollectionDetailPage({ collection }: CollectionDetailProps) {
  const whatsappUrl = `https://wa.me/923326457322?text=${encodeURIComponent(
    `Hi Woody Home! I am interested in ordering products from the ${collection.title} collection.`
  )}`;

  return (
    <div className={collectionDetailStyles.section}>
      <div className={collectionDetailStyles.container}>
        {/* Breadcrumb */}
        <nav className={collectionDetailStyles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={collectionDetailStyles.breadcrumbLink}>
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/collections" className={collectionDetailStyles.breadcrumbLink}>
            Collections
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className={collectionDetailStyles.breadcrumbCurrent}>
            {collection.title}
          </span>
        </nav>

        {/* Header */}
        <div className={collectionDetailStyles.header}>
          <span className={collectionDetailStyles.eyebrow}>Collection</span>
          <h1 className={collectionDetailStyles.heading}>{collection.title}</h1>
          <p className={collectionDetailStyles.description}>
            {collection.description}
          </p>
        </div>

        {/* Featured Showcase Card */}
        <div className={collectionDetailStyles.cardWrap}>
          <div className={collectionDetailStyles.imageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={collection.image}
              alt={collection.title}
              className={collectionDetailStyles.image}
              width={700}
              height={700}
            />
          </div>

          <span className={collectionDetailStyles.badge}>
            {collection.count} Available
          </span>

          <p className="text-sm text-neutral-500 max-w-md mb-6">
            Hand-carved from solid Pakistani Sheesham wood with high-gloss natural polish finish.
          </p>

          <div className={collectionDetailStyles.ctaRow}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={collectionDetailStyles.primaryBtn}
            >
              <MessageCircle className="w-4 h-4" />
              Order on WhatsApp
            </a>

            <Link href="/collections" className={collectionDetailStyles.secondaryBtn}>
              <ArrowLeft className="w-4 h-4" />
              All Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
