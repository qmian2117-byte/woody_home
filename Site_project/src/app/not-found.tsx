import type { Metadata } from "next";
import { notFoundPage } from "@/app/not-found/content";
import { NotFoundPage } from "@/page/not-found";

export const metadata: Metadata = notFoundPage.seo;

export default function NotFound() {
  return <NotFoundPage />;
}
