import type { Metadata } from "next";

export interface SaleProduct {
  title: string;
  price: string;
  comparePrice: string;
  image: string;
  href: string;
  badge: "sale" | "hot";
  vendor: string;
  rating: number;
  reviewCount: number;
  savePercent: number;
}

export const salesContent = {
  seo: {
    title: "Sale & Special Offers — Woody Home",
    description:
      "Exclusive discounts on handcrafted sheesham wooden collectibles, home decor, animal lamps, and desk accessories. Limited time offers with free shipping.",
  } as Metadata,

  header: {
    badge: "Limited Time Offers",
    title: "Exclusive Handcrafted Deals",
    description:
      "Save up to 35% on authentic Chiniot sheesham wood masterpieces. Each item is hand-carved, polished to perfection, and delivered securely to your doorstep.",
    promoBanner: {
      tag: "SPECIAL DISCOUNT",
      code: "WOODY10",
      text: "Use code at checkout for an extra 10% off on all sale items",
    },
  },

  trustBadges: [
    { title: "Free Shipping", desc: "On all orders above PKR 5,000" },
    { title: "Cash on Delivery", desc: "Available all across Pakistan" },
    { title: "100% Solid Sheesham", desc: "Authentic Chiniot craftsmanship" },
    { title: "Damage-Free Guarantee", desc: "Safe bubble-wrapped delivery" },
  ],

  saleProducts: [
    {
      title: "Hand-Carved Wooden Antique Cannon",
      price: "PKR 4,500",
      comparePrice: "PKR 6,500",
      image: "https://www.glossywoods.shop/cdn/shop/collections/wooden_toy_truck_isometric.webp?v=1786183971&width=700",
      href: "/products/heritage-wooden-hourse-cart-showpiece",
      badge: "hot",
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 42,
      savePercent: 31,
    },
    {
      title: "Wooden Bicycle Table Clock",
      price: "PKR 2,800",
      comparePrice: "PKR 3,800",
      image: "https://www.glossywoods.shop/cdn/shop/collections/love_wall_clock.webp?v=1786184224&width=700",
      href: "/products/handcrafted-wooden-bicycle-clock-with-flower-basket-decorative-table-clock-vase",
      badge: "sale",
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 29,
      savePercent: 26,
    },
    {
      title: "Wooden Semi Truck & Trailer Masterpiece",
      price: "PKR 7,200",
      comparePrice: "PKR 9,500",
      image: "https://www.glossywoods.shop/cdn/shop/collections/wooden_semi_truck_1500x1500_1_1db7b3a7-1387-4485-92a5-527d27996112.png?v=1786442168&width=700",
      href: "/products/wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
      badge: "hot",
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 38,
      savePercent: 24,
    },
    {
      title: "Handcrafted Lattice Sheesham Tissue Box",
      price: "PKR 2,400",
      comparePrice: "PKR 3,200",
      image: "https://www.glossywoods.shop/cdn/shop/collections/wooden_tissue_box_office.webp?v=1786184483&width=700",
      href: "/products/%F0%9F%90%B0-handmade-wooden-bunny-tissue-box",
      badge: "sale",
      vendor: "Woody Home",
      rating: 4.8,
      reviewCount: 51,
      savePercent: 25,
    },
    {
      title: "Carved Wooden Walking Stick — Eagle Head",
      price: "PKR 4,200",
      comparePrice: "PKR 5,500",
      image: "https://www.glossywoods.shop/cdn/shop/collections/carved_walking_stick_1_467c9b5c-a9ee-4b92-a706-1887048796c7.webp?v=1786340831&width=700",
      href: "/products/premium-wooden-designer-walking-cane-classic-handmade-handle",
      badge: "sale",
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 19,
      savePercent: 24,
    },
    {
      title: "Artisan Robot Table Lamp — Warm Ambient Light",
      price: "PKR 3,900",
      comparePrice: "PKR 5,500",
      image: "https://www.glossywoods.shop/cdn/shop/collections/wooden_robot_lamp.webp?v=1786184416&width=700",
      href: "/products/hexagon-wooden-table-lamp",
      badge: "hot",
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 33,
      savePercent: 29,
    },
    {
      title: "Wooden Jet Fighter Air Craft Replica",
      price: "PKR 3,400",
      comparePrice: "PKR 4,500",
      image: "https://www.glossywoods.shop/cdn/shop/collections/wooden_jet_isometric.webp?v=1786184138&width=700",
      href: "/products/handmade-wooden-fighter-jet-model-premium-aircraft-desk-decor",
      badge: "sale",
      vendor: "Woody Home",
      rating: 4.9,
      reviewCount: 22,
      savePercent: 24,
    },
    {
      title: "Handcrafted TV Phone Stand & Pen Holder",
      price: "PKR 1,950",
      comparePrice: "PKR 2,600",
      image: "https://www.glossywoods.shop/cdn/shop/collections/sheesham_tv_phone_holder_2.webp?v=1786191738&width=700",
      href: "/products/handmade-sheesham-wood-pen-holder-feather-guitar",
      badge: "sale",
      vendor: "Woody Home",
      rating: 4.7,
      reviewCount: 64,
      savePercent: 25,
    },
  ] as SaleProduct[],
};
