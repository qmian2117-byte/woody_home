# Home Security Installation - CMS Architecture Guide & Prompt

This document is the single source of truth for the architecture, file placement, content/style split, dynamic slug systems, custom 404 design, and maintenance guidelines for this service-site project.

---

## 1. Core Architecture Principles

1. **Next.js 16 App Router & React 19**:
   - Modern App Router with TypeScript.
   - Dynamic route parameters use `params: Promise<{ slug: string }>` and must be awaited before accessing `slug`.

2. **Strict Route Wrapper & UI Module Split**:
   - **Route Wrappers (`src/app/**/page.tsx`)**:
     - Kept lean and small (typically < 30-40 lines).
     - Static routes: import route-local CMS content from `content.ts`, export metadata from `content.seo`, and render the matching UI component from `@/page/...`.
     - Dynamic routes: export `generateStaticParams()`, export `generateMetadata()`, resolve `await params`, lookup canonical item, invoke `notFound()` if absent, and pass resolved data to the matching `@/page/...` UI component.
   - **Page UI Modules (`src/page/**.tsx`)**:
     - Full page layouts, responsive grids, hero sections, interactive features, and markup live here.
     - Add `"use client"` only when interactive state, hooks (`useState`, `useMemo`), or browser APIs are required (e.g. search filter, reading progress bar, accordions).

3. **Route-Local CMS Content (`content.ts`)**:
   - Every page/route has a co-located `content.ts` containing all text, headings, arrays, SEO meta descriptions, trust points, and FAQs.
   - Canonical arrays (e.g. `services`, `serviceAreaLocations`, `blogPosts`) live in listing routes (`src/app/services/content.ts`, `src/app/service-area/content.ts`, `src/app/blog/content.ts`).
   - Detail routes re-export or derive their content from canonical stores.
   - No hardcoded copy or duplicated data inside UI markup.

4. **Route-Local Style Maps (`style.tsx`)**:
   - Co-located `style.tsx` files maintain curated Tailwind CSS class dictionaries, background helpers, and theme variables.
   - Shared layout styles live in `src/app/_shared/style.tsx`.
   - Route-specific styles compose shared primitives cleanly.

5. **Theme & Visual Language**:
   - **Brand Navy Base**: `#08265a`, `#001d46`, `#0b1932`, `#06214a`
   - **Bright Yellow Accent/CTA**: `#ffd21f`, `#ffc200`
   - **Service Blue Accents**: `#1f74d0`, `#3f8bd4`
   - **Content Surfaces**: Clean crisp white `#ffffff` with subtle slate borders and typography.

---

## 2. Target File Map

```text
src/
├── app/
│   ├── layout.tsx                     # Root layout (fonts, Nav, Footer, siteContent, globals.css)
│   ├── globals.css                    # Tailwind CSS v4 root stylesheet and theme variables
│   ├── site-content.ts                # Global brand, contact info, topbar, nav, and footer content
│   ├── page.tsx                       # Home route wrapper
│   ├── not-found.tsx                  # Special Next.js App Router 404 wrapper
│   ├── _home/
│   │   ├── content.ts                 # Home-specific CMS content & SEO
│   │   └── style.tsx                  # Home-specific style maps
│   ├── _shared/
│   │   ├── page-content.ts            # Common TypeScript interfaces & types
│   │   ├── style.tsx                  # Shared Tailwind class maps (heroes, CTAs, buttons)
│   │   └── testimonial-pattern.tsx    # Reusable testimonial SVG background pattern
│   ├── about/
│   │   ├── page.tsx                   # About route wrapper
│   │   ├── content.ts                 # About CMS content & SEO
│   │   └── style.tsx                  # About style maps
│   ├── services/
│   │   ├── page.tsx                   # Services listing wrapper
│   │   ├── content.ts                 # Canonical services array, card generator, getServiceBySlug
│   │   ├── style.tsx                  # Services listing style maps
│   │   └── [slug]/
│   │       ├── page.tsx               # Dynamic service route wrapper
│   │       ├── content.ts             # Service detail CMS content re-exports & helpers
│   │       └── style.tsx              # Service detail style maps
│   ├── service-area/
│   │   ├── page.tsx                   # Service area listing wrapper
│   │   ├── content.ts                 # Canonical locations array, previewCityNames, static params, getServiceAreaLocationBySlug
│   │   ├── style.tsx                  # Service area style maps & process background helpers
│   │   └── [slug]/
│   │       ├── page.tsx               # Dynamic city route wrapper
│   │       ├── content.ts             # Templated location CMS detail builder
│   │       └── style.tsx              # Service area detail style maps
│   ├── blog/
│   │   ├── page.tsx                   # Blog listing wrapper
│   │   ├── content.ts                 # Canonical blog posts, categories, getBlogPostBySlug, getRelatedBlogPosts
│   │   ├── style.tsx                  # Blog listing style maps
│   │   └── [slug]/
│   │       ├── page.tsx               # Dynamic blog post route wrapper
│   │       ├── content.ts             # Blog post CMS content re-exports & helpers
│   │       └── style.tsx              # Article layout style maps
│   ├── contact/
│   │   ├── page.tsx                   # Contact route wrapper
│   │   ├── content.ts                 # Contact CMS content & SEO
│   │   └── style.tsx                  # Contact style maps
│   └── not-found/
│       ├── content.ts                 # 404 error CMS copy & recovery links
│       └── style.tsx                  # 404 styling classes
├── components/
│   ├── Nav.tsx                        # Global navigation header with top bar and mobile drawer
│   ├── Footer.tsx                     # Global footer with credentials, links, and areas
│   ├── CountUpNumber.tsx              # Animated metric counter
│   ├── ReadingProgressBar.tsx         # Sticky article reading progress bar
│   └── BlogPostTableOfContents.tsx    # Interactive table of contents widget
└── page/
    ├── home.tsx                       # Home page UI module
    ├── about.tsx                      # About page UI module
    ├── services.tsx                   # Services catalog UI module
    ├── service-detail.tsx             # Service detail UI module
    ├── service-area.tsx               # Service area explorer UI module
    ├── service-area-detail.tsx        # Localized city landing UI module
    ├── blog.tsx                       # Blog catalog UI module
    ├── blog-post.tsx                  # Long-form article UI module
    ├── contact.tsx                    # Contact & quote form UI module
    └── not-found.tsx                  # 404 UI module
```

