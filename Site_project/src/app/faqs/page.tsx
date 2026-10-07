import type { Metadata } from "next";
import { faqsContent } from "@/app/faqs/content";
import { FaqsPage } from "@/page/faqs";

export const metadata: Metadata = faqsContent.seo;

export default function Page() {
  return <FaqsPage />;
}
