import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  collectionSlugs,
  getCollectionBySlug,
} from "@/app/collections/[slug]/content";
import { CollectionDetailPage } from "@/page/collection-detail";

export function generateStaticParams() {
  return collectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Collection Not Found — Woody Home",
    };
  }

  return collection.seo;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return <CollectionDetailPage collection={collection} />;
}
