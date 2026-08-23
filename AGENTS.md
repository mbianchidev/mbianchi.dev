# AGENTS.md

## Project

- This is a statically exported personal portfolio built with Next.js 15.5, React 19, and strict TypeScript.
- The application uses the App Router and deploys to Vercel. `npm run build` writes the static site to `out/`.
- `PRODUCT.md` defines the product direction, voice, audience, and accessibility goals. Keep `README.md` aligned with setup, architecture, and deployment changes.
- Use Node.js 20 and npm to match `.github/workflows/ci.yml`.

## Commands

| Task | Command |
| --- | --- |
| Install exact dependencies | `npm ci` |
| Start development server | `npm run dev` |
| Lint and type-check | `npm run lint` |
| Run Playwright tests | `npm run test:playwright` |
| Build and validate static export | `npm run build` |
| Preview the export | `npx serve out` |
| Regenerate optimized portraits | `npm run images:optimize` |

Playwright starts the development server at `http://localhost:3000` automatically. Install Chromium with `npx playwright install chromium` if it is unavailable locally.

## Repository map

- `src/app/`: App Router pages, layouts, metadata routes, and route-specific CSS Modules.
- `src/components/`: Shared server and client components.
- `src/data/`: Structured project, customer, link, and redirect data.
- `src/lib/`: Markdown, metadata, and SEO helpers.
- `content/blog/`: Markdown posts with front matter.
- `public/`: Static images, brand assets, icons, and downloadable files.
- `tests/pages.spec.ts`: Playwright route, interaction, accessibility, metadata, redirect, and security-header coverage.
- `scripts/`: Image optimization and static redirect validation.
- `vercel.json`: Production response headers and Content Security Policy.

## Design and content system

Treat the existing components and CSS tokens as the implementation source of truth. Preserve these design invariants when changing or adding UI.

### Creative direction

- The creative north star is **"The Human Release Candidate"**: a high-performance product launch for a human, expressed through a black anodized chassis, fluorescent QA signals, engineering reports, and self-aware release notes.
- Satire earns attention; inspectable open-source, speaking, delivery, and customer evidence earns credibility. Every joke should reveal useful information.
- Use one dominant visual idea per section. Prefer asymmetric manifests, ledgers, consoles, and full-width records over repeated equal card grids.
- Inner routes share the `PageHero` shell, then need route-specific body structures rather than template repetition.
- Do not drift into a generic SaaS landing page, conventional corporate resume, chaotic meme site, or serious enterprise consultancy.

### Visual language

- **Launch Black `#0A0A0B`** is the chassis, **Electric Cyan `#00D9FF`** means attention or action, **Proof Green `#00FF94`** means verified evidence or success, and **Signal White `#FFFFFF`** is the specification and reading surface.
- Follow the two-signal rule: cyan and green have distinct meanings and should not be combined merely for decoration.
- At most one cyan-drenched section should interrupt the dark page rhythm.
- Use Archivo Black for oversized display statements and Public Sans for readable body copy. Display type carries one sharp idea, not paragraphs, fake metrics, or vague claims.
- Keep body copy near a 65-70 character measure. Monospace or code-like styling is reserved for real system keys and states.
- Depth is structural: allow only one deeply elevated chassis or console per viewport. Ordinary records stay flat and use full one-pixel borders.
- Use approximately `16px` radii for major surfaces, `12px` for media, and `8px` to `10px` for controls.
- Never add gradient text, glassmorphism, colored side-stripe borders, nested cards, or the standard hero-plus-metrics template.

### Components and interaction

- Primary actions use Electric Cyan with Launch Black text; Proof Green is reserved for a confirmed hover or success response. Secondary actions use a dark panel with a complete visible border.
- Homepage primary actions should be at least `52px` tall. Interactive movement should stay within two to five pixels.
- Pills and chips are static technology metadata, not disguised controls.
- Essential claims, links, and default interactive results must exist in server-rendered HTML.
- Motion should be short and purposeful: scan, pulse, state shift, or tactile response. Remove it under reduced motion without removing information.
- Interactive business logic uses stable IDs, never display labels as keys. Native controls must expose state with appropriate elements and ARIA attributes.
- The mobile navigation toggle and CTA must render in static HTML; preserve `aria-expanded`, `aria-controls`, Escape dismissal, and keyboard access.

### Route and brand contracts

- Navigation calls the capability manifest **Features** and the operating-environment inventory **Integrations**. The interactive compatibility lab remains a separate experience.
- Proof Green may feature creator-owned evidence. Third-party star totals must be labeled as project signal and never presented as Matteo's contribution.
- Blog posts, changelog entries, upstream contributions, roles, and deployments use full-width bordered records. Use years only where chronology carries meaning.
- Long-form and legal pages use Signal White with Launch Black text, a `760px` to `820px` reading measure, generous line height, and horizontally scrollable code or tables.
- Pricing controls use stable IDs, labeled inputs, `aria-pressed` presets, and an `output` element for the live quote.
- Company marks stay local and load before marquee motion. They are grayscale at rest, reveal brand color on hover, pause during pointer inspection, and become manually scrollable when reduced motion is enabled. Copy must not imply endorsement.
- Preserve the Duck Runtime identity. Approved editable assets are in `src/assets/brand/`; exported assets are in `public/brand/`, `public/icons/`, and `src/app/`.
- Keep the full lockup at least `132px` wide and the compact mark at least `24px`. Below `32px`, use the simplified mark without the wing waveform.
- Do not outline, rotate, recolor individual parts, add gradients, turn the duck yellow, separate the eye, or use detailed artwork at favicon scale.

## Implementation conventions

- Prefer Server Components. Add `'use client'` only for browser APIs, effects, or interactive state.
- Use the `@/*` alias for imports from `src/`.
- Reuse shared components and existing CSS Modules before adding new abstractions or styles.
- Keep public routes compatible with `output: 'export'`; do not introduce runtime server dependencies.
- Use `createPageMetadata` from `src/lib/siteMetadata.ts` for canonical metadata.
- Keep essential content available in the initial HTML. Client-side interaction should enhance content, not unlock it.
- Preserve WCAG 2.2 AA behavior: semantic HTML, keyboard access, visible focus, meaningful labels, sufficient contrast, and reduced-motion support.
- Use `next/link` for internal navigation. External links opened in a new tab must use `rel="noopener noreferrer"`.
- Prefer structured data changes in `src/data/` over duplicating content inside components.
- Keep redirect declarations in `src/data/redirects.json` and their static fallback pages synchronized. The build validates this contract.
- Blog posts belong in `content/blog/` and require `title`, `date`, `author`, `category`, and `excerpt` front matter.
- Keep new blog tests data-driven and archive-wide. Never add tests tied to one post's slug, title, metadata, or content.
- If a new external origin is required, update the relevant directive in `vercel.json` instead of weakening the whole CSP.
- Do not commit generated `.next/`, `out/`, `playwright-report/`, `test-results/`, or `tests/screenshots/` files.

## Validation

Run the same checks as CI before opening a pull request:

```bash
npm run lint
npm run test:playwright
npm run build
```

For visual changes, inspect affected routes at mobile and desktop widths and confirm keyboard and reduced-motion behavior. Use `[feature] <description>` or `[fix] <description>` for pull request titles.
