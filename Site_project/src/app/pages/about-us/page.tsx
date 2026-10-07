import type { Metadata } from "next";
import { aboutContent } from "@/app/about/content";
import { AboutPage } from "@/page/about";

export const metadata: Metadata = aboutContent.seo;

export default function Page() {
  return <AboutPage />;
}
