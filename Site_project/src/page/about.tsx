import React from "react";
import { aboutContent } from "@/app/about/content";
import { aboutStyles } from "@/app/about/style";

export function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      {/* ═══ Exact Match tm-page-outer / reveal-section visible ═══ */}
      <div className={aboutStyles.outer}>
        <div className={aboutStyles.titleBlock}>
          <h1 className={aboutStyles.title}>{aboutContent.pageTitle}</h1>
          <div className={aboutStyles.titleBar} />
        </div>

        <div className={aboutStyles.content}>
          <h1 className="PDq2pG_selectionAnchorContainer"><br /></h1>
          <h3 className={aboutStyles.h3}>{aboutContent.heading}</h3>
          <p className={aboutStyles.p}>
            Welcome to <strong className={aboutStyles.strong}>Woody Home</strong> — where natural wood meets creativity and craftsmanship. 🌳✨
          </p>
          <p className={aboutStyles.p}>
            We create <strong className={aboutStyles.strong}>handcrafted wooden products</strong> designed to bring warmth, character, and timeless beauty to your home and workspace. 🏡🪵
          </p>
          <p className={aboutStyles.p}>
            {aboutContent.story2}
          </p>
          <p className={aboutStyles.featureList}>
            {aboutContent.highlights.map((item, idx) => (
              <React.Fragment key={idx}>
                {item.emoji} <strong className={aboutStyles.strong}>{item.text}</strong>
                {idx < aboutContent.highlights.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <p className={aboutStyles.p}>
            Because every piece of wood has its own character, <strong className={aboutStyles.strong}>no two handmade products are exactly alike</strong>. 🤎
          </p>
          <h3 className={aboutStyles.h3}>{aboutContent.promiseTitle}</h3>
          <p className={aboutStyles.p}>
            {aboutContent.promiseText}
          </p>
          <p className={aboutStyles.p}>
            <strong className={aboutStyles.strong}>{aboutContent.thankYou}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
