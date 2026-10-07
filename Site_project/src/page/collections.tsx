"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { collectionsContent } from "@/app/collections/content";
import type { CollectionItem } from "@/app/collections/content";
import { collectionsStyles } from "@/app/collections/style";
import "@/app/collections/collections.css";

export function CollectionsPage({ liveCollections }: { liveCollections?: any[] }) {
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const items: CollectionItem[] = liveCollections && liveCollections.length > 0
    ? liveCollections.map(c => ({
        title: c.name,
        count: `${c.products_count || 0} Products`,
        image: c.image_url || collectionsContent.items[0].image,
        href: `/sales?category=${c.slug}`,
        width: 700,
        height: 700,
        delay: 0
      }))
    : collectionsContent.items;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                (entry.target as HTMLElement).classList.add("tm-lc-in-view");
              }, i * 90);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(card);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <div className={collectionsStyles.section}>
      <div className={collectionsStyles.header}>
        <span className={collectionsStyles.eyebrow}>
          {collectionsContent.header.eyebrow}
        </span>
        <h1 className={collectionsStyles.heading}>
          {collectionsContent.header.heading}
        </h1>
      </div>

      <div className={collectionsStyles.grid}>
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={collectionsStyles.card}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-delay={i * 90}
          >

            <div className={collectionsStyles.imgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                srcSet={`${item.image.replace("width=700", "width=350")} 350w, ${item.image.replace("width=700", "width=500")} 500w, ${item.image} 700w`}
                width={item.width || 700}
                height={item.height || 700}
                loading="lazy"
                className={collectionsStyles.imgMain}
                sizes="(max-width: 700px) 50vw, 25vw"
              />
            </div>
            <div className={collectionsStyles.info}>
              <h3 className={collectionsStyles.title}>{item.title}</h3>
              <p className={collectionsStyles.count}>{item.count}</p>
              <span className={collectionsStyles.btn}>Shop Collection</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

