import type { Metadata } from "next";

export interface FaqCategory {
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
}

export const faqsContent = {
  seo: {
    title: "Frequently Asked Questions — Woody Home",
    description:
      "Find answers to common questions about handcrafted sheesham wood products, ordering, shipping across Pakistan, custom designs, and wood care.",
  } as Metadata,

  header: {
    badge: "Help & Knowledge Base",
    title: "Frequently Asked Questions",
    description:
      "Everything you need to know about our handcrafted sheesham wood collections, ordering process, safe packaging, and proper care.",
  },

  categories: [
    {
      title: "Orders & Shipping",
      items: [
        {
          question: "How long does delivery take across Pakistan?",
          answer:
            "Standard delivery takes 3 to 5 business days across Pakistan via courier services. For major cities (Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad), deliveries often arrive within 2 to 3 days.",
        },
        {
          question: "What is the shipping cost?",
          answer:
            "We offer FREE delivery nationwide on all orders above PKR 5,000. For orders under PKR 5,000, a flat nominal delivery fee of PKR 250 applies.",
        },
        {
          question: "Is Cash on Delivery (COD) available?",
          answer:
            "Yes! Cash on Delivery is available all across Pakistan. You can pay conveniently when you receive and inspect your parcel.",
        },
        {
          question: "How do you package fragile wooden items?",
          answer:
            "Every product is wrapped in multi-layered shock-absorbing bubble wrap, protected by corrugated foam, and sealed in heavy-duty cardboard boxes to ensure 100% damage-free delivery.",
        },
      ],
    },
    {
      title: "Wood & Craftsmanship",
      items: [
        {
          question: "What type of wood do you use?",
          answer:
            "We exclusively use 100% genuine Pakistani Sheesham (Dalbergia sissoo / Rosewood) sourced sustainably from Chiniot. It is world-renowned for its rich grain, heavy density, and natural durability.",
        },
        {
          question: "Are these items machine-made or handmade?",
          answer:
            "Every single item is hand-carved, sanded, assembled, and finished by master artisans in Chiniot with generations of woodcrafting heritage.",
        },
        {
          question: "Will the wood crack or warp over time?",
          answer:
            "All our wood undergoes a thorough kiln-drying and seasoning process before carving to stabilize moisture levels, ensuring your collectible resists warping and lasts for decades.",
        },
      ],
    },
    {
      title: "Custom Orders & Personalization",
      items: [
        {
          question: "Can I request custom engravings or personalized text?",
          answer:
            "Yes! We offer custom name carving, personalized dates, and corporate branding on select items like clocks, tissue boxes, and desk sets. Contact us via WhatsApp (+92 332 6457322) to arrange your custom piece.",
        },
        {
          question: "Do you make bespoke custom designs?",
          answer:
            "Yes, our master craftsmen can create bespoke wooden sculptures, commemorative trophies, and executive desk decor based on your reference pictures or sketches.",
        },
      ],
    },
    {
      title: "Wood Care & Maintenance",
      items: [
        {
          question: "How should I clean my wooden decor pieces?",
          answer:
            "Gently wipe with a soft, dry microfibre cloth. For periodic deep nourishment, apply a few drops of natural beeswax polish or mineral oil every 4-6 months to maintain its lustrous sheen.",
        },
        {
          question: "Can I use water or household chemical cleaners?",
          answer:
            "No. Never use water, harsh chemical detergents, or aerosol spray polishes on raw or lacquer-finished sheesham wood, as they can strip the natural protective oils.",
        },
      ],
    },
  ] as FaqCategory[],

  contactBanner: {
    title: "Still have questions?",
    description: "Our customer support team is available Mon - Sat from 10:00 AM to 8:00 PM to help you with any inquiries.",
    phone: "+92 332 6457322",
    whatsappUrl: "https://wa.me/923326457322",
  },
};
