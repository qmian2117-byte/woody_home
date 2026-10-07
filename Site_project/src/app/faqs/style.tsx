import { sharedStyles, buttonStyles, cardStyles } from "@/app/_shared/style";

export const faqsStyles = {
  ...sharedStyles,
  buttons: buttonStyles,
  cards: cardStyles,

  hero: {
    section: "relative bg-[#f9f9f7] border-b border-[#e5e5e5] py-14 sm:py-20 overflow-hidden",
    container: "max-w-4xl mx-auto px-6 sm:px-10 text-center",
    badge:
      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#8c6b1f] text-xs font-bold uppercase tracking-wider mb-4 border border-[#C9A84C]/30",
    title:
      "text-3xl sm:text-5xl font-black text-[#4E2B13] tracking-tight leading-tight mb-4 font-[family-name:var(--font-playfair)]",
    description:
      "text-base sm:text-lg text-[#666] max-w-2xl mx-auto leading-relaxed",
  },

  content: {
    section: "py-16 sm:py-20 bg-white",
    container: "max-w-4xl mx-auto px-6 sm:px-10",
    categoryTitle:
      "text-xl sm:text-2xl font-black text-[#111] mb-6 font-[family-name:var(--font-playfair)] flex items-center gap-3",
    categoryDivider: "border-b border-[#e5e5e5] pb-3 mb-6",
    itemWrapper: "space-y-4 mb-14",
    cardOpen: "border border-[#C9A84C]/40 bg-[#fbfaf8] rounded-2xl shadow-sm transition-all duration-200 overflow-hidden",
    cardClosed: "border border-[#eee] bg-white rounded-2xl hover:border-[#ddd] transition-all duration-200 overflow-hidden",
    button: "w-full flex items-center justify-between px-6 py-4.5 text-left",
    question: "text-base font-bold text-[#111] pr-4",
    chevron: "w-5 h-5 text-[#aaa] shrink-0 transition-transform duration-200",
    answerWrapper: "px-6 pb-5 pt-1 text-sm sm:text-base text-[#555] leading-relaxed border-t border-[#eee]/60",
  },

  contactCard: {
    wrapper:
      "bg-gradient-to-r from-[#111] to-[#222] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl mt-8",
    title: "text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)] mb-3",
    description: "text-slate-300 max-w-md mx-auto mb-6 text-sm sm:text-base leading-relaxed",
    actions: "flex flex-wrap items-center justify-center gap-4",
    primaryBtn:
      "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[#C9A84C] text-[#111] hover:bg-[#e8c96b] shadow transition-all",
    secondaryBtn:
      "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all",
  },
};
