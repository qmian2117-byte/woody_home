"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import type { SiteContent } from "@/app/site-content";

export function Footer({ site }: { site: SiteContent }) {
  return (
    <footer className="w-full">
      {/* ═══ Pre-Footer Trust Bar ═══ */}
      <div className="w-full bg-[#f8f8f8] border-t border-b border-[#eaeaea] py-3.5 px-4 sm:px-8">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-[#111111]">
            <span className="text-black text-xs">✦</span>
            <span>Trusted By 5,000+ Happy Customers</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded border border-[#e5e5e5] text-xs font-medium text-[#222222] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              🚚 Free Shipping
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded border border-[#e5e5e5] text-xs font-medium text-[#222222] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              👜 Premium Collection
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded border border-[#e5e5e5] text-xs font-medium text-[#222222] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              ↩️ Easy Returns
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded border border-[#e5e5e5] text-xs font-medium text-[#222222] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              🔒 Secure Payment
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Main Footer Body ═══ */}
      <div className="bg-[#0a0a0a] text-slate-300 relative overflow-hidden">
        {/* Accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand Column (Span 4) */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="relative w-9 h-9">
                  <Image
                    src="/images/glossy/glossy_woods_new_transparent_8k.png"
                    alt="Woody Home"
                    fill
                    className="object-contain brightness-0 invert"
                    sizes="36px"
                  />
                </div>
                <span className="text-[20px] font-black text-white uppercase tracking-[1.5px] font-[family-name:var(--font-playfair)]">
                  WOODY HOME
                </span>
              </Link>

              <p className="text-[13px] text-[#999999] leading-relaxed mb-6 max-w-sm">
                Woody Home creates elegant handcrafted wooden décor and unique
                artistic pieces designed to bring warmth, character, and
                timeless beauty into your home.
              </p>

              {/* Social Media Buttons */}
              <div className="flex items-center gap-2 mb-6">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 rounded-full bg-black border border-white/20 text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298 0 .586.046.86.13V9.41a6.33 6.33 0 00-.86-.06A6.34 6.34 0 003.1 15.69a6.34 6.34 0 0010.82 4.48c.45-.45.8-.97 1.05-1.54.25-.57.38-1.18.38-1.8V9.38a8.21 8.21 0 004.24 1.15V7.08a4.85 4.85 0 01-0-0.39z" />
                  </svg>
                </a>

                {/* Pinterest */}
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  className="w-8 h-8 rounded-full bg-[#bd081c] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 00-4.37 23.18c-.06-.94-.11-2.39.02-3.42l.85-3.6s-.22-.43-.22-1.07c0-1 .58-1.75 1.3-1.75.61 0 .91.46.91 1.01 0 .62-.39 1.54-.6 2.4-.17.72.36 1.3 1.07 1.3 1.28 0 2.27-1.35 2.27-3.3 0-1.72-1.24-2.93-3.01-2.93-2.05 0-3.26 1.54-3.26 3.13 0 .62.24 1.28.54 1.64.06.07.07.14.05.21l-.2 0.83c-.03.14-.11.17-.25.1-0.95-.44-1.54-1.83-1.54-2.95 0-2.4 1.75-4.61 5.04-4.61 2.65 0 4.7 1.89 4.7 4.41 0 2.63-1.66 4.75-3.96 4.75-.77 0-1.5-.4-1.75-.87l-.48 1.81c-.17.67-.64 1.5-0.95 2.01A11.98 11.98 0 0012 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
                  </svg>
                </a>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-[#1a1a1a] border border-white/10 text-[10px] font-bold text-slate-300 tracking-wider">
                  VISA
                </span>
                <span className="px-2 py-1 rounded bg-[#1a1a1a] border border-white/10 text-[10px] font-bold text-[#eb001b] tracking-wider">
                  Mastercard
                </span>
                <span className="px-2 py-1 rounded bg-[#1a1a1a] border border-white/10 text-[10px] font-bold text-[#006fcf] tracking-wider">
                  AMEX
                </span>
                <span className="px-2 py-1 rounded bg-[#1a1a1a] border border-white/10 text-[10px] font-bold text-[#e21836] tracking-wider">
                  UnionPay
                </span>
              </div>
            </div>

            {/* Quick Links Column (Span 2) */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 font-[family-name:var(--font-playfair)]">
                QUICK LINKS
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/collections" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Collection
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/sales" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Sales
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help & Support Column (Span 2) */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 font-[family-name:var(--font-playfair)]">
                HELP &amp; SUPPORT
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/faqs" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/sales" className="text-[#999999] hover:text-[#C9A84C] transition-colors">
                    Search
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get In Touch Column (Span 4) */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 font-[family-name:var(--font-playfair)]">
                GET IN TOUCH
              </h3>
              <div className="space-y-2.5">
                {/* Phone */}
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.07] hover:border-[#C9A84C]/40 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
                      PHONE / WHATSAPP
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                      {site.phone}
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.07] hover:border-[#C9A84C]/40 hover:bg-white/[0.06] transition-all group"
                >
                  <div className="w-8 h-8 rounded-md bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
                      EMAIL US
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-[#C9A84C] transition-colors">
                      {site.email}
                    </div>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
                  <div className="w-8 h-8 rounded-md bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
                      ADDRESS
                    </div>
                    <div className="text-xs font-bold text-white">
                      3CQ7+28Q, Waljh, Pakistan
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
                  <div className="w-8 h-8 rounded-md bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
                      WORKING HOURS
                    </div>
                    <div className="text-xs font-bold text-white">
                      24 hours a day \ 7 Days a week
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
            <p>© {new Date().getFullYear()} <strong className="text-[#C9A84C] font-semibold">Woody Home</strong>. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <Link href="/faqs" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/faqs" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/faqs" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
