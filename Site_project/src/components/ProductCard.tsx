"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";

export interface ProductCardProps {
  title: string;
  price: string;
  comparePrice?: string;
  vendor?: string;
  image: string;
  href: string;
  badge?: "sale" | "new" | "hot" | "sold";
  rating?: number;
  reviewCount?: number;
  savePercent?: number;
  /** Desktop style: 3 = Overlay, 11 = Original, 12 = Minimal, 13 = Frame, 14 = Bold */
  desktopStyle?: 3 | 11 | 12 | 13 | 14;
  /** Mobile style: same options */
  mobileStyle?: 3 | 11 | 12 | 13 | 14;
}

export function ProductCard({
  title,
  price,
  comparePrice,
  vendor,
  image,
  href,
  badge,
  rating = 5,
  reviewCount,
  savePercent,
  desktopStyle = 11,
  mobileStyle = 11,
}: ProductCardProps) {
  const badgeLabel = {
    sale: "Sale",
    new: "New",
    hot: "Hot",
    sold: "Sold Out",
  };

  const stars = "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");

  return (
    <Link
      href={href}
      className={`pc-card pc-style--${desktopStyle} pc-style-m--${mobileStyle}`}
    >
      <div className="pc-media">
        <div className="pc-img-wrap">
          <img src={image} alt={title} className="pc-img" loading="lazy" />
        </div>

        {badge && (
          <div className="pc-badges">
            <span className={`pc-badge pc-badge--${badge}`}>
              {badgeLabel[badge]}
            </span>
          </div>
        )}

        <div className="pc-actions">
          <button
            className="pc-action pc-action--cart"
            data-tip="Add to Cart"
            onClick={(e) => e.preventDefault()}
            type="button"
          >
            <ShoppingCart />
          </button>
          <button
            className="pc-action pc-action--wish"
            data-tip="Wishlist"
            onClick={(e) => e.preventDefault()}
            type="button"
          >
            <Heart />
          </button>
          <button
            className="pc-action pc-action--qv"
            data-tip="Quick View"
            onClick={(e) => e.preventDefault()}
            type="button"
          >
            <Eye />
          </button>
        </div>
      </div>

      <div className="pc-info">
        {vendor && <p className="pc-vendor">{vendor}</p>}

        {rating > 0 && (
          <div className="pc-stars">
            <span>{stars}</span>
            {reviewCount !== undefined && (
              <span className="pc-stars-cnt">({reviewCount})</span>
            )}
          </div>
        )}

        <h3 className="pc-title">{title}</h3>

        <div className="pc-price-row">
          <span className="pc-price">{price}</span>
          {comparePrice && (
            <span className="pc-compare">{comparePrice}</span>
          )}
          {savePercent && savePercent > 0 && (
            <span className="pc-save">-{savePercent}%</span>
          )}
        </div>
      </div>
    </Link>
  );
}
