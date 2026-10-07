import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, PhoneCall, ChevronRight } from "lucide-react";
import { notFoundPage } from "@/app/not-found/content";
import { notFoundStyles } from "@/app/not-found/style";

export function NotFoundPage() {
  return (
    <div className={notFoundStyles.outer}>
      <div className={notFoundStyles.card}>
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className={notFoundStyles.codeBadge}>
          <span>{notFoundPage.badge}</span>
        </div>

        <h1 className={notFoundStyles.headline}>
          {notFoundPage.headline}
        </h1>

        <p className={notFoundStyles.message}>
          {notFoundPage.message}
        </p>

        {/* Recovery Links Grid */}
        <div className={notFoundStyles.recoveryGrid}>
          {notFoundPage.recoveryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={notFoundStyles.recoveryItem}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#001d46] group-hover:text-[#1f74d0] transition-colors">
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{link.description}</p>
            </Link>
          ))}
        </div>

        {/* Support Hotline */}
        <div className={notFoundStyles.supportBox}>
          <span>{notFoundPage.support.text}</span>
          <a
            href={`tel:${notFoundPage.support.phoneRaw}`}
            className="font-extrabold text-[#1f74d0] hover:text-[#001d46] flex items-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{notFoundPage.support.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