---

## 3. Slug Systems Implementation

### 3.1 Services (`/services/[slug]`)
- Canonical services live in `src/app/services/content.ts`.
- Each service entry defines: `slug`, `title`, `shortDescription`, `fullDescription`, `features`, `specifications`, `benefits`, `pricingTier`, `faqs`, and `seo`.
- Stable href is `/services/${service.slug}`.
- Dynamic route wrapper (`src/app/services/[slug]/page.tsx`):
  - `generateStaticParams()` maps `serviceDetails.map((s) => ({ slug: s.slug }))`.
  - `generateMetadata({ params })` awaits `params`, looks up service, and returns `service.seo`.
  - Renders `<ServiceDetailPage service={service} />` or calls `notFound()`.

### 3.2 Service Area (`/service-area/[slug]`)
- Canonical locations live in `src/app/service-area/content.ts`.
- Each location entry defines: `slug`, `city`, `stateAbbreviation`, `descriptor`, `projectCount`, `responseTime`, `coverageNeighborhoods`, and `ctaLabel`.
- Dynamic route wrapper (`src/app/service-area/[slug]/page.tsx`):
  - `generateStaticParams()` returns `serviceAreaStaticParams`.
  - `generateMetadata({ params })` awaits `params`, looks up location, and returns SEO metadata.
  - Passes resolved `detail` to `<ServiceAreaDetailPage location={location} detail={detail} />`.

### 3.3 Blog Posts (`/blog/[slug]`)
- Canonical articles live in `src/app/blog/content.ts`.
- Each article entry defines: `slug`, `title`, `excerpt`, `category`, `tags`, `publishedAt`, `readTime`, `author`, `image`, and structured `sections` (`id`, `heading`, `content`).
- Dynamic route wrapper (`src/app/blog/[slug]/page.tsx`):
  - `generateStaticParams()` maps `blogPosts.map((p) => ({ slug: p.slug }))`.
  - `generateMetadata({ params })` awaits `params`, returns title/excerpt metadata.
  - Passes post and related posts to `<BlogPostPage post={post} relatedPosts={related} />`.

---

## 4. Custom 404 Architecture

Next.js App Router requires `src/app/not-found.tsx` to handle 404 responses.
We maintain the exact split:
1. `src/app/not-found.tsx`: Route wrapper importing `notFoundPage` from `@/app/not-found/content`, exporting `metadata = notFoundPage.seo`, importing `NotFoundPage` from `@/page/not-found`, and rendering `<NotFoundPage />`.
2. `src/app/not-found/content.ts`: Pure CMS dictionary with error code, title, message, quick links, and SEO.
3. `src/app/not-found/style.tsx`: Co-located Tailwind class maps.
4. `src/page/not-found.tsx`: Clean, branded error page with emergency contact and navigation recovery buttons.

---

## 5. Maintenance Protocol & Verification Checklist

- [ ] **Read relevant docs**: Never guess Next.js 16 APIs; inspect installed packages or types when modifying router behaviors.
- [ ] **Respect the split**: Keep wrappers in `src/app` small, content in `content.ts`, styles in `style.tsx`, and full UI in `src/page`.
- [ ] **No duplicated data**: Always import canonical arrays from listing route content files.
- [ ] **Validation**:
  - Run `npx tsc --noEmit` to verify type safety.
  - Run `npm run build` to verify all static and dynamic paths compile cleanly.
