"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { productDetailStyles as s } from "@/app/products/[slug]/style";
import type { ProductItemData } from "@/app/products/[slug]/content";
import { useCart } from "@/context/CartContext";

interface ProductDetailPageProps {
  product: ProductItemData;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const { addItem } = useCart();
  const [customName, setCustomName] = useState<string>("");
  const [selectedImg, setSelectedImg] = useState<string>(product.images[0] || "");
  const [imgOpacity, setImgOpacity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : "Natural"
  );
  const [qty, setQty] = useState<number>(1);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("desc");
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [atcSuccess, setAtcSuccess] = useState<boolean>(false);
  const fallbackShareUrl = `https://www.woodyhome.shop/products/${product.slug}`;
  const [currentUrl, setCurrentUrl] = useState<string>(fallbackShareUrl);


  // Description image gallery state
  const [descActiveImg, setDescActiveImg] = useState<string>(
    product.images[1] || product.images[0] || ""
  );
  const [isDescLightboxOpen, setIsDescLightboxOpen] = useState<boolean>(false);

  // Check wishlist state on mount
  useEffect(() => {
    try {
      const w: string[] = JSON.parse(localStorage.getItem("tm_wish") || "[]");
      setIsWishlisted(w.includes(product.slug));
    } catch {
      // ignore
    }
  }, [product.slug]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Gallery thumb click handler
  const handleSelectThumb = (src: string) => {
    if (src === selectedImg) return;
    setImgOpacity(0);
    setTimeout(() => {
      setSelectedImg(src);
      setImgOpacity(1);
    }, 150);
  };

  // Quantity handlers
  const handleQtyMinus = () => {
    setQty((prev) => Math.max(1, prev - 1));
  };
  const handleQtyPlus = () => {
    setQty((prev) => Math.min(99, prev + 1));
  };

  // Wishlist toggle
  const handleToggleWishlist = () => {
    try {
      const w: string[] = JSON.parse(localStorage.getItem("tm_wish") || "[]");
      const idx = w.indexOf(product.slug);
      let nextWish: string[];
      if (idx > -1) {
        nextWish = w.filter((id) => id !== product.slug);
        setIsWishlisted(false);
      } else {
        nextWish = [...w, product.slug];
        setIsWishlisted(true);
      }
      localStorage.setItem("tm_wish", JSON.stringify(nextWish));
      const badge = document.getElementById("wlHeaderCount");
      if (badge) {
        badge.textContent = nextWish.length > 9 ? "9+" : nextWish.length.toString();
        badge.style.display = nextWish.length > 0 ? "flex" : "none";
      }
    } catch {
      // ignore
    }
  };

  // Add to cart with backend sync
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAtcSuccess(true);
    setTimeout(() => setAtcSuccess(false), 2200);

    const variantId = (product as any).variants?.[0]?.id || (product as any).id || product.slug;
    const customProps: Record<string, string> = {
      "Color / Finish": selectedColor,
    };
    if (customName.trim()) {
      customProps["Personalized Name"] = customName.trim();
    }

    try {
      await addItem(variantId, qty, customProps);
    } catch (err) {
      console.warn("Backend add to cart error, fallback to local:", err);
      try {
        const cart = JSON.parse(localStorage.getItem("gw_cart") || "[]");
        cart.push({
          slug: product.slug,
          title: product.title,
          price: product.price,
          quantity: qty,
          color: selectedColor,
          customName: customName.trim() || undefined,
        });
        localStorage.setItem("gw_cart", JSON.stringify(cart));
      } catch {}
    }
  };


