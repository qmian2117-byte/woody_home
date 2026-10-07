import { sharedStyles, buttonStyles, cardStyles } from "@/app/_shared/style";

export const notFoundStyles = {
  ...sharedStyles,
  buttons: buttonStyles,
  cards: cardStyles,

  outer: "min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden",
  card: "max-w-2xl w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-2xl text-center relative z-10",
  codeBadge: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 mb-6",
  headline: "text-2xl sm:text-4xl font-black text-[#001d46] tracking-tight mb-4",
  message: "text-sm sm:text-base text-slate-600 leading-relaxed mb-8",
  recoveryGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8",
  recoveryItem: "p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-blue-50/60 hover:border-[#1f74d0]/40 transition-all group block",
  supportBox: "pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500",
};
