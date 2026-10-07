import type { Metadata } from "next";

export interface SpecificationItem {
  label: string;
  value: string;
  icon?: string;
}

export interface RecommendationItem {
  title: string;
  price: string;
  comparePrice?: string;
  saveBadge?: string;
  image: string;
  href: string;
  vendor: string;
  rating: number;
  reviewCount: number;
}

export interface ProductItemData {
  slug: string;
  title: string;
  vendor: string;
  price: string;
  priceRaw: number;
  comparePrice?: string;
  compareRaw?: number;
  savePercent?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  tags: string;
  sku: string;
  inStock: boolean;
  colors: string[];
  images: string[];
  description: {
    heading: string;
    intro: string[];
    customizationNote?: string;
    whatsappNote?: string;
    highlights: string[];
    specifications: SpecificationItem[];
    bestFor: string[];
    packageIncludes: string[];
    note?: string;
  };
  shippingReturns: {
    standard: string;
    express: string;
    freeShipping: string;
    returns: string;
  };
  sizeGuide: string;
  recommendations: RecommendationItem[];
}

export const staticProducts: Record<string, ProductItemData> = {
  // ── 1. Wooden Apple Desk Clock ──
  "wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift": {
    slug: "wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
    title: "Wooden Apple Desk Clock with Pen Holder | Handmade Office Organizer & Custom Gift",
    vendor: "Woody Home",
    price: "Rs. 2599.00",
    priceRaw: 259900,
    comparePrice: "Rs.2,999.00",
    compareRaw: 299900,
    savePercent: 13,
    rating: 3.0,
    reviewCount: 261,
    category: "Clocks",
    categorySlug: "clocks",
    tags: "apple desk clock, corporate gift, custom wooden clock, woodyhome, handmade wooden decor, office desk organizer, pen holder, personalized desk clock, personalized office gift, study table organizer, teacher gift, wooden clock with pen holder, wooden desk clock, wooden office accessories, wooden pen stand",
    sku: "GW-ADC-001",
    inStock: true,
    colors: ["Natural Walnut", "Light Wood Finish", "Vintage Teak", "Dark Sheesham"],
    images: [
      "https://www.woodyhome.shop/cdn/shop/files/garden_clock_lifestyle_24a5d9bd-f73b-4046-85be-ce4eaa81dd6b.webp?v=1786443489&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/cozy_bedside_clock.webp?v=1786443488&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/cozy_wooden_apple_clock.webp?v=1786443488&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/hotel_reception_clock.webp?v=1786443488&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/rustic_coffee_table_lifestyle_b412af0a-d825-4b55-9752-58a50aaeec6b.webp?v=1786443489&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/student_study_desk_clock.webp?v=1786443489&width=1200",
      "https://www.woodyhome.shop/cdn/shop/files/teacher_day_gift_exchange.webp?v=1786443488&width=1200",
      "https://www.woodyhome.shop/cdn/shop/files/teacher_desk_apple_clock.webp?v=1786443489&width=1200",
      "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_clock_desk.webp?v=1786443488&width=1200",
      "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_clock_desk_1.webp?v=1786443488&width=1200",
    ],
    description: {
      heading: "🍎 Personalize Your Workspace",
      intro: [
        "Upgrade your desk with this beautifully handcrafted Wooden Apple Desk Clock & Pen Holder, designed to combine elegance, functionality, and personalization.",
        "Crafted from premium-quality wood with a smooth polished finish, this multifunctional desk organizer keeps your pens within reach while adding timeless charm to your workspace.",
        "Perfect for offices, study tables, reception desks, teachers, students, and professionals.",
      ],
      customizationNote:
        "✨ Customize it your way! We can engrave or print your name, company logo, business name, or any custom text on the clock, making it a unique keepsake for yourself or a memorable gift.",
      whatsappNote:
        "📲 Simply place your order and send your name or logo via WhatsApp, and our artisans will create a personalized piece just for you.",
      highlights: [
        "✅ Personalized with Your Name or Logo",
        "📲 Send your customization details via WhatsApp after ordering",
        "🍎 Unique Apple-Shaped Design",
        "🕒 Built-in Analog Clock",
        "🖊️ Integrated Pen Holder",
        "🪵 Premium Handmade Wooden Craftsmanship",
        "✨ Smooth Hand-Polished Finish",
        "🎁 Perfect Gift for Professionals & Students",
      ],
      specifications: [
        { label: "Material", value: "Premium Quality Wood", icon: "🪵" },
        { label: "Finish", value: "Smooth Hand-Polished", icon: "🎨" },
        { label: "Color", value: "Natural Walnut & Light Wood Finish", icon: "🌰" },
        { label: "Design", value: "Apple-Shaped Desk Organizer", icon: "🍎" },
        { label: "Clock Type", value: "Analog Quartz Movement", icon: "🕒" },
        { label: "Accessory", value: "Built-in Pen Holder", icon: "✏️" },
        { label: "Handmade", value: "Yes", icon: "✋" },
        { label: "Customizable", value: "Yes (Name, Logo or Text)", icon: "✨" },
        { label: "Usage", value: "Office, Home, Study Table", icon: "🏠" },
      ],
      bestFor: [
        "💼 Office Desk",
        "🏠 Home Office",
        "📚 Study Table",
        "👨‍🏫 Teachers",
        "👨‍💼 Professionals",
        "🎓 Students",
        "🎁 Corporate Gifts",
        "🎂 Birthday Gifts",
        "🏆 Employee Appreciation Gifts",
      ],
      packageIncludes: [
        "1 × Handcrafted Wooden Apple Desk Clock",
        "1 × Built-in Wooden Pen Holder",
      ],
      note: "(Pens shown in photos are for display purposes only and are not included.)",
    },
    shippingReturns: {
      standard: "3–5 business days nationwide",
      express: "1–2 business days",
      freeShipping: "On orders above Rs. 1,000",
      returns: "Easy 7-day hassle-free returns in original condition",
    },
    sizeGuide:
      "Dimensions: 15cm x 12cm x 6cm. Perfectly sized for any executive desk or bedside table. For custom size requests, please contact us on WhatsApp.",
    recommendations: [
      {
        title: "Handcrafted Wooden Bicycle Clock with Flower Basket | Decorative Table Clock & Vase",
        price: "Rs.2,799.00",
        comparePrice: "Rs.3,399.00",
        saveBadge: "Save 17%",
        image: "https://www.woodyhome.shop/cdn/shop/files/corporate_reception_clock.webp?v=1786348564&width=400",
        href: "/products/handcrafted-wooden-bicycle-clock-with-flower-basket-decorative-table-clock-vase",
        vendor: "Woody Home",
        rating: 3.5,
        reviewCount: 156,
      },
      {
        title: "Handmade Wooden Table Clock – Rustic Vintage Bicycle Handlebar Design ⏰",
        price: "Rs.2,999.00",
        comparePrice: "Rs.3,599.00",
        saveBadge: "Save 16%",
        image: "https://www.woodyhome.shop/cdn/shop/files/cozy_bedroom_clock.webp?v=1786437341&width=400",
        href: "/products/handmade-wooden-table-clock-rustic-vintage-bicycle-handlebar-design-⏰",
        vendor: "Woody Home",
        rating: 4.0,
        reviewCount: 205,
      },
      {
        title: "Personalized Wooden LOVE Wall Clock with Custom Name",
        price: "Rs.2,499.00",
        comparePrice: "Rs.3,299.00",
        saveBadge: "Save 24%",
        image: "https://www.woodyhome.shop/cdn/shop/files/love_wall_clock.webp?v=1786012137&width=400",
        href: "/products/personalized-wooden-love-wall-clock-with-custom-name",
        vendor: "Woody Home",
        rating: 3.5,
        reviewCount: 336,
      },
      {
        title: "Handcrafted Wooden HOME Wall Clock",
        price: "Rs.2,500.00",
        comparePrice: "Rs.3,499.00",
        saveBadge: "Save 28%",
        image: "https://www.woodyhome.shop/cdn/shop/files/playroom_clock_scene.webp?v=1786441485&width=400",
        href: "/products/handcrafted-wooden-home-wall-clock",
        vendor: "Woody Home",
        rating: 3.5,
        reviewCount: 309,
      },
    ],
  },

  // ── 2. Fighter Jet Model ──
  "handmade-wooden-fighter-jet-model-premium-aircraft-desk-decor": {
    slug: "handmade-wooden-fighter-jet-model-premium-aircraft-desk-decor",
    title: "Handmade Wooden Fighter Jet Model | Premium Aircraft Desk Decor",
    vendor: "Woody Home",
    price: "Rs. 2499.00",
    priceRaw: 249900,
    comparePrice: "Rs.3,499.00",
    compareRaw: 349900,
    savePercent: 28,
    rating: 4.5,
    reviewCount: 248,
    category: "Air Crafts",
    categorySlug: "air-crafts",
    tags: "fighter jet, wooden airplane, aircraft model, office desk decor, pilot gift, aviation collectibles, handmade sheesham jet",
    sku: "GW-JET-002",
    inStock: true,
    colors: ["Natural Sheesham", "Dark Walnut", "Glossy Polished Teak"],
    images: [
      "https://www.woodyhome.shop/cdn/shop/files/wooden_fighter_jet_office.webp?v=1786446438&width=900",
      "https://www.woodyhome.shop/cdn/shop/collections/wooden_jet_isometric.webp?v=1786184138&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/cozy_bedroom_dressing_table.webp?v=1786270265&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/sheesham_animal_lamps_group.webp?v=1786179482&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/wooden_candelabra_marble_table_1_222483ba-7b0d-411a-b718-15a47458d97f.webp?v=1786533730&width=900",
    ],
    description: {
      heading: "✈️ Precision Handcrafted Fighter Jet Model",
      intro: [
        "Take pride in handcrafted excellence with this sleek, dynamic Fighter Jet model carved from authentic Pakistani Sheesham wood.",
        "Featuring realistic aerodynamic contours, detailed wing-mounted ordnances, and a display base, it commands attention on any executive table or bookshelf.",
      ],
      customizationNote:
        "✨ Add custom squad markings, name engraving, or callsign text on the wings or base!",
      whatsappNote:
        "📲 Order and message your squadron name or callsign to receive a custom engraved showpiece.",
      highlights: [
        "✈️ Aerodynamic Silhouette with fine wing details",
        "🪵 100% Solid Sheesham Wood with rich natural grain",
        "✨ Hand-polished organic lacquer finish",
        "🎁 Ideal gift for pilots, aviation enthusiasts & armed forces personnel",
      ],
      specifications: [
        { label: "Material", value: "Solid Sheesham Wood", icon: "🪵" },
        { label: "Finish", value: "Glossy Protective Lacquer", icon: "🎨" },
        { label: "Dimensions", value: "28cm Length × 20cm Wingspan", icon: "📏" },
        { label: "Base", value: "Included Wooden Stand", icon: "✈️" },
        { label: "Handmade", value: "Yes", icon: "✋" },
      ],
      bestFor: [
        "💼 Executive Office Desks",
        "🎖️ Air Force & Pilot Memorials",
        "📚 Study Desks & Bookcases",
        "🎁 Birthday & Farewell Gifts",
      ],
      packageIncludes: [
        "1 × Wooden Fighter Jet Replica",
        "1 × Hand-carved Wooden Display Stand",
      ],
    },
    shippingReturns: {
      standard: "3–5 business days nationwide",
      express: "1–2 business days",
      freeShipping: "On orders above Rs. 1,000",
      returns: "Easy 7-day hassle-free returns in original condition",
    },
    sizeGuide: "Length: 28cm, Wingspan: 20cm, Height on stand: 14cm.",
    recommendations: [
      {
        title: "Wooden Apple Desk Clock with Pen Holder | Handmade Office Organizer & Custom Gift",
        price: "Rs.2,599.00",
        comparePrice: "Rs.2,999.00",
        saveBadge: "Save 13%",
        image: "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=400",
        href: "/products/wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
        vendor: "Woody Home",
        rating: 3.0,
        reviewCount: 261,
      },
      {
        title: "Handcrafted Wooden Deer Sculpture",
        price: "Rs.2,599.00",
        comparePrice: "Rs.3,299.00",
        saveBadge: "Save 21%",
        image: "https://www.woodyhome.shop/cdn/shop/files/walnut_deer_shelf.webp?v=1786270082&width=400",
        href: "/products/handcrafted-wooden-deer-sculpture",
        vendor: "Woody Home",
        rating: 5.0,
        reviewCount: 250,
      },
      {
        title: "Hexagon Wooden Table Lamp | Handmade Decorative Light",
        price: "Rs.2,400.00",
        comparePrice: "Rs.2,900.00",
        saveBadge: "Save 17%",
        image: "https://www.woodyhome.shop/cdn/shop/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083&width=400",
        href: "/products/hexagon-wooden-table-lamp",
        vendor: "Woody Home",
        rating: 5.0,
        reviewCount: 215,
      },
      {
        title: "Handmade Sheesham Wood Pen Holder – Feather & Guitar",
        price: "Rs.899.00",
        comparePrice: "Rs.2,199.00",
        saveBadge: "Save 59%",
        image: "https://www.woodyhome.shop/cdn/shop/files/sheesham_feather_pen_holder_9.webp?v=1786435229&width=400",
        href: "/products/handmade-sheesham-wood-pen-holder-feather-guitar",
        vendor: "Woody Home",
        rating: 5.0,
        reviewCount: 313,
      },
    ],
  },

  // ── 3. Wooden Bunny Tissue Box ──
  "%F0%9F%90%B0-handmade-wooden-bunny-tissue-box": {
    slug: "%F0%9F%90%B0-handmade-wooden-bunny-tissue-box",
    title: "🐰 Handmade Wooden Bunny Tissue Box",
    vendor: "Woody Home",
    price: "Rs. 2199.00",
    priceRaw: 219900,
    comparePrice: "Rs.2,899.00",
    compareRaw: 289900,
    savePercent: 24,
    rating: 5.0,
    reviewCount: 295,
    category: "Tissue Box",
    categorySlug: "tissue-box",
    tags: "bunny tissue box, cute wooden decor, handmade tissue holder, nursery decor, animal tissue organizer",
    sku: "GW-TB-003",
    inStock: true,
    colors: ["Natural Walnut", "Honey Wood Finish", "Dark Rosewood"],
    images: [
      "https://www.woodyhome.shop/cdn/shop/files/wooden_bunny_tissue_box_3_1.webp?v=1786448138&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/cozy_bedroom_nightstand_2.webp?v=1786448138&width=900",
      "https://www.woodyhome.shop/cdn/shop/collections/wooden_tissue_box_office.webp?v=1786184483&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/walnut_deer_shelf.webp?v=1786270082&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/outdoor_garden_tea.webp?v=1786179070&width=900",
    ],
    description: {
      heading: "🐰 Add Charm to Your Daily Living",
      intro: [
        "Delightful and functional, this bunny-themed wooden tissue box brings warmth and character to living rooms, vanity tables, and baby nurseries.",
        "Smoothly hand-crafted from seasoned wood with rounded ergonomic corners and a seamless slide-out bottom for instant refills.",
      ],
      customizationNote:
        "✨ Optional custom laser name engraving available on the front panel!",
      whatsappNote:
        "📲 Send your family name or message on WhatsApp to personalize your bunny box.",
      highlights: [
        "🐰 Playful bunny silhouette with hand-carved ears",
        "🧻 Fits standard rectangular pop-up tissue packs",
        "🧲 Magnetic slide-out base for effortless replacement",
        "🪵 Child-safe organic wax and satin finish",
      ],
      specifications: [
        { label: "Material", value: "Seasoned Solid Hardwood", icon: "🪵" },
        { label: "Capacity", value: "Standard 150-200 Sheet Tissue Pack", icon: "🧻" },
        { label: "Finish", value: "Non-Toxic Satin Polish", icon: "🎨" },
        { label: "Bottom", value: "Easy-Slide Loading Panel", icon: "🧲" },
      ],
      bestFor: [
        "🛋️ Living Room Coffee Tables",
        "🛏️ Kids Bedrooms & Nurseries",
        "💄 Vanity & Dressing Tables",
        "🎁 Housewarming & Birthday Gifts",
      ],
      packageIncludes: ["1 × Handmade Wooden Bunny Tissue Box Holder"],
    },
    shippingReturns: {
      standard: "3–5 business days nationwide",
      express: "1–2 business days",
      freeShipping: "On orders above Rs. 1,000",
      returns: "Easy 7-day hassle-free returns in original condition",
    },
    sizeGuide: "Dimensions: 24cm × 13cm × 11cm. Compatible with standard tissue brands.",
    recommendations: [
      {
        title: "Handcrafted Wooden Bangle & Jewelry Organizer",
        price: "Rs.2,500.00",
        comparePrice: "Rs.2,999.00",
        saveBadge: "Save 16%",
        image: "https://www.woodyhome.shop/cdn/shop/files/cozy_bedroom_dressing_table.webp?v=1786270265&width=400",
        href: "/products/handcrafted-wooden-bangle-jewelry-organizer",
        vendor: "Woody Home",
        rating: 3.5,
        reviewCount: 240,
      },
      {
        title: "Wooden Swan LED Night Lamp",
        price: "Rs.2,899.00",
        comparePrice: "Rs.3,499.00",
        saveBadge: "Save 17%",
        image: "https://www.woodyhome.shop/cdn/shop/files/cozy_duck_lamp_3.webp?v=1786269158&width=400",
        href: "/products/wooden-swan-led-night-lamp",
        vendor: "Woody Home",
        rating: 4.0,
        reviewCount: 330,
      },
      {
        title: "Wooden Apple Desk Clock with Pen Holder | Handmade Office Organizer & Custom Gift",
        price: "Rs.2,599.00",
        comparePrice: "Rs.2,999.00",
        saveBadge: "Save 13%",
        image: "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=400",
        href: "/products/wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
        vendor: "Woody Home",
        rating: 3.0,
        reviewCount: 261,
      },
      {
        title: "Sheesham Wood Coaster Set with Holder – Natural Wooden Drink Coasters",
        price: "Rs.1,899.00",
        comparePrice: "Rs.2,499.00",
        saveBadge: "Save 24%",
        image: "https://www.woodyhome.shop/cdn/shop/files/outdoor_garden_tea.webp?v=1786179070&width=400",
        href: "/products/sheesham-wood-coaster-set-with-holder-natural-wooden-drink-coasters",
        vendor: "Woody Home",
        rating: 3.5,
        reviewCount: 231,
      },
    ],
  },

  // ── 4. Custom Name Wooden LED Lamp ──
  "custom-name-wooden-led-lamp": {
    slug: "custom-name-wooden-led-lamp",
    title: "Custom Name Wooden LED Lamp",
    vendor: "Woody Home",
    price: "Rs. 2599.00",
    priceRaw: 259900,
    comparePrice: "Rs.3,400.00",
    compareRaw: 340000,
    savePercent: 23,
    rating: 3.5,
    reviewCount: 305,
    category: "Lamps",
    categorySlug: "lamps",
    tags: "custom name lamp, led night lamp, personalized gift, anniversary gift, wedding gift, carved wooden lamp",
    sku: "GW-LED-004",
    inStock: true,
    colors: ["Warm White Light", "Golden Glow", "Natural Sheesham Base"],
    images: [
      "https://www.woodyhome.shop/cdn/shop/files/WhatsAppImage2026-09-06at4.24.36PM.jpg?v=1788694196&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/cozy_duck_lamp_3.webp?v=1786269158&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083&width=900",
      "https://www.woodyhome.shop/cdn/shop/collections/wooden_robot_lamp.webp?v=1786184416&width=900",
      "https://www.woodyhome.shop/cdn/shop/files/sheesham_animal_lamps_group.webp?v=1786179482&width=900",
    ],
    description: {
      heading: "💡 Personalized Name Illuminating Wooden Lamp",
      intro: [
        "A breathtaking combination of calligraphy and warm ambient lighting. Your custom name is precision cut and mounted in a circular solid wood halo with soft, glare-free LED backlighting.",
        "Perfect bedside companion and a deeply sentimental gift for weddings, birthdays, and anniversaries.",
      ],
      customizationNote:
        "✨ Available in English, Urdu or Arabic calligraphy! Engraved with pristine detail.",
      whatsappNote:
        "📲 WhatsApp us your desired name and calligraphy language right after placing the order.",
      highlights: [
        "💡 Circular halo warm ambient LED glow",
        "✍️ Custom English or Urdu/Arabic calligraphy",
        "🪵 Solid Sheesham wooden base with smooth finish",
        "🔌 Energy-efficient USB power cord with switch",
      ],
      specifications: [
        { label: "Material", value: "Pakistani Sheesham Wood & Acrylic", icon: "🪵" },
        { label: "Lighting", value: "Warm White LED 3000K", icon: "💡" },
        { label: "Power", value: "USB 5V Powered", icon: "🔌" },
        { label: "Customizable", value: "100% Custom Names", icon: "✨" },
      ],
      bestFor: [
        "💑 Wedding & Anniversary Gifts",
        "🎂 Birthday Milestones",
        "🛏️ Bedside Ambient Lamp",
        "💼 Executive Desk Centerpiece",
      ],
      packageIncludes: [
        "1 × Custom Name Circular Lamp with Base",
        "1 × USB Power Cable with Toggle Switch",
      ],
    },
    shippingReturns: {
      standard: "3–5 business days nationwide",
      express: "1–2 business days",
      freeShipping: "On orders above Rs. 1,000",
      returns: "Custom pieces guaranteed against transit damage",
    },
    sizeGuide: "Diameter: 22cm, Base: 16cm × 6cm. Cable length: 1.2 meters.",
    recommendations: [
      {
        title: "Wooden Swan LED Night Lamp",
        price: "Rs.2,899.00",
        comparePrice: "Rs.3,499.00",
        saveBadge: "Save 17%",
        image: "https://www.woodyhome.shop/cdn/shop/files/cozy_duck_lamp_3.webp?v=1786269158&width=400",
        href: "/products/wooden-swan-led-night-lamp",
        vendor: "Woody Home",
        rating: 4.0,
        reviewCount: 330,
      },
      {
        title: "Hexagon Wooden Table Lamp | Handmade Decorative Light",
        price: "Rs.2,400.00",
        comparePrice: "Rs.2,900.00",
        saveBadge: "Save 17%",
        image: "https://www.woodyhome.shop/cdn/shop/files/WhatsAppImage2026-09-06at8.50.43PM.jpg?v=1788932083&width=400",
        href: "/products/hexagon-wooden-table-lamp",
        vendor: "Woody Home",
        rating: 5.0,
        reviewCount: 215,
      },
      {
        title: "Handcrafted Wooden Deer Sculpture",
        price: "Rs.2,599.00",
        comparePrice: "Rs.3,299.00",
        saveBadge: "Save 21%",
        image: "https://www.woodyhome.shop/cdn/shop/files/walnut_deer_shelf.webp?v=1786270082&width=400",
        href: "/products/handcrafted-wooden-deer-sculpture",
        vendor: "Woody Home",
        rating: 5.0,
        reviewCount: 250,
      },
      {
        title: "Wooden Apple Desk Clock with Pen Holder | Handmade Office Organizer & Custom Gift",
        price: "Rs.2,599.00",
        comparePrice: "Rs.2,999.00",
        saveBadge: "Save 13%",
        image: "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=400",
        href: "/products/wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
        vendor: "Woody Home",
        rating: 3.0,
        reviewCount: 261,
      },
    ],
  },
};