  // Buy now instant checkout WhatsApp URL
  const checkoutText = encodeURIComponent(
    `Hello Woody Home! I would like to order:\n\n*Product:* ${product.title}\n*Variant/Color:* ${selectedColor}\n*Quantity:* ${qty}\n*Price:* ${product.price}\n\nPlease confirm availability and payment details.`
  );
  const buyNowWhatsAppUrl = `https://wa.me/923326457322?text=${checkoutText}`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  // Native share if available
  const handleQuickShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: product.title,
          url: currentUrl,
        })
        .catch(() => {});
    }
  };

  // Accordion toggle
  const toggleAccordion = (name: string) => {
    setOpenAccordion((prev) => (prev === name ? null : name));
  };

  // Calculate dynamic price based on qty if needed
  const unitPriceNum =
    product.priceRaw > 0 ? product.priceRaw / 100 : 2599;
  const totalPriceFormatted = `Rs. ${(unitPriceNum * qty).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const starsString = "★".repeat(Math.floor(product.rating)) + "☆".repeat(5 - Math.floor(product.rating));

  return (
    <div className={s.section}>
      {/* ── Breadcrumb ── */}
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href={`/collections/${product.categorySlug || "all"}`}>
          {product.category || "Products"}
        </Link>
        <span>›</span>
        <span style={{ color: "#333" }}>{product.title}</span>
      </nav>

      {/* ── Main Product Section ── */}
      <div className={s.main}>
        {/* Gallery Column */}
        <div className={s.gallery}>
          <div
            className={s.galleryMain}
            id="galleryMain"
            onClick={() => setIsGalleryModalOpen(true)}
            title="Click to view all photos"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImg}
              alt={product.title}
              id="mainProductImg"
              width={900}
              height={900}
              style={{
                opacity: imgOpacity,
                transition: "opacity 0.2s ease, transform 0.4s ease",
              }}
            />
          </div>

          {/* Thumbnails Row */}
          <div className={s.galleryThumbs}>
            {product.images.slice(0, 5).map((img, idx) => (
              <div
                key={idx}
                className={img === selectedImg ? s.thumbActive : s.thumb}
                onClick={() => handleSelectThumb(img)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={product.title} loading="lazy" />
              </div>
            ))}

            {product.images.length > 5 && (
              <div
                className={s.thumbMore}
                onClick={() => setIsGalleryModalOpen(true)}
                role="button"
                tabIndex={0}
                aria-label={`View all ${product.images.length} photos`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="tm-thumb-more-bg"
                  src={product.images[5]}
                  alt=""
                  loading="lazy"
                />
                <span className="tm-thumb-more-overlay">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Modal (All Photos Lightbox) */}
        <div
          className={isGalleryModalOpen ? s.galleryModalOpen : s.galleryModal}
          id="tmGalleryModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsGalleryModalOpen(false);
          }}
        >
          <button
            className={s.galleryModalClose}
            onClick={() => setIsGalleryModalOpen(false)}
            aria-label="Close"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div className={s.galleryModalInner}>
            {product.images.map((img, i) => (
              <div key={i} className={s.galleryModalItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${product.title} - ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info Column */}
        <div className={s.info}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#aaa",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            {product.vendor || "Woody Home"}
          </p>

          <h1 className={s.heading}>{product.title}</h1>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: "#F5A623",
                fontSize: "16px",
                letterSpacing: "2px",
              }}
            >
              {starsString}
            </span>
            <span style={{ fontSize: "13px", color: "#888" }}>
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className={s.priceBlock} id="productPrice">
            <span className={s.priceMain}>{product.price}</span>
            {product.comparePrice && (
              <span className={s.priceCompare}>{product.comparePrice}</span>
            )}
            {product.savePercent && (
              <span className={s.savings}>Save {product.savePercent}%</span>
            )}
          </div>

          {/* Variants / Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className={s.variantWrap}>
              <span className={s.variantLabel}>
                Color / Finish: <strong>{selectedColor}</strong>
              </span>
              <div className={s.variantOptions}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={
                      selectedColor === color ? s.sizeBtnActive : s.sizeBtn
                    }
                    onClick={() => setSelectedColor(color)}
                  >
                    <span>{color}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Name / Engraving Personalization Field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="customNameInput"
              className={s.variantLabel}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}
            >
              <span>Personalized Name / Custom Carving:</span>
              <span style={{ fontSize: "11px", color: "#C9A84C", fontWeight: 700 }}>
                Free Customization
              </span>
            </label>
            <input
              id="customNameInput"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Tariq Mehmood or Special Text"
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "13px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <p style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
              Our Chiniot master artisans will hand-carve this text onto your piece.
            </p>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "20px" }}>

            <p className={s.variantLabel} style={{ marginBottom: "10px" }}>
              Quantity
            </p>
            <div className={s.qtyWrap}>
              <div className={s.qtySelector}>
                <button
                  type="button"
                  className={s.qtyBtn}
                  onClick={handleQtyMinus}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="text"
                  name="quantity"
                  id="qty"
                  value={qty}
                  className={s.qtyInput}
                  readOnly
                />
                <button
                  type="button"
                  className={s.qtyBtn}
                  onClick={handleQtyPlus}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <span style={{ fontSize: "13px", color: "#27ae60", fontWeight: 600 }}>
                ✓ In Stock
              </span>
            </div>
          </div>

          {/* Buttons Row */}
          <div className={s.atcRow}>
            <button
              type="button"
              className={`${s.atcBtn} ${atcSuccess ? "success" : ""}`}
              onClick={handleAddToCart}
            >
              {atcSuccess ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>

            <button
              type="button"
              className={isWishlisted ? s.wishBtnActive : s.wishBtn}
              onClick={handleToggleWishlist}
              aria-label="Add to Wishlist"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              <span>{isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>

          {/* Buy Now Button */}
          <a
            href={buyNowWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={s.buyBtn}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            ⚡ Buy Now — Instant Checkout
          </a>

          {/* Product Meta */}
          <div className={s.meta}>
            <span>🏷️ Category: {product.category}</span>
            <span>🔖 Tags: {product.tags}</span>
          </div>
        </div>
      </div>

      {/* ── Full-width Description Row ── */}
      <div className={s.descRow}>
        <div className={s.accordion}>
          {/* Accordion Item 1: Product Description */}
          <div className={openAccordion === "desc" ? s.accItemOpen : s.accItem} id="descItem">
            <button
              type="button"
              className={s.accBtn}
              onClick={() => toggleAccordion("desc")}
            >
              <span>📋 Product Description</span>
              <span className={s.accArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>

            <div className={s.accBody}>
              <div className={s.descText}>
                <h2>{product.description.heading}</h2>
                {product.description.intro.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {product.description.customizationNote && (
                  <p>
                    <strong>{product.description.customizationNote}</strong>
                  </p>
                )}

                {product.description.whatsappNote && (
                  <p>
                    <strong>{product.description.whatsappNote}</strong>
                  </p>
                )}

                <hr />

                <h1>⭐ Highlights</h1>
                <p>
                  {product.description.highlights.map((h, idx) => (
                    <React.Fragment key={idx}>
                      {h}
                      <br />
                    </React.Fragment>
                  ))}
                </p>

                <hr />

                <h1>📦 Specifications</h1>
                <ul>
                  {product.description.specifications.map((spec, idx) => (
                    <li key={idx}>
                      {spec.icon && <span>{spec.icon} </span>}
                      <strong>{spec.label}:</strong> {spec.value}
                    </li>
                  ))}
                </ul>

                <hr />

                <h1>🎯 Best For</h1>
                <p>
                  {product.description.bestFor.map((b, idx) => (
                    <React.Fragment key={idx}>
                      {b}
                      <br />
                    </React.Fragment>
                  ))}
                </p>

                <hr />

                <h1>📦 Package Includes</h1>
                <ul>
                  {product.description.packageIncludes.map((pkg, idx) => (
                    <li key={idx}>{pkg}</li>
                  ))}
                </ul>
                {product.description.note && (
                  <p>
                    <em>{product.description.note}</em>
                  </p>
                )}
              </div>

              {/* Description Image Gallery */}
              {product.images.length > 1 && (
                <div className={s.descGallery}>
                  <div
                    className={s.descMainWrap}
                    onClick={() => setIsDescLightboxOpen(true)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={s.descMainImg}
                      src={descActiveImg}
                      alt={product.title}
                    />
                  </div>
                  <div className={s.descThumbs}>
                    {product.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={
                          img === descActiveImg ? s.descThumbActive : s.descThumb
                        }
                        onClick={() => setDescActiveImg(img)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={product.title} loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Accordion Item 2: Shipping & Returns */}
          <div className={openAccordion === "shipping" ? s.accItemOpen : s.accItem}>
            <button
              type="button"
              className={s.accBtn}
              onClick={() => toggleAccordion("shipping")}
            >
              <span>🚚 Shipping &amp; Returns</span>
              <span className={s.accArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            <div className={s.accBody}>
              <p>
                🚚 <strong>Standard Delivery:</strong>{" "}
                {product.shippingReturns.standard}
              </p>
              <p>
                ⚡ <strong>Express Delivery:</strong>{" "}
                {product.shippingReturns.express}
              </p>
              <p>
                🆓 <strong>Free Shipping:</strong>{" "}
                {product.shippingReturns.freeShipping}
              </p>
              <p>
                ↩️ <strong>Returns:</strong> {product.shippingReturns.returns}
              </p>
            </div>
          </div>

          {/* Accordion Item 3: Size Guide */}
          <div className={openAccordion === "size" ? s.accItemOpen : s.accItem}>
            <button
              type="button"
              className={s.accBtn}
              onClick={() => toggleAccordion("size")}
            >
              <span>📏 Size Guide</span>
              <span className={s.accArrow}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            <div className={s.accBody}>
              <p>{product.sizeGuide}</p>
            </div>
          </div>
        </div>

        {/* Share Button Wrap */}
        <div className={s.shareWrap}>
          <button
            type="button"
            className={s.shareBtn}
            onClick={() => setIsShareModalOpen(true)}
          >
            <span className={s.shareIcon}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </span>
            <span>Share</span>
          </button>
        </div>

        {/* Share Modal */}
        <div
          className={isShareModalOpen ? s.shareOverlayOpen : s.shareOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsShareModalOpen(false);
          }}
        >
          <div className={s.shareModal}>
            <div className={s.shareHead}>
              <span className={s.shareTitle}>Share</span>
              <button
                type="button"
                className={s.shareClose}
                onClick={() => setIsShareModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={s.sharePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={s.sharePrevImg}
                src={product.images[0]}
                alt={product.title}
              />
              <div>
                <div className={s.sharePrevName}>{product.title}</div>
                <div className={s.sharePrevPrice}>{product.price}</div>
              </div>
            </div>

            <div className={s.shareGrid}>
              <a
                className={s.shareOpt}
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${product.title} – ${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={s.shareIco} style={{ background: "#e8f8ee" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className={s.shareLbl}>WhatsApp</span>
              </a>

              <a
                className={s.shareOpt}
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={s.shareIco} style={{ background: "#e7f0fd" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className={s.shareLbl}>Facebook</span>
              </a>

              <a
                className={s.shareOpt}
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                  currentUrl
                )}&media=${encodeURIComponent(
                  product.images[0]
                )}&description=${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={s.shareIco} style={{ background: "#fdecea" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#E60023">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                  </svg>
                </div>
                <span className={s.shareLbl}>Pinterest</span>
              </a>

              <a
                className={s.shareOpt}
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  currentUrl
                )}&text=${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={s.shareIco} style={{ background: "#f0f0f0" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#111">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className={s.shareLbl}>X (Twitter)</span>
              </a>
            </div>

            <div
              className={`${s.shareCopy} ${copiedLink ? "copied" : ""}`}
              onClick={handleCopyLink}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#999"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
              <span className={s.shareCopyUrl}>{currentUrl}</span>
              <span className={s.shareCopyLbl}>
                {copiedLink ? "✓ Copied!" : "Copy link"}
              </span>
            </div>
          </div>
        </div>

        {/* Lightbox for Description Images */}
        <div
          className={isDescLightboxOpen ? s.descLightboxOpen : s.descLightbox}
          onClick={() => setIsDescLightboxOpen(false)}
        >
          <button
            type="button"
            className={s.descLbClose}
            onClick={() => setIsDescLightboxOpen(false)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={descActiveImg} alt="" />
        </div>
      </div>

      {/* ── You May Also Like Section ── */}
      {product.recommendations && product.recommendations.length > 0 && (
        <div className={s.recsSection}>
          <h2 className={s.recsHeading}>You May Also Like</h2>
          <div className={s.recsGrid}>
            {product.recommendations.map((rec, idx) => {
              const recStars =
                "★".repeat(Math.floor(rec.rating)) +
                "☆".repeat(5 - Math.floor(rec.rating));
              return (
                <Link
                  key={idx}
                  href={rec.href}
                  className="pc-card pc-style--11 pc-style-m--11"
                >
                  <div className="pc-media">
                    <div className="pc-img-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="pc-img"
                        src={rec.image}
                        alt={rec.title}
                        loading="lazy"
                        width={400}
                        height={400}
                      />
                    </div>

                    {rec.saveBadge && (
                      <div className="pc-badges">
                        <span className="pc-badge pc-badge--sale">
                          {rec.saveBadge.replace("Save ", "-")} OFF
                        </span>
                      </div>
                    )}

                    <div className="pc-actions">
                      <button
                        className="pc-action pc-action--cart"
                        data-tip="Add to Cart"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const btn = e.currentTarget;
                          btn.style.background = "#27ae60";
                          btn.style.color = "#fff";
                          setTimeout(() => {
                            btn.style.background = "";
                            btn.style.color = "";
                          }, 1500);
                        }}
                        type="button"
                        aria-label="Add to Cart"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                          <line x1="3" y1="6" x2="21" y2="6" />
                          <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                      </button>

                      <button
                        className="pc-action pc-action--wish"
                        data-tip="Wishlist"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const btn = e.currentTarget;
                          btn.classList.toggle("pc-wished");
                        }}
                        type="button"
                        aria-label="Add to Wishlist"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="pc-info">
                    <p className="pc-vendor">{rec.vendor || "Woody Home"}</p>
                    <div className="pc-stars">
                      <span>{recStars}</span>
                      <span className="pc-stars-cnt">({rec.reviewCount})</span>
                    </div>
                    <p className="pc-title">{rec.title}</p>
                    <div className="pc-price-row">
                      <span className="pc-price">{rec.price}</span>
                      {rec.comparePrice && (
                        <span className="pc-compare">{rec.comparePrice}</span>
                      )}
                      {rec.saveBadge && (
                        <span className="pc-save">{rec.saveBadge}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className={s.recsViewAllWrap}>
            <Link href="/sales" className={s.recsViewAll}>
              View All Products
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
