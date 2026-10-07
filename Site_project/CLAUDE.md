# CLAUDE.md - Service-Site Project Instructions

Please refer to [AGENTS.md](file:///./AGENTS.md) and [CMS_ARCHITECTURE_PROMPT.md](file:///./CMS_ARCHITECTURE_PROMPT.md) for full project architecture, Next.js 16 requirements, and coding guidelines.

## Quick Summary
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- **Rules**: Follow `.cursor/rules/service-site-cms-architecture.mdc` and `.cursor/skills/service-site-cms-architecture/SKILL.md`.
- **Wrappers**: Minimal wrappers in `src/app/**/page.tsx`.
- **UI**: Full page presentation in `src/page/**.tsx`.
- **Content**: Pure CMS dictionaries in `content.ts`.
- **Style**: Class maps in `style.tsx`.
- **404 Split**: Maintain `src/app/not-found.tsx`, `src/app/not-found/content.ts`, `src/app/not-found/style.tsx`, and `src/page/not-found.tsx`.
