import { sharedStyles, buttonStyles, cardStyles } from "@/app/_shared/style";

export const salesStyles = {
  ...sharedStyles,
  buttons: buttonStyles,
  cards: cardStyles,

  hero: {
    section: "relative bg-[#f9f9f7] border-b border-[#e5e5e5] py-14 sm:py-20 overflow-hidden",
    container: "max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center",
    badge:
      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#8c6b1f] text-xs font-bold uppercase tracking-wider mb-4 border border-[#C9A84C]/30",
    title:
      "text-3xl sm:text-5xl lg:text-6xl font-black text-[#4E2B13] tracking-tight leading-tight mb-4 font-[family-name:var(--font-playfair)]",
    description:
      "text-base sm:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed mb-8",
    banner:
      "inline-flex flex-wrap items-center justify-center gap-3 bg-[#111] text-white px-6 py-3 rounded-2xl shadow-md border border-[#333]",
    bannerTag:
      "bg-[#C9A84C] text-[#111] text-xs font-extrabold uppercase px-2.5 py-1 rounded tracking-wider",
    bannerCode:
      "font-mono font-bold text-[#ffd773] bg-[#222] px-2.5 py-0.5 rounded border border-[#444] text-sm",
  },

  trustBar: {
    section: "bg-white border-b border-[#eee] py-6",
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center",
    card: "p-3",
    title: "text-sm font-bold text-[#111]",
    desc: "text-xs text-[#888] mt-0.5",
  },

  products: {
    section: "py-16 sm:py-20 bg-white",
    grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16",
  },
};
