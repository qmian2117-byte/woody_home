# AGENTS.md - Guidelines for AI Agents

## Critical Environment Notice: Next.js 16.x
This project is built on **Next.js 16.x** and **React 19**.
Do NOT assume behavior from older Next.js versions (e.g. Next 13/14 sync dynamic params).
- Dynamic route parameters: In Next.js 16, dynamic params are asynchronous:
  ```typescript
  export default async function Page({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    // ...
  }
  ```
- Before changing App Router route files, metadata, dynamic params, not-found behavior, layouts, or related APIs, consult the installed documentation and type definitions under `node_modules/next/dist/` or official Next.js 16 docs.

## Architecture Guidelines
Always adhere to the service-site CMS architecture:
1. Reference `CMS_ARCHITECTURE_PROMPT.md` and `.cursor/skills/service-site-cms-architecture/SKILL.md`.
2. Keep route wrappers in `src/app/**/page.tsx` minimal.
3. Place all UI components and section JSX in `src/page/**.tsx`.
4. Place route-local CMS content in `content.ts`.
5. Place route-local Tailwind style maps in `style.tsx`.
6. Preserve the exact custom 404 split (`src/app/not-found.tsx`, `src/app/not-found/content.ts`, `src/app/not-found/style.tsx`, and `src/page/not-found.tsx`).
7. Never edit `.next/` or build artifacts directly.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
