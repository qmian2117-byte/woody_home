import type { Metadata } from "next";
import type { TestimonialItem, ProcessStepItem, FaqItem, StatItem } from "@/app/_shared/page-content";

export interface FeaturedProduct {
  title: string;
  price: string;
  comparePrice?: string;
  image: string;
  href: string;
  badge?: "sale" | "new" | "hot" | "sold";
  vendor: string;
  rating: number;
  reviewCount: number;
  savePercent?: number;
}

export const homeContent = {
  seo: {
    title: "Woody Home — Handcrafted Wooden Masterpieces",
    description:
      "Premium handcrafted sheesham wood home decor, desk accessories, animal lamps, and bespoke wooden gifts. Each piece is a work of art from Chiniot, Pakistan.",
  } as Metadata,

  hero: {
    badge: "Handcrafted with Love",
    title: "Woody Home",
    subtitle: "Crafted Wooden Collectibles",
    description:
      "Handmade decor to elevate your home",
    backgroundImage: "/images/hero-bg.jpg",
    primaryCta: {
      label: "SHOP NOW",
      href: "/sales",
    },
    secondaryCta: {
      label: "VIEW COLLECTION",
      href: "/collections",
    },
    trustBar: [
      { icon: "truck", text: "FREE SHIPPING ON ALL ORDERS" },
      { icon: "shield", text: "SAFE & SECURE PAYMENT" },
      { icon: "phone", text: "+92 3326457322" },
      { icon: "store", text: "VISIT OUR STORE" },
    ],
  },

  stats: [
    { value: 2500, suffix: "+", label: "Happy Customers", sublabel: "Worldwide" },
    { value: 150, suffix: "+", label: "Unique Designs", sublabel: "Handcrafted Collection" },
    { value: 99, suffix: "%", label: "5-Star Reviews", sublabel: "Customer Satisfaction" },
    { value: 15, suffix: "+", label: "Years of Craft", sublabel: "Chiniot Heritage" },
  ] as StatItem[],

  featuredProducts: [
    {
      title: "Handmade Wooden Fighter Jet Model | Premium Aircraft Desk Decor",
      price: "Rs.2,499.00",
      comparePrice: "Rs.3,499.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/wooden_fighter_jet_office.webp?v=1786446438&width=500",
      href: "/products/handmade-wooden-fighter-jet-model-premium-aircraft-desk-decor",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 4.5,
      reviewCount: 248,
      savePercent: 28,
    },
    {
      title: "Wooden Apple Desk Clock with Pen Holder | Handmade Office Organizer & Custom Gift",
      price: "Rs.2,599.00",
      comparePrice: "Rs.2,999.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=500",
      href: "/products/wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 3.0,
      reviewCount: 261,
      savePercent: 13,
    },
    {
      title: "Handcrafted Wooden Bangle & Jewelry Organizer",
      price: "Rs.2,500.00",
      comparePrice: "Rs.2,999.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/cozy_bedroom_dressing_table.webp?v=1786270265&width=500",
      href: "/products/handcrafted-wooden-bangle-jewelry-organizer",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 3.5,
      reviewCount: 240,
      savePercent: 16,
    },
    {
      title: "Handcrafted Wooden Deer Sculpture",
      price: "Rs.2,599.00",
      comparePrice: "Rs.3,299.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/walnut_deer_shelf.webp?v=1786270082&width=500",
      href: "/products/handcrafted-wooden-deer-sculpture",
      badge: "hot" as const,
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 250,
      savePercent: 21,
    },
    {
      title: "Handcrafted Wooden Hanging Jhula",
      price: "Rs.2,299.00",
      comparePrice: "Rs.3,399.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/wooden_jhula_garden.webp?v=1786269897&width=500",
      href: "/products/handcrafted-wooden-hanging-jhula",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 3.5,
      reviewCount: 196,
      savePercent: 32,
    },
    {
      title: "Handcrafted Sheesham Wood Animal Table Lamp – Deer, Horse, Swan, Elephant & Lion Designs",
      price: "Rs.2,199.00",
      comparePrice: "Rs.3,399.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/sheesham_animal_lamps_group.webp?v=1786179482&width=500",
      href: "/products/handcrafted-sheesham-wood-animal-table-lamp-deer-horse-swan-elephant-lion-designs",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 4,
      reviewCount: 289,
      savePercent: 35,
    },
    {
      title: "Wooden Swan LED Night Lamp",
      price: "Rs.2,899.00",
      comparePrice: "Rs.3,499.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/cozy_duck_lamp_3.webp?v=1786269158&width=500",
      href: "/products/wooden-swan-led-night-lamp",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 4,
      reviewCount: 330,
      savePercent: 17,
    },
    {
      title: "🐰 Handmade Wooden Bunny Tissue Box",
      price: "Rs.2,199.00",
      comparePrice: "Rs.2,899.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/wooden_bunny_tissue_box_3_1.webp?v=1786448138&width=500",
      href: "/products/%F0%9F%90%B0-handmade-wooden-bunny-tissue-box",
      badge: "hot" as const,
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 295,
      savePercent: 24,
    },
    {
      title: "Sheesham Wood Coaster Set with Holder – Natural Wooden Drink Coasters",
      price: "Rs.1,899.00",
      comparePrice: "Rs.2,499.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/outdoor_garden_tea.webp?v=1786179070&width=500",
      href: "/products/sheesham-wood-coaster-set-with-holder-natural-wooden-drink-coasters",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 3.5,
      reviewCount: 231,
      savePercent: 24,
    },
    {
      title: "Premium Wooden Designer Walking Cane – Classic Handmade Handle",
      price: "Rs.3,799.00",
      comparePrice: "Rs.4,399.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/garden_cane_hand_1x1_0c8c09b6-c69c-48fd-be6e-bbc642683b19.jpg?v=1786272257&width=500",
      href: "/products/premium-wooden-designer-walking-cane-classic-handmade-handle",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 3.5,
      reviewCount: 313,
      savePercent: 13,
    },
    {
      title: "Hexagon Wooden Table Lamp | Handmade Decorative Light",
      price: "Rs.2,400.00",
      comparePrice: "Rs.2,900.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083&width=500",
      href: "/products/hexagon-wooden-table-lamp",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 215,
      savePercent: 17,
    },
    {
      title: "Handmade Sheesham Wood Pen Holder – Feather & Guitar",
      price: "Rs.899.00",
      comparePrice: "Rs.2,199.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/sheesham_feather_pen_holder_9.webp?v=1786435229&width=500",
      href: "/products/handmade-sheesham-wood-pen-holder-feather-guitar",
      badge: "hot" as const,
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 313,
      savePercent: 59,
    },
    {
      title: "Handcrafted Wooden Chicken Egg Holder – Rustic Kitchen & Farmhouse Decor",
      price: "Rs.1,899.00",
      comparePrice: "Rs.2,399.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/cozy_rustic_breakfast.webp?v=1786536451&width=500",
      href: "/products/handcrafted-wooden-chicken-egg-holder-rustic-kitchen-farmhouse-decor",
      badge: "new" as const,
      vendor: "Woody Home",
      rating: 5,
      reviewCount: 338,
      savePercent: 20,
    },
    {
      title: "Custom Name Wooden LED Lamp",
      price: "Rs.2,599.00",
      comparePrice: "Rs.3,400.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/WhatsAppImage2026-09-06at4.24.36PM.jpg?v=1788694196&width=500",
      href: "/products/custom-name-wooden-led-lamp",
      badge: "hot" as const,
      vendor: "Woody Home",
      rating: 3.5,
      reviewCount: 305,
      savePercent: 23,
    },
    {
      title: "Heritage wooden Hourse Cart Showpiece",
      price: "Rs.2,499.00",
      comparePrice: "Rs.3,699.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/WhatsAppImage2026-07-30at10.42.30AM_1.jpg?v=1785852723&width=500",
      href: "/products/heritage-wooden-hourse-cart-showpiece",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 4,
      reviewCount: 346,
      savePercent: 32,
    },
    {
      title: "Handcrafted Wooden 5-Candle Candelabra",
      price: "Rs.2,399.00",
      comparePrice: "Rs.3,200.00",
      image: "https://www.glossywoods.shop/cdn/shop/files/wooden_candelabra_marble_table_1_222483ba-7b0d-411a-b718-15a47458d97f.webp?v=1786533730&width=500",
      href: "/products/handcrafted-wooden-5-candle-candelabra",
      badge: "sale" as const,
      vendor: "Woody Home",
      rating: 3.5,
      reviewCount: 179,
      savePercent: 25,
    },
  ] as FeaturedProduct[],

  customOrdersTeaser: {
    eyebrow: "Bespoke · Made To Order",
    heading: "Have Something Special in Mind?",
    description:
      "Send us a sample, sketch, or photo of what you're picturing — our craftsmen will bring it to life in wood, exactly as you imagined it.",
    cta: {
      label: "Start Your Custom Order",
      href: "/contact",
    },
    logo: "/images/gw-intro-logo-clean.png",
  },

  uniqueProducts: {
    eyebrow: "Explore Latest",
    heading: "Shop Unique Products",
    items: [
      {
        title: "Customize Name Lamp",
        href: "/products/custom-name-wooden-led-lamp",
        image:
          "https://www.glossywoods.shop/cdn/shop/files/WhatsAppImage2026-09-06at4.24.36PM.jpg?v=1788694196&width=1200",
        width: 1200,
        height: 1590,
        delay: 0,
        titleColor: "#c9a84c",
        btnText: "Shop Now",
      },
      {
        title: "Tissue Box",
        href: "/products/%F0%9F%90%B0-handmade-wooden-bunny-tissue-box",
        image:
          "https://www.glossywoods.shop/cdn/shop/files/cozy_bedroom_nightstand_2.webp?v=1786448138&width=1200",
        width: 1200,
        height: 1108,
        delay: 120,
        titleColor: "#c9a84c",
        btnText: "Shop Now",
      },
    ],
  },

  collectionsHeader: {
    eyebrow: "BROWSE",
    heading: "Our Collections",
  },

  collections: [
    {
      title: "Tissue Box",
      count: "4 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_tissue_box_office.webp?v=1786184483&width=700",
      href: "/collections/tissue-box",
      width: 700,
      height: 511,
      delay: 0,
    },
    {
      title: "Air  Crafts",
      count: "3 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_jet_isometric.webp?v=1786184138&width=700",
      href: "/collections/air-crafts",
      width: 700,
      height: 928,
      delay: 90,
    },
    {
      title: "Cars",
      count: "6 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_toy_truck_isometric.webp?v=1786183971&width=700",
      href: "/collections/cars",
      width: 700,
      height: 528,
      delay: 180,
    },
    {
      title: "Clocks",
      count: "5 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/love_wall_clock.webp?v=1786184224&width=700",
      href: "/collections/clocks",
      width: 700,
      height: 928,
      delay: 270,
    },
    {
      title: "Hand Sticks",
      count: "9 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/carved_walking_stick_1_467c9b5c-a9ee-4b92-a706-1887048796c7.webp?v=1786340831&width=700",
      href: "/collections/hand-sticks",
      width: 700,
      height: 700,
      delay: 360,
    },
    {
      title: "Vehicals",
      count: "13 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_semi_truck_1500x1500_1_1db7b3a7-1387-4485-92a5-527d27996112.png?v=1786442168&width=700",
      href: "/collections/vehicals",
      width: 700,
      height: 700,
      delay: 450,
    },
    {
      title: "Lamps",
      count: "7 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_robot_lamp.webp?v=1786184416&width=700",
      href: "/collections/lamps",
      width: 700,
      height: 544,
      delay: 540,
    },
    {
      title: "Home Decor",
      count: "19 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/sheesham_tv_phone_holder_2.webp?v=1786191738&width=700",
      href: "/collections/home-decor",
      width: 700,
      height: 917,
      delay: 630,
    },
  ],

  whyChooseUs: {
    label: "Why Choose Us",
    title: "Premium Quality You Can Trust",
    description:
      "We source only the finest products to bring you an exceptional shopping experience. Every item is carefully selected for quality, durability, and style.",
    image:
      "https://www.glossywoods.shop/cdn/shop/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083&width=800",
    imageAlt: "Premium Quality You Can Trust",
    badge: {
      icon: "⭐",
      num: "5K+",
      label: "Happy Customers",
    },
    features: [
      {
        icon: "✅",
        title: "Premium Quality Products",
        text: "Every product goes through strict quality checks before reaching you.",
      },
      {
        icon: "🚚",
        title: "Fast & Reliable Delivery",
        text: "We deliver across All over Pakistan with speed and care.",
      },
      {
        icon: "🔒",
        title: "Secure & Easy Payments",
        text: "Bank transfer and All online payments are available.",
      },
      {
        icon: "↩️",
        title: "7-Day Easy Returns",
        text: "Not happy? Return within 7 days, no questions asked.",
      },
    ],
    primaryCta: {
      label: "Shop Now",
      href: "/sales",
    },
    secondaryCta: {
      label: "Learn More",
      href: "/about",
    },
    stats: [
      { num: "5K+", label: "Happy Customers" },
      { num: "500+", label: "Products" },
      { num: "7-Day", label: "Easy Returns" },
    ],
  },

  testimonials: [
    {
      id: "t1",
      name: "Sarah Mitchell",
      role: "Interior Designer",
      location: "New York, USA",
      rating: 5,
      date: "2 weeks ago",
      text: "The craftsmanship is absolutely breathtaking. The wooden dragon lamp is a centerpiece in my client's living room. The detail in the carving is museum-quality — I've never seen anything like it online.",
      serviceUsed: "Dragon Lamp Collection",
    },
    {
      id: "t2",
      name: "Ahmed Khan",
      role: "Corporate Buyer",
      location: "Dubai, UAE",
      rating: 5,
      date: "1 month ago",
      text: "We ordered 50 custom desk organizers as executive gifts. The quality exceeded expectations, the packaging was exquisite, and they shipped internationally with zero issues. Already planning our next order.",
      serviceUsed: "Custom Corporate Gifts",
    },
    {
      id: "t3",
      name: "Emma Johansson",
      role: "Home Enthusiast",
      location: "Stockholm, Sweden",
      rating: 5,
      date: "3 weeks ago",
      text: "I've been collecting wooden decor for years, and Woody Home pieces are in a league of their own. The sheesham wood has the most beautiful grain, and the polish is silky smooth. Worth every penny.",
      serviceUsed: "Home Decor Collection",
    },
  ] as TestimonialItem[],

  faqs: [
    {
      question: "What type of wood do you use?",
      answer:
        "We primarily use premium sheesham (rosewood) sourced from sustainable plantations. Sheesham is prized for its rich grain patterns, natural durability, and beautiful golden-brown tones that deepen with age.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes! We offer worldwide shipping. Orders above PKR 5,000 qualify for free shipping. All items are securely packaged with custom foam inserts and tracked from our workshop to your door.",
    },
    {
      question: "Can I order custom designs?",
      answer:
        "Absolutely! Custom orders are our specialty. Share your idea, dimensions, and any reference images via WhatsApp or email. Our master craftsmen will create a one-of-a-kind piece tailored to your vision.",
    },
    {
      question: "How long does each piece take to make?",
      answer:
        "Standard collection items ship within 3–5 business days. Custom orders typically take 2–4 weeks depending on complexity. We never rush — every piece deserves the time to be crafted perfectly.",
    },
  ] as FaqItem[],
};
