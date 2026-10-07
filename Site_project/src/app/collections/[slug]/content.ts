import type { Metadata } from "next";
import { collectionsContent } from "@/app/collections/content";

export const collectionSlugs = [
  "tissue-box",
  "air-crafts",
  "cars",
  "clocks",
  "hand-sticks",
  "vehicals",
  "lamps",
  "home-decor",
];

export function getCollectionBySlug(slug: string) {
  const collection = collectionsContent.items.find(
    (item) => item.href === `/collections/${slug}` || item.href.endsWith(`/${slug}`)
  );
  if (!collection) return null;

  return {
    ...collection,
    slug,
    description: `Discover our exclusive collection of handcrafted wooden ${collection.title.toLowerCase()}, sculpted by master artisans from premium Chiniot Sheesham wood.`,
    seo: {
      title: `${collection.title} Collection — Woody Home`,
      description: `Shop handcrafted wooden ${collection.title.toLowerCase()} at Woody Home. Premium sheesham wood, hand-carved in Chiniot with free delivery on qualifying orders.`,
    } as Metadata,
  };
}
