import type { Metadata } from "next";

export const notFoundPage = {
  seo: {
    title: "404 - Page Not Found | ApexGuard Security",
    description: "The requested security resource or page could not be located. Access our primary navigation channels or contact our Texas dispatch center.",
  } as Metadata,

  badge: "Security Alert 404",
  headline: "Access Perimeter Breach: Page Not Located",
  message: "The URL address you attempted to access does not exist on this server, may have been relocated, or is restricted under current firewall policies.",
  recoveryLinks: [
    { label: "Return to Homepage", href: "/", description: "Access main overview & package tiers" },
    { label: "View All Security Services", href: "/services", description: "Smart CCTV, alarms & monitoring" },
    { label: "Check Service Area Coverage", href: "/service-area", description: "Find certified technicians in your city" },
    { label: "Contact Dispatch & Support", href: "/contact", description: "24/7 Texas customer assistance" },
  ],
  support: {
    text: "Need urgent property protection or emergency alarm assistance?",
    phone: "(800) 555-APEX",
    phoneRaw: "8005552739",
  },
};
