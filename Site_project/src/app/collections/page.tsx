import type { Metadata } from "next";
import { collectionsContent } from "@/app/collections/content";
import { CollectionsPage } from "@/page/collections";
import { fetchCollections } from "@/lib/api";

export const metadata: Metadata = collectionsContent.seo;
export const dynamic = "force-dynamic";

export default async function Page() {
  const liveCollections = await fetchCollections();
  return <CollectionsPage liveCollections={liveCollections} />;
}
