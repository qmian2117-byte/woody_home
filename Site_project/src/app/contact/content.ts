import type { Metadata } from "next";

export interface ContactChannel {
  title: string;
  detail: string;
  subtext: string;
  href: string;
  iconName: "Phone" | "Mail" | "MapPin" | "MessageCircle" | "Clock";
  highlight?: boolean;
}

export interface ContactFaq {
  question: string;
  answer: string;
}

export const contactContent = {
  seo: {
    title: "Contact Us — Woody Home | Handcrafted Wooden Masterpieces",
    description:
      "Get in touch with Woody Home artisans in Chiniot, Pakistan. Inquire about custom orders, personalized name lamps, bulk corporate gifting, or WhatsApp support.",
  } as Metadata,

  title: "Contact",

  channels: [
    {
      title: "WhatsApp Direct Chat",
      detail: "+92 332 6457322",
      subtext: "Instant reply for custom order quotes & photos",
      href: "https://wa.me/923326457322?text=Hi%20Woody%20Home!%20I%20have%20an%20inquiry.",
      iconName: "MessageCircle",
      highlight: true,
    },
    {
      title: "Direct Telephone",
      detail: "+92 332 6457322",
      subtext: "Mon – Sat: 10:00 AM – 8:00 PM PKT",
      href: "tel:+923326457322",
      iconName: "Phone",
    },
    {
      title: "Email Support",
      detail: "support@woodyhome.shop",
      subtext: "Quotes, corporate orders, and design sketches",
      href: "mailto:support@woodyhome.shop",
      iconName: "Mail",
    },
    {
      title: "Workshop & Studio",
      detail: "Chiniot, Punjab, Pakistan",
      subtext: "The historic capital of authentic sheesham woodcraft",
      href: "https://maps.google.com/?q=Chiniot,+Pakistan",
      iconName: "MapPin",
    },
    {
      title: "Workshop Hours",
      detail: "10:00 AM – 8:00 PM (PKT)",
      subtext: "Monday through Saturday (Sunday Closed)",
      href: "#",
      iconName: "Clock",
    },
  ] as ContactChannel[],

  form: {
    eyebrow: "Online Inquiry",
    title: "Send Us a Message",
    subtitle:
      "Fill out the form below and our team will get back to you within a few hours, or message us directly on WhatsApp.",
    fields: {
      fullName: "Your Name",
      phone: "Phone / WhatsApp Number",
      email: "Email Address",
      inquiryType: "Inquiry Type",
      inquiryTypes: [
        "Custom / Bespoke Woodcraft Order",
        "Personalized Name Lamp Inquiry",
        "Product Availability & Sizing",
        "Order Status & Shipping Info",
        "Corporate Gifting & Bulk Order",
        "Wholesale / Retail Partnership",
      ],
      message: "Your Message or Custom Request Details",
      placeholderMessage:
        "Describe what you have in mind (e.g., specific dimensions, Arabic/English name for lamps, reference sketches, preferred wood finish)...",
      submitButton: "Send Inquiry via Email",
      submitWhatsAppButton: "Send via WhatsApp",
    },
    privacyNotice:
      "We strictly respect your privacy. Your contact details are never shared or spammed.",
  },

  customBanner: {
    eyebrow: "Bespoke & Made to Order",
    title: "Dream It. We'll Carve It.",
    description:
      "Send us a sketch, photo, or calligraphy sample — our craftsmen will bring it to life in pure Sheesham wood, exactly as you imagined it.",
    buttonText: "Discuss Custom Order on WhatsApp",
    buttonHref:
      "https://wa.me/923326457322?text=Hi%20Woody%20Home!%20I%20want%20to%20discuss%20a%20custom%20order.",
  },

  faqs: [
    {
      question: "How do custom name lamps and bespoke orders work?",
      answer:
        "You send us your desired name (Arabic or English) or photo reference via WhatsApp or our form. We prepare a carving layout and design preview for your confirmation, then our master craftsmen hand-carve and polish it in authentic Chiniot Sheesham wood.",
    },
    {
      question: "What is the delivery time across Pakistan and internationally?",
      answer:
        "Standard in-stock pieces are dispatched immediately and delivered across Pakistan within 3 to 5 business days. Custom carved pieces take 6 to 9 days to handcraft, polish, and cure to perfection. Worldwide shipping is also available via DHL / FedEx.",
    },
    {
      question: "Is Cash on Delivery (COD) available?",
      answer:
        "Yes! Cash on Delivery is available across all major cities and towns in Pakistan. For personalized items (such as custom name lamps with your personal name), a small advance confirmation token is requested.",
    },
    {
      question: "What if my wooden product gets damaged during shipping?",
      answer:
        "Every single item is cushioned with multi-layer bubble wrap, edge guards, and reinforced corrugated boxing. In the rare event of transit damage, we offer a 100% Free Replacement under our 7-Day Hassle-Free Guarantee.",
    },
    {
      question: "Can I place bulk orders for corporate gifts or weddings?",
      answer:
        "Yes! We regularly craft custom engraved wooden corporate giveaways, executive desktop organizers, and wedding souvenirs with custom company branding or personalized wedding initials. Contact us for bulk tier pricing.",
    },
  ] as ContactFaq[],
};
