"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { faqsContent } from "@/app/faqs/content";
import { faqsStyles } from "@/app/faqs/style";

export function FaqsPage() {
  // Store open state by categoryIndex-itemIndex
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col w-full">
      {/* ═══ FAQs Hero ═══ */}
      <section className={faqsStyles.hero.section}>
        <div className={faqsStyles.hero.container}>
          <span className={faqsStyles.hero.badge}>
            <HelpCircle className="w-3.5 h-3.5 text-[#C9A84C]" />
            {faqsContent.header.badge}
          </span>
          <h1 className={faqsStyles.hero.title}>
            {faqsContent.header.title}
          </h1>
          <p className={faqsStyles.hero.description}>
            {faqsContent.header.description}
          </p>
        </div>
      </section>

      {/* ═══ FAQs Content ═══ */}
      <section className={faqsStyles.content.section}>
        <div className={faqsStyles.content.container}>
          {faqsContent.categories.map((category, catIdx) => (
            <div key={category.title} className="mb-12">
              <div className={faqsStyles.content.categoryDivider}>
                <h2 className={faqsStyles.content.categoryTitle}>
                  <span>{category.title}</span>
                </h2>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={item.question}
                      className={
                        isOpen
                          ? faqsStyles.content.cardOpen
                          : faqsStyles.content.cardClosed
                      }
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        type="button"
                        className={faqsStyles.content.button}
                        aria-expanded={isOpen}
                      >
                        <span className={faqsStyles.content.question}>
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`${faqsStyles.content.chevron} ${
                            isOpen ? "rotate-180 text-[#C9A84C]" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className={faqsStyles.content.answerWrapper}>
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Contact Banner */}
          <div className={faqsStyles.contactCard.wrapper}>
            <h3 className={faqsStyles.contactCard.title}>
              {faqsContent.contactBanner.title}
            </h3>
            <p className={faqsStyles.contactCard.description}>
              {faqsContent.contactBanner.description}
            </p>
            <div className={faqsStyles.contactCard.actions}>
              <a
                href={faqsContent.contactBanner.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={faqsStyles.contactCard.primaryBtn}
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className={faqsStyles.contactCard.secondaryBtn}
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
