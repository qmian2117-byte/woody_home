import type { Metadata } from "next";
import { contactContent } from "@/app/contact/content";
import { ContactPage } from "@/page/contact";

export const metadata: Metadata = contactContent.seo;

export default function Page() {
  return <ContactPage />;
}
