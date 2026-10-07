import type { Metadata } from "next";

export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title: string;
    description: string;
    url?: string;
    siteName?: string;
    images?: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
    locale?: string;
    type?: string;
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  serviceUsed?: string;
}

export interface ProcessStepItem {
  number: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  iconName?: string;
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
}

export interface ServiceCard {
  slug: string;
  title: string;
  shortDescription: string;
  iconName: string;
  href: string;
  features: string[];
  badge?: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  heroImage: string;
  features: string[];
  specifications: { label: string; value: string }[];
  equipmentIncluded: string[];
  benefits: { title: string; description: string }[];
  faqs: FaqItem[];
  pricingStartingAt: string;
  seo: Metadata;
}

export interface ServiceAreaLocation {
  slug: string;
  city: string;
  stateAbbreviation: string;
  descriptor: string;
  projectCount: number;
  responseTime: string;
  ctaLabel: string;
  href: string;
  neighborhoods: string[];
  seo: Metadata;
}

export interface ServiceAreaDetailPageData {
  city: string;
  stateAbbreviation: string;
  descriptor: string;
  projectCount: number;
  heroTitle: string;
  heroIntro: string;
  localStats: StatItem[];
  localGuarantees: string[];
  neighborhoods: string[];
  reviews: TestimonialItem[];
  faqs: FaqItem[];
  seo: Metadata;
}

export interface BlogSection {
  id: string;
  heading: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  image: string;
  sections: BlogSection[];
  seo?: Metadata;
}

export interface BlogCategory {
  slug: string;
  name: string;
  count: number;
}
