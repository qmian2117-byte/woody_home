---
name: service-site-cms-architecture
description: Maintains route wrappers, route-local content/style modules, src/page UI modules, custom 404 structure, and services/service-area/blog slug systems for service-site projects.
---

# Service-Site CMS Architecture Skill

## Quick Start
1. Read `CMS_ARCHITECTURE_PROMPT.md` as the full architecture reference.
2. Inspect the current workspace tree before editing.
3. Keep route wrappers lean in `src/app/**/page.tsx`.
4. Keep route CMS text and canonical data in `content.ts` files.
5. Keep Tailwind class maps and layout helpers in `style.tsx` files.
6. Keep full page layouts and section markup in `src/page/**.tsx`.
7. Keep shared primitives in `src/app/_shared/` and reusable cross-page components in `src/components/`.
8. Never edit generated files such as `.next`, caches, or build artifacts.

## File Placement Rules
- **Route Wrappers (`src/app/**/page.tsx`)**: Import content, export metadata, resolve params with `await params`, call `notFound()` if missing, and render page UI from `src/page/`.
- **Page UI (`src/page/**.tsx`)**: Full page layout & presentation. Add `"use client"` only for client state/interaction.
- **Route CMS (`content.ts`)**: Co-located CMS dictionary exporting copy, SEO, and structured content. Canonical collections live in listing routes (`src/app/services/content.ts`, `src/app/service-area/content.ts`, `src/app/blog/content.ts`).
- **Route Style (`style.tsx`)**: Co-located Tailwind class maps and CSS variable/background helpers.

## Slug Systems
- `/services/[slug]`: Canonical services array in `src/app/services/content.ts` with `getServiceBySlug(slug)`.
- `/service-area/[slug]`: Canonical city data in `src/app/service-area/content.ts` with `getServiceAreaLocationBySlug(slug)` and templated detail copy.
- `/blog/[slug]`: Canonical blog posts in `src/app/blog/content.ts` with `getBlogPostBySlug(slug)` and `getRelatedBlogPosts(...)`.

## Custom 404 Split
Strictly maintain:
- `src/app/not-found.tsx`: Next.js App Router wrapper exporting metadata and rendering `<NotFoundPage />`.
- `src/app/not-found/content.ts`: 404 copy and SEO.
- `src/app/not-found/style.tsx`: 404 class maps.
- `src/page/not-found.tsx`: 404 presentation UI.

## Validation Checklist
- Run `npx tsc --noEmit` to verify type cleanliness.
- Run `npm run lint` and `npm run build` when making structural or route changes.
