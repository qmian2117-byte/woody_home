#!/usr/bin/env node

/**
 * Advisory afterFileEdit hook for service-site CMS architecture.
 * Non-blocking, reads stdin JSON payload, and emits helpful context if relevant files are touched.
 */

const fs = require('fs');

function main() {
  let input = '';

  try {
    input = fs.readFileSync(0, 'utf-8');
  } catch {
    // If no stdin or read error, exit quietly
    process.exit(0);
  }

  if (!input || !input.trim()) {
    process.exit(0);
  }

  let data;
  try {
    data = JSON.parse(input);
  } catch {
    // Non-JSON input, treat as raw text or ignore
    data = { filePath: input.trim() };
  }

  const filePath = (data.filePath || data.file || input || '').replace(/\\/g, '/');

  // Ignore generated files and .next cache
  if (filePath.includes('/.next/') || filePath.startsWith('.next/')) {
    process.exit(0);
  }

  const architectureTokens = [
    'CMS_ARCHITECTURE_PROMPT.md',
    '.cursor/skills/service-site-cms-architecture',
    '.cursor/rules/service-site-cms-architecture.mdc',
    '.cursor/hooks/service-site-cms-architecture-reminder.cjs',
    'src/app/',
    'src/page/',
    'src/components/',
  ];

  const isRelevant = architectureTokens.some((token) => filePath.includes(token));

  if (isRelevant) {
    const response = {
      additional_context: [
        'Architecture Reminder:',
        '- Refer to CMS_ARCHITECTURE_PROMPT.md and .cursor/skills/service-site-cms-architecture/SKILL.md.',
        '- Maintain the 4-tier split: route wrappers in src/app, full UI in src/page, CMS content in content.ts, and Tailwind style maps in style.tsx.',
        '- Keep route wrappers lean (<40 lines); avoid putting page JSX inside src/app wrappers.',
        '- Dynamic routes (/services/[slug], /service-area/[slug], /blog/[slug]) must handle generateStaticParams, metadata, canonical lookup, and notFound().',
        '- Preserve the custom 404 split: src/app/not-found.tsx, src/app/not-found/content.ts, src/app/not-found/style.tsx, and src/page/not-found.tsx.',
      ].join('\n'),
    };
    process.stdout.write(JSON.stringify(response) + '\n');
  }

  process.exit(0);
}

main();
