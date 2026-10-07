"use client";

import React, { useEffect, useState } from "react";
import { ListOrdered } from "lucide-react";

export function BlogPostTableOfContents({
  sections,
}: {
  sections: { id: string; heading: string }[];
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (!sections || sections.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 sticky top-28">
      <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-[#001d46] pb-3 border-b border-slate-200 mb-4">
        <ListOrdered className="w-4 h-4 text-[#1f74d0]" />
        <span>Table of Contents</span>
      </div>

      <nav aria-label="Table of contents">
        <ul className="space-y-2.5 text-sm">
          {sections.map((sec, index) => {
            const isActive = activeId === sec.id || (!activeId && index === 0);

            return (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className={`block py-1 text-xs sm:text-sm transition-all duration-150 rounded-md px-2 ${
                    isActive
                      ? "text-[#1f74d0] font-bold bg-blue-50/80 translate-x-1"
                      : "text-slate-600 hover:text-[#08265a] hover:bg-slate-100/60"
                  }`}
                >
                  {sec.heading}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
