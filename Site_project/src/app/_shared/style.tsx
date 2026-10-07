export const sharedStyles = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  sectionPadding: "py-16 md:py-24",
  sectionHeader: "text-center max-w-3xl mx-auto mb-12 md:mb-16",
  eyebrow:
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C9A84C]/10 text-[#C9A84C] mb-4",
  eyebrowDark:
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#C9A84C]/20 text-[#C9A84C] mb-4",
  sectionTitle:
    "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] tracking-tight leading-tight font-[family-name:var(--font-playfair)]",
  sectionTitleDark:
    "text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-[family-name:var(--font-playfair)]",
  sectionSubtitle:
    "mt-4 text-base sm:text-lg text-[#888888] leading-relaxed",
  sectionSubtitleDark:
    "mt-4 text-base sm:text-lg text-slate-300 leading-relaxed",
};

export const buttonStyles = {
  primary:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2",
  primaryLg:
    "inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-extrabold text-base sm:text-lg text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5",
  secondary:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#111111] hover:bg-[#2A2A2A] border border-gray-800 shadow-sm hover:shadow transition-all duration-200",
  secondaryWhite:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#111] bg-white hover:bg-[#f9f9f7] border border-[#e8e8e8] shadow-sm hover:shadow transition-all duration-200",
  outlineLight:
    "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white border-2 border-white/30 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-200",
  accentLink:
    "inline-flex items-center gap-1.5 font-bold text-[#C9A84C] hover:text-[#e8c96b] transition-colors duration-200",
};

export const subpageHeroStyles = {
  wrapper:
    "relative bg-[#111111] text-white py-16 sm:py-20 lg:py-24 overflow-hidden",
  overlay:
    "absolute inset-0 bg-gradient-to-r from-[#111111] via-[#1a1a1a]/95 to-[#2A2A2A]/90 mix-blend-multiply pointer-events-none",
  glow: "absolute -top-40 -right-40 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-3xl pointer-events-none",
  rail: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-l-4 border-[#C9A84C] pl-6 sm:pl-8",
  breadcrumb: "flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-4",
  breadcrumbActive: "text-[#C9A84C] font-semibold",
  title:
    "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 font-[family-name:var(--font-playfair)]",
  intro: "text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed",
};

export const detailHeroStyles = {
  outer: "relative bg-[#f9f9f7] border-b border-[#f0f0f0] pt-8 pb-16 lg:pb-20",
  navBackdrop: "bg-[#111111] h-2 w-full",
  grid: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center",
  contentCol: "lg:col-span-7",
  imageCol: "lg:col-span-5 relative",
  breadcrumb: "flex items-center gap-2 text-xs sm:text-sm text-[#888] mb-6",
  breadcrumbActive: "text-[#C9A84C] font-semibold",
  eyebrow:
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C9A84C]/10 text-[#C9A84C] mb-4",
  title:
    "text-3xl sm:text-4xl lg:text-5xl font-black text-[#111] tracking-tight leading-tight mb-4 font-[family-name:var(--font-playfair)]",
  intro: "text-base sm:text-lg text-[#666] leading-relaxed mb-8",
  buttonRow: "flex flex-wrap items-center gap-4 mb-8",
  trustBadges: "grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#f0f0f0]",
  imageFrame:
    "relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#f5f5f5] aspect-[4/3]",
};

export const ctaBannerStyles = {
  wrapper:
    "relative bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#2A2A2A] text-white py-16 sm:py-20 rounded-3xl overflow-hidden shadow-2xl my-12",
  inner: "relative z-10 max-w-5xl mx-auto px-6 sm:px-12 text-center",
  title:
    "text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight font-[family-name:var(--font-playfair)]",
  text: "text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto",
  actionWrap: "flex flex-wrap items-center justify-center gap-4",
};

export const cardStyles = {
  whiteCard:
    "bg-white rounded-2xl border border-[#f0f0f0] shadow-sm hover:shadow-md transition-all duration-200 p-6 sm:p-8",
  interactiveCard:
    "bg-white rounded-2xl border border-[#f0f0f0] shadow-sm hover:shadow-xl hover:border-[#C9A84C]/40 transition-all duration-300 p-6 sm:p-8 transform hover:-translate-y-1",
  darkCard:
    "bg-[#111111] rounded-2xl border border-gray-800/40 p-6 sm:p-8 text-white",
};