// Also register decoded alias for bunny
staticProducts["🐰-handmade-wooden-bunny-tissue-box"] =
  staticProducts["%F0%9F%90%B0-handmade-wooden-bunny-tissue-box"];

// ── Generic Rich Builder for other products from all-products-data.json ──
import allProductsData from "@/app/_shared/all-products-data.json";

export function getProductBySlug(rawSlug: string): ProductItemData {
  const decoded = decodeURIComponent(rawSlug);
  if (staticProducts[decoded]) return staticProducts[decoded];
  if (staticProducts[rawSlug]) return staticProducts[rawSlug];

  // Look up in all-products-data.json
  const match = (allProductsData as any[]).find(
    (p) =>
      p.link.includes(rawSlug) ||
      p.link.includes(decoded) ||
      decodeURIComponent(p.link).includes(decoded)
  );

  const title = match
    ? match.title
    : decoded.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const image = match && match.image
    ? (match.image.startsWith("//") ? `https:${match.image}` : match.image).replace("width=500", "width=900")
    : "https://www.woodyhome.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=900";

  const price = match && match.price ? match.price : "Rs. 2,499.00";
  const comparePrice = match && match.comparePrice ? match.comparePrice : "Rs. 3,299.00";
  const savePercent = match && match.saveBadge
    ? parseInt(match.saveBadge.replace(/[^0-9]/g, "")) || 20
    : 20;

  const rating = match && match.stars ? (match.stars.match(/★/g) || []).length || 4 : 4.5;
  const reviewCount = match && match.ratingCount
    ? parseInt(match.ratingCount.replace(/[^0-9]/g, "")) || 215
    : 215;

  // Build full lifestyle gallery
  const galleryImages = [
    image,
    "https://www.woodyhome.shop/cdn/shop/files/garden_clock_lifestyle_24a5d9bd-f73b-4046-85be-ce4eaa81dd6b.webp?v=1786443489&width=900",
    "https://www.woodyhome.shop/cdn/shop/files/cozy_bedside_clock.webp?v=1786443488&width=900",
    "https://www.woodyhome.shop/cdn/shop/files/walnut_deer_shelf.webp?v=1786270082&width=900",
    "https://www.woodyhome.shop/cdn/shop/files/sheesham_animal_lamps_group.webp?v=1786179482&width=900",
    "https://www.woodyhome.shop/cdn/shop/files/hotel_reception_clock.webp?v=1786443488&width=900",
    "https://www.woodyhome.shop/cdn/shop/files/outdoor_garden_tea.webp?v=1786179070&width=900",
  ];

  return {
    slug: rawSlug,
    title,
    vendor: "Woody Home",
    price,
    priceRaw: parseInt(price.replace(/[^0-9]/g, "")) || 249900,
    comparePrice,
    compareRaw: parseInt(comparePrice.replace(/[^0-9]/g, "")) || 329900,
    savePercent,
    rating,
    reviewCount,
    category: "Decor & Crafts",
    categorySlug: "collections",
    tags: "woodyhome, handmade wooden decor, authentic sheesham, chiniot craft, luxury home gift, wooden masterpiece",
    sku: `GW-${rawSlug.slice(0, 5).toUpperCase()}-001`,
    inStock: true,
    colors: ["Natural Sheesham", "Walnut Polish", "Vintage Teak Finish"],
    images: galleryImages,
    description: {
      heading: `✨ Masterpiece: ${title}`,
      intro: [
        `Elevate your home and workspace with this authentically handcrafted ${title}, sculpted by master Chiniot woodcarvers.`,
        "Handmade using 100% authentic seasoned Pakistani Sheesham wood, cured to withstand humidity and age with a timeless vintage luster.",
        "A statement piece celebrating generational heritage, sustainable artisanal craftsmanship, and aesthetic luxury.",
      ],
      customizationNote:
        "✨ Customization Available! We can engrave personal names, memorable dates, logos, or personalized wishes.",
      whatsappNote:
        "📲 Simply place your order and WhatsApp our team with your customization instructions.",
      highlights: [
        "🪵 100% Solid Sheesham / Walnut Wood Construction",
        "✨ Hand-Polished High-Gloss Protective Artisanal Lacquer",
        "🎨 Generational Craftsmanship from Chiniot, Pakistan",
        "🎁 Luxury Gifting Ready with Premium Packaging",
        "📦 Easy Nationwide Delivery & Safe Transit Packing",
      ],
      specifications: [
        { label: "Material", value: "Pure Seasoned Sheesham Wood", icon: "🪵" },
        { label: "Finish", value: "Hand-Buffed Natural Gloss", icon: "🎨" },
        { label: "Handmade", value: "100% Handcrafted", icon: "✋" },
        { label: "Customizable", value: "Yes (Laser Engraving)", icon: "✨" },
        { label: "Origin", value: "Chiniot, Punjab, Pakistan", icon: "📍" },
      ],
      bestFor: [
        "🛋️ Living Room Accent Decor",
        "💼 Executive Office Desks",
        "🎁 Corporate & VIP Gifts",
        "🎂 Birthday & Anniversary Keepsakes",
      ],
      packageIncludes: [
        `1 × Handcrafted ${title}`,
        "1 × Authenticity & Care Card",
      ],
      note: "(Background props in lifestyle photos are for presentation only.)",
    },
    shippingReturns: {
      standard: "3–5 business days nationwide",
      express: "1–2 business days",
      freeShipping: "On orders above Rs. 1,000",
      returns: "Easy 7-day hassle-free returns in original condition",
    },
    sizeGuide: "Standard dimensions crafted for balanced display on tables, desks, and consoles.",
    recommendations: [
      {
        title: "Wooden Apple Desk Clock with Pen Holder | Handmade Office Organizer & Custom Gift",
        price: "Rs.2,599.00",
        comparePrice: "Rs.2,999.00",
        saveBadge: "Save 13%",
        image: "https://www.glossywoods.shop/cdn/shop/files/wooden_apple_desk_clock.webp?v=1786018606&width=400",
        href: "/products/wooden-apple-desk-clock-with-pen-holder-handmade-office-organizer-custom-gift",
        vendor: "Woody Home",
        rating: 3.0,
        reviewCount: 261,
      },
      {
        title: "Handmade Wooden Fighter Jet Model | Premium Aircraft Desk Decor",
        price: "Rs.2,499.00",
        comparePrice: "Rs.3,499.00",
        saveBadge: "Save 28%",
        image: "https://www.glossywoods.shop/cdn/shop/files/wooden_fighter_jet_office.webp?v=1786446438&width=400",
        href: "/products/handmade-wooden-fighter-jet-model-premium-aircraft-desk-decor",
        vendor: "Woody Home",
        rating: 4.5,
        reviewCount: 248,
      },
      {
        title: "Handcrafted Wooden Deer Sculpture",
        price: "Rs.2,599.00",
        comparePrice: "Rs.3,299.00",
        saveBadge: "Save 21%",
        image: "https://www.glossywoods.shop/cdn/shop/files/walnut_deer_shelf.webp?v=1786270082&width=400",
        href: "/products/handcrafted-wooden-deer-sculpture",
        vendor: "Woody Home",
        rating: 5.0,
        reviewCount: 250,
      },
      {
        title: "Custom Name Wooden LED Lamp",
        price: "Rs.2,599.00",
        comparePrice: "Rs.3,400.00",
        saveBadge: "Save 23%",
        image: "https://www.glossywoods.shop/cdn/shop/files/WhatsAppImage2026-09-06at4.24.36PM.jpg?v=1788694196&width=400",
        href: "/products/custom-name-wooden-led-lamp",
        vendor: "Woody Home",
        rating: 3.5,
        reviewCount: 305,
      },
    ],
  };
}

export function generateProductMetadata(product: ProductItemData): Metadata {
  return {
    title: `${product.title} — Woody Home`,
    description: product.description.intro[0] || `${product.title} handcrafted from pure Pakistani Sheesham wood.`,
    openGraph: {
      title: product.title,
      description: product.description.intro[0],
      images: [{ url: product.images[0] }],
    },
  };
}
