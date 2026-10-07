import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { siteContent } from "@/app/site-content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.woodyhome.shop"),
  title: {
    default: `${siteContent.siteName} — ${siteContent.tagline}`,
    template: `%s | ${siteContent.siteName}`,
  },
  description: siteContent.description,
  keywords: [
    "Handcrafted Wooden Decor",
    "Sheesham Wood Products",
    "Wooden Desk Accessories",
    "Handmade Wood Gifts",
    "Wooden Animal Lamps",
    "Premium Wood Crafts",
    "Woody Home",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteContent.siteName,
    title: `${siteContent.siteName} — ${siteContent.tagline}`,
    description: siteContent.description,
  },
};

import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#C9A84C] selection:text-[#111]">
        <CartProvider>
          <Nav site={siteContent} />
          <main className="flex-1">{children}</main>
          <Footer site={siteContent} />
          <CartDrawer />
          <ScrollToTop />
          <WhatsAppFloat phone={siteContent.whatsapp} />
        </CartProvider>
      </body>
    </html>
  );
}

