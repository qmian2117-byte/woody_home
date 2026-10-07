import type { Metadata } from "next";
import { salesContent } from "@/app/sales/content";
import { SalesPage } from "@/page/sales";

export const metadata: Metadata = salesContent.seo;

export default function Page() {
  return <SalesPage />;
}
