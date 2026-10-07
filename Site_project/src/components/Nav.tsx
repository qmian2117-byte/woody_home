"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, ChevronRight, ShoppingBag, Search } from "lucide-react";
import type { SiteContent } from "@/app/site-content";
import { useCart } from "@/context/CartContext";
import { fetchSearchSuggestions } from "@/lib/api";

export function Nav({ site }: { site: SiteContent }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cart, openCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Debounced predictive search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetchSearchSuggestions(searchQuery);
        setSearchResults(res);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.09)]" : ""
      }`}
    >
      {/* Announcement Bar */}
      <div className="bg-[#111] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-[1500px] mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#C9A84C] text-[#111] font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
              {site.topBar.badge}
            </span>
            <span className="hidden sm:inline text-slate-400">
              {site.topBar.promoText}
            </span>
          </div>

          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-[#C9A84C] hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{site.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[74px] border-b border-[#f2f2f2]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Woody Home"
          >
            <div className="w-[38px] h-[38px] rounded-[9px] bg-[#111] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[22px] sm:text-[25px] font-black text-[#111] tracking-tight leading-none font-[family-name:var(--font-playfair)]">
                Woody<span className="text-[#C9A84C]"> Home</span>
              </span>
              <span className="text-[9px] font-medium text-[#aaa] uppercase tracking-[2px] mt-0.5">
                Handcrafted Decor
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main Navigation"
          >
            {site.navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-[7px] text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[#111] bg-[#f9f9f7]"
                      : "text-[#333] hover:text-[#111] hover:bg-[#f9f9f7] hover:-translate-y-[1px]"
                  }`}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-[2px] left-3.5 right-3.5 h-[2px] bg-[#C9A84C] rounded-sm transition-transform duration-250 origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Predictive Search Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search lamps, deer sculpture, jeep..."
                      className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#C9A84C] focus:bg-white outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Results List */}
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      Searching handcrafted catalog...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="mt-2 divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors group"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-neutral-800 group-hover:text-[#C9A84C] truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] font-black text-neutral-900 mt-0.5">
                              Rs. {item.price.toLocaleString()}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No wooden masterpieces found for "{searchQuery}".
                    </div>
                  ) : (
                    <div className="p-3 text-[11px] text-neutral-400 text-center">
                      Type at least 2 characters for live suggestions...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button with Live Badge */}
            <button
              onClick={openCart}
              className="relative inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-sm hover:shadow transition-all duration-200"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {(cart?.item_count || 0) > 0 && (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#111] text-[#C9A84C] text-[10px] font-black flex items-center justify-center">
                  {cart?.item_count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl text-[#333] hover:text-[#111] hover:bg-[#f9f9f7] focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>


      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#f0f0f0] px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {site.navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
                    isActive
                      ? "text-[#C9A84C] bg-[#f9f9f7]"
                      : "text-[#333] hover:bg-[#f9f9f7]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#ccc]" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#f0f0f0] space-y-3">
            <Link
              href={site.cta.href}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-black text-[#111] bg-[#C9A84C] hover:bg-[#e8c96b] shadow-md transition-all text-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{site.cta.label}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
