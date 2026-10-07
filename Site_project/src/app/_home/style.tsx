import { sharedStyles, buttonStyles, cardStyles } from "@/app/_shared/style";

export const homeStyles = {
  ...sharedStyles,
  buttons: buttonStyles,
  cards: cardStyles,

  hero: {
    section:
      "relative w-full flex flex-col overflow-hidden",
    heroBanner:
      "relative w-full h-[1066px] overflow-hidden",
    bgImage:
      "absolute inset-0 w-full h-full object-cover object-center",
    overlay:
      "absolute inset-0 bg-gradient-to-r from-white/50 via-white/20 to-transparent pointer-events-none",
    contentWrapper:
      "relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full h-full flex flex-col justify-between pt-[150px] pb-[50px]",
    textBlock:
      "flex flex-col items-start max-w-xl",
    title:
      "text-[48px] sm:text-[62px] md:text-[78px] font-bold tracking-tight text-[#4E2B13] leading-[1.05] mb-2 font-[family-name:var(--font-cormorant)] drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]",
    subtitle:
      "text-2xl sm:text-3xl lg:text-[2.25rem] font-semibold text-[#4E2B13] mb-4 font-[family-name:var(--font-cormorant)] tracking-wide",
    description:
      "text-lg sm:text-xl text-[#A8998B] leading-relaxed mb-0 max-w-md font-medium font-[family-name:var(--font-cormorant)]",
    ctaRow:
      "flex flex-wrap items-center gap-5",
    primaryBtn:
      "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm font-extrabold text-sm uppercase tracking-[0.2em] text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-[#C9A84C]",
    outlineBtn:
      "inline-flex items-center justify-center gap-2 px-10 py-4 rounded-sm font-extrabold text-sm uppercase tracking-[0.2em] text-white bg-[#111] border-2 border-[#111] hover:bg-[#333] hover:border-[#333] shadow-lg transition-all duration-300 transform hover:-translate-y-0.5",
    trustBar:
      "w-full bg-white border-y border-[#e5e5e5] overflow-hidden flex-shrink-0 shadow-sm",
    trustBarInner:
      "py-3.5 overflow-hidden",
    trustItem:
      "flex items-center gap-2.5 px-8 whitespace-nowrap text-xs sm:text-sm font-bold text-black uppercase tracking-[0.15em]",
    trustSeparator:
      "w-1.5 h-1.5 rounded-full bg-black mx-4 shrink-0",
  },

  products: {
    grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-12",
  },

  customOrdersTeaser: {
    wrap: "co-teaser-wrap",
    card: "co-teaser reveal-section",
    art: "co-teaser-art",
    logo: "co-teaser-default-logo",
    copy: "co-teaser-copy",
    eyebrow: "co-eyebrow",
    heading: "co-heading",
    desc: "co-desc",
    btn: "co-btn",
  },

  uniqueProducts: {
    section: "tm-cb-section reveal-section",
    header: "tm-cb-header",
    eyebrow: "tm-cb-eyebrow",
    heading: "tm-cb-heading",
    grid: "tm-cb-grid",
    item: "tm-cb-item",
    banner: "tm-cb-banner tm-cb-in-view",
    bannerImg: "tm-cb-banner-img",
    overlay: "tm-cb-overlay",
    content: "tm-cb-content",
    title: "tm-cb-title",
    btn: "tm-cb-btn",
    mobileBtnWrap: "tm-cb-mobile-btn-wrap",
    mobileBtn: "tm-cb-mobile-btn",
  },

  collections: {
    section: "gw-cols-section reveal-section",
    header: "gw-cols-header",
    eyebrow: "gw-cols-eyebrow",
    heading: "gw-cols-heading",
    grid: "gw-cols-grid",
    card: "gw-cols-card gw-cols-in-view",
    imgWrap: "gw-cols-img-wrap",
    imgMain: "gw-cols-img-main",
    info: "gw-cols-info",
    title: "gw-cols-title",
    count: "gw-cols-count",
    btn: "gw-cols-btn",
  },

  whyChooseUs: {
    section: "tm-pinfo-section reveal-section",
    wrap: "tm-pinfo-wrap",
    media: "tm-pinfo-media",
    imgBox: "tm-pinfo-img-box",
    badgeFloat: "tm-pinfo-badge-float",
    badgeIcon: "tm-pinfo-badge-icon",
    badgeNum: "tm-pinfo-badge-num",
    badgeLabel: "tm-pinfo-badge-label",
    content: "tm-pinfo-content",
    label: "tm-pinfo-label",
    title: "tm-pinfo-title",
    desc: "tm-pinfo-desc",
    features: "tm-pinfo-features",
    feature: "tm-pinfo-feature",
    featIcon: "tm-pinfo-feat-icon",
    featTitle: "tm-pinfo-feat-title",
    featText: "tm-pinfo-feat-text",
    ctas: "tm-pinfo-ctas",
    btnPrimary: "tm-pinfo-btn-primary",
    btnSecondary: "tm-pinfo-btn-secondary",
    stats: "tm-pinfo-stats",
    stat: "tm-pinfo-stat",
    statNum: "tm-pinfo-stat-num",
    statLabel: "tm-pinfo-stat-label",
  },

  testimonials: {
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-12",
    card: "relative bg-white rounded-2xl p-7 border border-[#f0f0f0] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden",
    ratingPill:
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111] text-[#C9A84C] text-xs font-bold",
  },
};
