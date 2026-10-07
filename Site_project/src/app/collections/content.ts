import type { Metadata } from "next";

export interface CollectionItem {
  title: string;
  count: string;
  image: string;
  href: string;
  width: number;
  height: number;
  delay: number;
}

export const collectionsContent = {
  seo: {
    title: "Collections – Woody Home",
    description:
      "Browse all handcrafted wooden collections at Woody Home — Tissue Box, Air Crafts, Cars, Clocks, Hand Sticks, Vehicles, Lamps, and Home Decor.",
  } as Metadata,

  header: {
    eyebrow: "BROWSE",
    heading: "Our Collections",
  },

  items: [
    {
      title: "Tissue Box",
      count: "4 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_tissue_box_office.webp?v=1786184483&width=700",
      href: "/collections/tissue-box",
      width: 700,
      height: 511,
      delay: 0,
    },
    {
      title: "Air  Crafts",
      count: "3 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_jet_isometric.webp?v=1786184138&width=700",
      href: "/collections/air-crafts",
      width: 700,
      height: 928,
      delay: 90,
    },
    {
      title: "Cars",
      count: "6 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_toy_truck_isometric.webp?v=1786183971&width=700",
      href: "/collections/cars",
      width: 700,
      height: 528,
      delay: 180,
    },
    {
      title: "Clocks",
      count: "5 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/love_wall_clock.webp?v=1786184224&width=700",
      href: "/collections/clocks",
      width: 700,
      height: 928,
      delay: 270,
    },
    {
      title: "Hand Sticks",
      count: "9 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/carved_walking_stick_1_467c9b5c-a9ee-4b92-a706-1887048796c7.webp?v=1786340831&width=700",
      href: "/collections/hand-sticks",
      width: 700,
      height: 700,
      delay: 360,
    },
    {
      title: "Vehicals",
      count: "13 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_semi_truck_1500x1500_1_1db7b3a7-1387-4485-92a5-527d27996112.png?v=1786442168&width=700",
      href: "/collections/vehicals",
      width: 700,
      height: 700,
      delay: 450,
    },
    {
      title: "Lamps",
      count: "7 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/wooden_robot_lamp.webp?v=1786184416&width=700",
      href: "/collections/lamps",
      width: 700,
      height: 544,
      delay: 540,
    },
    {
      title: "Home Decor",
      count: "19 Products",
      image:
        "https://www.glossywoods.shop/cdn/shop/collections/sheesham_tv_phone_holder_2.webp?v=1786191738&width=700",
      href: "/collections/home-decor",
      width: 700,
      height: 917,
      delay: 630,
    },
  ] as CollectionItem[],
};
