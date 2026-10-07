export const contactStyles = {
  header: {
    wrapper: "bg-[#fbfbf9] pt-14 sm:pt-20 pb-4 text-center",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    title: "font-normal tracking-tight",
  },

  section: "bg-[#fbfbf9] pb-16 md:pb-24 pt-4",
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

  // Channels
  channelCard: "bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#C9A84C]/60 transition-all flex items-start gap-4 text-neutral-900 group no-underline",
  channelCardHighlight: "bg-gradient-to-br from-[#111111] to-[#1c1b18] text-white rounded-2xl border border-[#C9A84C]/50 p-5 sm:p-6 shadow-lg hover:shadow-xl hover:border-[#C9A84C] transition-all flex items-start gap-4 no-underline group",
  channelIcon: "w-11 h-11 rounded-xl bg-neutral-100 text-[#111111] flex items-center justify-center shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#111111] transition-colors",
  channelIconHighlight: "w-11 h-11 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 border border-[#25D366]/40",

  // Form
  formWrapper: "bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden",
  formHeader: "mb-8",
  eyebrow: "text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2 block",
  formTitle: "text-2xl sm:text-3xl font-bold font-[family-name:var(--font-playfair)] text-[#111111] mb-2",
  formSubtitle: "text-sm text-neutral-600 leading-relaxed",
  label: "block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2",
  input: "w-full px-4 py-3 rounded-xl border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all bg-[#fcfcfb]",
  select: "w-full px-4 py-3 rounded-xl border border-neutral-300 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all bg-[#fcfcfb]",
  textarea: "w-full px-4 py-3 rounded-xl border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all bg-[#fcfcfb] resize-none h-32",
  btnSubmit: "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C9A84C] hover:text-[#111111] transition-all shadow-md cursor-pointer",
  btnWhatsApp: "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1fa950] transition-all shadow-md cursor-pointer",

  // Custom Banner
  customBannerWrap: "mt-16 sm:mt-24 rounded-3xl bg-[#111111] text-white p-8 sm:p-12 md:p-16 border border-[#C9A84C]/30 relative overflow-hidden text-center",
  customBannerTitle: "text-2xl sm:text-3xl md:text-4xl font-normal font-[family-name:var(--font-playfair)] text-white mb-4",
  customBannerDesc: "text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto mb-8 leading-relaxed",
  customBannerBtn: "inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C9A84C] text-[#111111] text-xs font-extrabold uppercase tracking-widest hover:bg-[#dfbe67] transition-all shadow-lg",

  // FAQ
  faqSection: "mt-16 sm:mt-24 max-w-4xl mx-auto",
  faqItem: "bg-white rounded-2xl border border-neutral-200/80 mb-4 overflow-hidden transition-all",
  faqQuestion: "w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-neutral-900 hover:text-[#C9A84C] transition-colors cursor-pointer text-sm sm:text-base font-[family-name:var(--font-playfair)]",
  faqAnswer: "px-6 pb-6 text-sm text-neutral-600 leading-relaxed",
};
