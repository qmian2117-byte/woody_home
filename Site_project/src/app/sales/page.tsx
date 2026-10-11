import type { Metadata } from "next";
import { salesContent } from "@/app/sales/content";
import { SalesPage } from "@/page/sales";
import { fetchProducts } from "@/lib/api";

export const metadata: Metadata = salesContent.seo;
export const dynamic = "force-dynamic";

export default async function Page() {
  const liveProducts = await fetchProducts({ limit: 50 });
  return <SalesPage liveProducts={liveProducts} />;
}
