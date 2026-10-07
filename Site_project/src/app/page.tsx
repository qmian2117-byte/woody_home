import type { Metadata } from "next";
import { homeContent } from "@/app/_home/content";
import { HomePage } from "@/page/home";
import { fetchProducts, fetchCollections } from "@/lib/api";

export const metadata: Metadata = homeContent.seo;
export const dynamic = "force-dynamic";

export default async function Page() {
  const [products, collections] = await Promise.all([
    fetchProducts({ limit: 12 }),
    fetchCollections()
  ]);

  return <HomePage liveProducts={products} liveCollections={collections} />;
}
