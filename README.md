# Matteo: the human platform

![License](https://img.shields.io/github/license/mbianchidev/mbianchi.dev)

A personal portfolio disguised as an overconfident startup launch. The
"product" is Matteo Bianchi; the engineering work, open-source contributions,
talks, and delivery history behind it are real.

**Live site:** [mbianchi.dev](https://mbianchi.dev)

Built with Next.js 15.5 App Router, React 19, strict TypeScript, and CSS Modules.
Pages are pre-rendered at build time and exported to `out/`. There is no
production Next.js server.

## What is implemented

- **Portfolio and evidence:** a capability manifest, local technology marks,
  and an animated logo runway. `/open-source/`, `/customers/`,
  and `/roadmap/` connect project claims to source code and career history.
- **Searchable content:** a Markdown blog at `/blog/`, plus department and
  location filters at `/careers/` and data-driven role pages at `/job/[slug]/`.
- **Interactive tools:** compatibility diagnostics and a rate-by-hours quote
  calculator at `/pricing/`, with labeled controls and useful initial HTML.
- **Public links and previews:** a configurable `/links/` page, short-link
  fallbacks, a downloadable resume, canonical metadata, sitemap, robots rules,
  local social covers, and responsive AVIF/WebP portraits with a JPEG fallback.
- **Fictional status dashboard:** `/status/` includes seeded incidents,
  postmortems, simulated current component states, and calculated availability.
  It is not connected to a monitoring service.

The shared shell includes keyboard navigation, visible focus, a skip link, and
reduced-motion behavior. Accessibility is a design goal, not a certification.

## Quick start

### Prerequisites

- **Node.js 20, at least 20.9.0**, and **npm**. CI uses Node.js 20 on Ubuntu;
  the locked Sharp dependency requires Node.js 20.9.0 or newer.
- Git to clone the repository.
- Network access for npm packages and the Google Fonts fetched by
  `next/font/google` during development/build. The resulting fonts are
  self-hosted in the built site.

No database, container runtime, API key, or `.env` file is required for the
default local setup. Use npm and the committed `package-lock.json`.

```bash
git clone https://github.com/mbianchidev/mbianchi.dev.git
cd mbianchi.dev
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the portfolio
homepage; `/blog/`, `/careers/`, `/pricing/`, and `/status/` are useful routes to
explore next.

`npm run dev` validates blog images, clears stale `.next/` output, and starts
Next.js. Native install-script approvals in `package.json` are version-specific;
review those entries when updating the corresponding dependencies.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Regenerate blog image metadata, clear `.next/`, and start development |
| `npm run blog:images` | Validate local blog covers and generate their social image manifest |
| `npm run lint` | Run ESLint |
| `npm audit` | Audit the full dependency tree, including development dependencies |
| `npm run test:playwright` | Run route, interaction, metadata, responsive, and status tests |
| `npm run test:screenshots` | Run the same Playwright suite in headed mode |
| `npm run build` | Generate blog image metadata, build/type-check the static site, and validate exported redirects and the resume PDF |
| `npm run images:optimize` | Regenerate AVIF/WebP portraits from `public/images/matteo-kcd-denmark.jpg` |
| `npx serve out` | Preview a completed static export |

### Checks used by CI

After installing dependencies, install Chromium once and run:

```bash
npx playwright install chromium
npm run lint
npm run test:playwright
npm run build
```

On Linux, use `npx playwright install --with-deps chromium` to install the
browser's system dependencies as CI does. Playwright starts a development server
at `http://localhost:3000` automatically and can reuse an existing one outside
CI. Browser coverage currently targets Chromium only.

ESLint is not a standalone TypeScript check; Next.js checks types during the
build. Stop the development server before building, and do not run development,
browser tests, and production builds concurrently against the same `.next/`.

## Static export and deployment

```bash
npm run build
npx serve out
```

A successful build produces `out/index.html`, exported route directories, and
static assets. The final validation step checks every declared short link and
the exported resume PDF.

**Do not use `npm run start` for this project.** That script invokes `next start`,
which cannot serve an `output: 'export'` build. Serve `out/` with a static host
instead.

### Vercel

The production origin is `https://mbianchi.dev`. Connect the repository to a
Vercel project with `npm run build` as the build command and `out` as the output
directory. Use the Git integration for pull-request previews and production
deployments from `main`, then configure the domain and DNS with Vercel's values.

[GitHub Actions](.github/workflows/ci.yml) validates changes; the workflow does
not deploy the site. [vercel.json](vercel.json) configures the production CSP,
browser security headers, and asset caching. Other static hosts do not apply
that file automatically and need equivalent host configuration.

Vercel Web Analytics and Speed Insights are mounted in `src/app/layout.tsx`.
Collection depends on the Vercel deployment configuration. The site's
[`/privacy/`](https://mbianchi.dev/privacy/) and
[`/cookies/`](https://mbianchi.dev/cookies/) pages describe these data flows.

## Content and configuration

Most content changes belong in structured data, not duplicated component copy.
Rebuild the export after changing content or configuration.

| What to change | Source |
| --- | --- |
| Site identity and production origin | [src/lib/siteConfig.ts](src/lib/siteConfig.ts) |
| Canonical URLs and social metadata helpers | [src/lib/siteMetadata.ts](src/lib/siteMetadata.ts) |
| Public profile and `/links/` destinations | [src/data/links.ts](src/data/links.ts) |
| Open-source evidence | [src/data/projects.json](src/data/projects.json) |
| Customer history and local logo mapping | [src/data/customers.json](src/data/customers.json), [src/data/customerLogos.ts](src/data/customerLogos.ts) |
| Career roles, departments, and locations | [src/data/jobs.ts](src/data/jobs.ts) |
| Integration inventory | [src/data/integrations.ts](src/data/integrations.ts) |
| Short links | [src/data/redirects.json](src/data/redirects.json) and matching App Router pages |
| Fictional components and incident catalogue | [src/data/status.ts](src/data/status.ts) |
| Shared social image catalogue | [src/data/socialImages.json](src/data/socialImages.json) |

`NEXT_BASE_PATH` optionally sets a build-time mount prefix in `next.config.js`.
It does not change the production origin, canonical URLs, or external
destinations. Root deployment on `mbianchi.dev` is the default; review those
values before publishing a fork or mounting the site elsewhere.

`package.json` overrides Next.js's pinned PostCSS with patched PostCSS 8.5.25.
Keep that override until the selected Next.js line depends on PostCSS 8.5.10
or newer.

Two scoped overrides remove legacy dependency chains without changing the
framework major. The Next lint plugin's `fast-glob` import resolves to a local
`tinyglobby` adapter in `scripts/next-lint-glob/`. It preserves the plugin's
`globSync` contract without recursively expanding literal directory patterns.
Remove that adapter when the upstream plugin no longer needs the vulnerable
glob chain. `gray-matter` uses `js-yaml` 4 with the explicit engine in
`src/lib/frontMatter.js`; its default engine calls the removed `safeLoad` API.
Keep Markdown loading and image generation on that shared helper.
[Compatibility tests](tests/dependencies.spec.ts) cover metadata parsing and
the lint plugin's directory-glob behavior.

### Blog posts

Start from [content/blog/_template.md](content/blog/_template.md). A Markdown
filename becomes its `/blog/[slug]/` URL; files prefixed with `_` are drafts or
templates and are not published.

Required front matter: `title`, `date`, `author`, `category`, `excerpt`, `image`,
and `imageAlt`. Use a local cover under `public/images/blog/` or a supported
catalogue key. The same image appears in the archive and social previews.
Development, tests, and builds validate covers before Next.js starts; missing
or invalid images fail the command.

See the [blog content guide](content/blog/README.md) for date formats, optional
edit timestamps, tags, supported image formats, and migration rules. Markdown
is trusted repository-authored content, not an untrusted upload interface.

### Public links

Add an item to `linksPageConfig.links` in `src/data/links.ts`:

```ts
{
  service: 'Service name',
  title: 'Visible link title',
  description: 'One-line description',
  href: 'https://example.com',
  icon: 'github',
}
```

Built-in icons are `mentor`, `youtube`, and `github`. For another icon, extend
`PublicLinkIcon` and add its SVG case to `LinkIcon` in `src/app/links/page.tsx`.

### Short links

Keep `src/data/redirects.json` synchronized with the matching
`src/app/<short-link>/page.tsx` pages that render `ShortLinkPage`.
`next.config.js` uses the declarations during development, but Next.js redirects
are not exported as static HTTP redirects. The exported pages navigate with
JavaScript and retain a normal destination link without JavaScript.

The Next.js export warning about redirects is expected; `npm run build`
validates the static fallbacks separately. If a host-level HTTP redirect is
required, configure it on the hosting platform as well.

## Status simulation

`src/data/status.ts` defines the catalogue; `src/lib/status.ts` generates the
seeded UTC calendar. Keep incident IDs and schedule groups stable so copy edits
do not move existing incidents. Technical scenarios cover service mesh, cache,
CDN, Kubernetes, DNS, storage, and node failures, each with a fictional
postmortem. Short human incidents have independent schedules; longer component
incidents rotate with 47-65 day spacing and a 90-day cooldown per incident type.

Availability uses the preceding **90 complete UTC days**, excluding today.
Critical time counts as 100% downtime, degraded time as 50%, and overlapping
incidents count once at the worst severity. Component totals, overall
availability, and three historical 90-day periods share that calculation.
The schedule and incident budgets keep calculated availability between 97.5%
and 99.8% without clamping percentages.

Timelines add a separate bar for today containing only elapsed incidents,
including resolved ones; it never changes the completed-day percentage.
While the page is visible, JavaScript refreshes current badges and reports
every minute and advances the historical window at midnight UTC. Only active
incidents affect current badges, critical takes priority over degraded, and
reports reveal only updates whose timestamps have occurred.

The exported HTML contains a build-time snapshot. Without JavaScript it stays
at that snapshot rather than becoming a live monitor.

Expand history counts to inspect a period's incidents. Hover or tap a timeline
day to inspect downtime and related incidents. Each timeline is one keyboard
stop: arrow keys inspect incident days, Home/End jump to the first/last, and
Escape dismisses the preview. The model's invariants are covered in
[tests/status.spec.ts](tests/status.spec.ts).

## Repository layout

```text
src/app/           App Router pages, layouts, metadata routes, and route styles
src/components/    Shared server and interactive client components
src/data/          Structured portfolio content and redirect declarations
src/lib/           Markdown, metadata, social image, and status helpers
src/assets/        Imported portraits and editable brand assets
content/blog/      Markdown posts, template, and authoring guide
public/            Static images, company marks, icons, and downloads
scripts/           Image generation and static-export validation
tests/             Playwright browser coverage and status-model tests
```

The application was migrated from static HTML/CSS/JavaScript to React and
Next.js, while retaining static hosting and useful no-JavaScript content.

## Scope and limitations

- This is a portfolio, not a SaaS backend. Pricing is an estimate calculator;
  there is no checkout, account system, or job-application service. The careers
  pages describe roles Matteo is looking for, not vacancies at a startup.
- `/docs/` and `/press/` currently provide curated resource links rather than
  finished documentation or a media kit. `/support/` is a contact directory,
  not a ticketing system.
- The status page is fiction, not uptime telemetry. Company marks do not imply
  endorsement, and the compliance ledger does not claim certification.
- Static content and routes update through rebuilds. Filtering, quote changes,
  and status refreshes enhance the initial HTML with browser JavaScript.

## Project policies and documentation

This is a personal project. [CONTRIBUTING.md](CONTRIBUTING.md) currently states
that contributions are not accepted; [SUPPORT.md](SUPPORT.md) states that no
support is provided.

See the [Code of Conduct](CODE_OF_CONDUCT.md), use
[SECURITY.md](SECURITY.md) for private security reports, and read
[AGENTS.md](AGENTS.md) for repository implementation conventions.

## License and acknowledgments

The software is released under [The Unlicense](LICENSE), a public-domain
dedication with no warranty.

The startup language is parody, inspired by Y Combinator launches, familiar
SaaS design patterns, and the industry's love of buzzwords. It is not intended
to mock a specific company.
