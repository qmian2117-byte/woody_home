export interface NavItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface SiteContent {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsapp: string;
  address: {
    city: string;
    country: string;
    full: string;
  };
  hours: string;
  topBar: {
    promoText: string;
    badge: string;
  };
  navLinks: NavItem[];
  cta: {
    label: string;
    href: string;
    subtext: string;
  };
  footer: {
    aboutSnippet: string;
    quickLinks: { label: string; href: string }[];
    collectionsLinks: { label: string; href: string }[];
    badges: string[];
    copyright: string;
  };
}

export const siteContent: SiteContent = {
  siteName: "Woody Home",
  tagline: "Handcrafted Wooden Masterpieces",
  description:
    "Premium handcrafted sheesham wood home decor, desk accessories, animal lamps, and bespoke wooden gifts. Each piece tells a story of artisanship.",
  phone: "+92 332 6457322",
  phoneRaw: "923326457322",
  email: "support@woodyhome.shop",
  whatsapp: "923326457322",
  address: {
    city: "Chiniot",
    country: "Pakistan",
    full: "Chiniot, Punjab, Pakistan",
  },
  hours: "Mon – Sat: 10:00 AM – 8:00 PM",
  topBar: {
    promoText: "Free Worldwide Shipping on Orders Above PKR 5,000",
    badge: "Handcrafted with Love",
  },
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Contact", href: "/contact" },
    { label: "Sales", href: "/sales" },
  ],
  cta: {
    label: "Shop Now",
    href: "/sales",
    subtext: "Free shipping • Handmade quality",
  },
  footer: {
    aboutSnippet:
      "Woody Home creates museum-quality handcrafted wooden decor, desk accessories, and bespoke gifts from premium sheesham wood. Each piece is carved with generations of Chiniot craftsmanship.",
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      { label: "Sales", href: "/sales" },
      { label: "Faqs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
    ],
    collectionsLinks: [
      { label: "Tissue Box", href: "/collections/tissue-box" },
      { label: "Air Crafts", href: "/collections/air-crafts" },
      { label: "Cars", href: "/collections/cars" },
      { label: "Clocks", href: "/collections/clocks" },
      { label: "Hand Sticks", href: "/collections/hand-sticks" },
      { label: "Vehicles", href: "/collections/vehicals" },
      { label: "Lamps", href: "/collections/lamps" },
      { label: "Home Decor", href: "/collections/home-decor" },
    ],
    badges: [
      "100% Handcrafted",
      "Premium Sheesham Wood",
      "Worldwide Shipping",
      "Custom Orders Welcome",
    ],
    copyright: `© ${new Date().getFullYear()} Woody Home. All rights reserved. Handcrafted in Chiniot, Pakistan.`,
  },
};
