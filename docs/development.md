# Development and deployment

[Documentation index](README.md) · [Content](content.md) ·
[Architecture](architecture.md)

## Local setup

Use Node.js 26.12.1 from [`.nvmrc`](../.nvmrc) and npm with the committed
[`package-lock.json`](../package-lock.json). CI reads the same version file on
Ubuntu; local validation also runs on macOS. With nvm installed, run
`nvm install && nvm use` at the repository root.

Follow the [quick start](../README.md#quick-start). There is no database,
container runtime, API key, or `.env` requirement for the default setup.
`next/font/google` downloads fonts during development/build, so those steps need
network access. The built site self-hosts the resulting font files.

`npm run dev` validates blog images and starts Next.js. Next.js 16 separates
development output in `.next/dev/` from production output in `.next/` and uses
locks to prevent duplicate dev servers or builds in the same checkout. Startup
no longer deletes the production output or compiler caches.
`agentRules: false` keeps `next dev` from rewriting the repository-maintained
[`AGENTS.md`](../AGENTS.md).

### Runtime and framework compatibility

The site uses Next.js 16.4.3 and React/React DOM 19.3.1. Development and production
builds explicitly use `--webpack` to preserve the existing image pipeline.
Turbopack currently reports 100px widths for every static AVIF portrait import,
which breaks the responsive source sets. Keep Webpack until Turbopack supports
accurate AVIF metadata. Dynamic route parameters already use the required
asynchronous API, and production remains a static export.

The package engine preserves Next.js's Node.js 20.9.0 minimum rather than
requiring Node 26 everywhere. Use a maintained Node release. Vercel currently
offers Node 24.x and 22.x, not Node 26; select 24.x for hosted builds. The broad
engine range permits that deployment runtime while CI and local development
use the current stable Node release pinned in `.nvmrc`.

ESLint imports Next.js's native flat configuration. Run `npm run lint`
explicitly: Next.js 16 no longer runs ESLint during `next build`. The root
layout opts into Next.js's smooth-scroll handling so client navigation still
resets the viewport while in-page anchors retain smooth scrolling.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the exact locked dependency tree |
| `npm run dev` | Generate blog image metadata and start Webpack development |
| `npm run blog:images` | Validate local blog covers and generate their social image manifest |
| `npm run lint` | Run ESLint |
| `npm audit` | Audit the full dependency tree, including development dependencies |
| `npm run test:playwright` | Run route, interaction, metadata, responsive, and status tests |
| `npm run test:screenshots` | Run the same Playwright suite in headed mode |
| `npm run build` | Generate blog image metadata, build/type-check, and validate the export |
| `npm run images:optimize` | Regenerate AVIF/WebP portraits from `public/images/matteo-kcd-denmark.jpg` |
| `npx serve out` | Preview a completed static export |

## Checks used by CI

After installing dependencies, install Chromium once and run:

```bash
npx playwright install chromium
npm run lint
npm run test:playwright
npm run build
```

On Linux, use `npx playwright install --with-deps chromium` for the browser's
system dependencies, as [CI](../.github/workflows/ci.yml) does. Playwright starts
a development server at `http://localhost:3000` and can reuse an existing one
outside CI. Avoid running the tests against an unrelated server on that port.

CI keeps the `Lint, test, and build` check on pull requests, including drafts
and subsequent pushes, and on pushes to `main`. It uses two Playwright workers
on the public Ubuntu runner and installs only Chromium's headless shell with
`npx playwright install --with-deps --only-shell chromium`. Headed local tests
still need the full `npx playwright install chromium` installation. The workflow
logs CPU and memory capacity alongside the test run.

The workflow pins its setup actions to reviewed release commits. The locked
install, lint, complete test suite, blog image generation, build/type check,
and static redirect validation all remain in the same serial job.

Browser coverage currently targets Chromium only. ESLint is not a standalone
TypeScript check; Next.js checks types during the build. Tests cover routes,
interaction, metadata, responsive layouts, and status calculations, but are not
a complete accessibility audit. Use synthetic fixtures for new tests, not
private or customer data.

Keep `.next/`, `out/`, `playwright-report/`, `test-results/`, and
`tests/screenshots/` out of commits. The README's intentional screenshot lives
in `docs/assets/`, not the generated test screenshot directory.

## Static export and deployment

```bash
npm run build
npx serve out
```

The build writes `out/index.html`, exported route directories, and static assets.
Its final validation checks every declared short link and the exported resume
PDF. Static content changes require a rebuild.

**Do not use `npm run start`.** It invokes `next start`, which cannot serve an
`output: 'export'` build. Use a static host instead.

Next.js's export warning about redirects is expected. The build separately
checks the static [short-link fallback pages](content.md#short-links); configure
HTTP redirects on the host when those are required.

### Vercel

The production origin is `https://mbianchi.dev`. Connect the repository to a
Vercel project with `npm run build` as its build command and `out` as its output
directory. Use the Git integration for pull-request previews and production
deployments from `main`, then configure the domain and DNS with Vercel's values.

GitHub Actions validates changes; it does not deploy the site.
[`vercel.json`](../vercel.json) configures the production CSP, browser security
headers, and asset caching. Other static hosts do not apply that file
automatically and need equivalent configuration.

Vercel Web Analytics and Speed Insights are mounted in
[`src/app/layout.tsx`](../src/app/layout.tsx). Collection depends on the Vercel
deployment configuration. The site's
[`/privacy/`](https://mbianchi.dev/privacy/) and
[`/cookies/`](https://mbianchi.dev/cookies/) pages describe these data flows.

## Dependency maintenance

Use `npm audit` to check the complete tree, not only production dependencies.
Native install-script approvals in [`package.json`](../package.json) are
version-specific; review them when updating the corresponding packages rather
than enabling every script.

The PostCSS override keeps the parser on patched PostCSS 8.5.25 while Next.js
declares 8.5.23. Review upstream dependencies and current advisories before
removing it.

Two scoped overrides retain compatibility with patched dependencies:

- The Next lint plugin's `fast-glob` import resolves to the local `tinyglobby`
  adapter in [`scripts/next-lint-glob/`](../scripts/next-lint-glob/). It preserves
  `globSync` without recursively expanding literal directory patterns. Remove
  it when the upstream plugin no longer needs the vulnerable glob chain.
- `gray-matter` uses `js-yaml` 4 with the explicit engine in
  [`src/lib/frontMatter.js`](../src/lib/frontMatter.js). Its default engine calls
  the removed `safeLoad` API. Keep Markdown loading and image generation on the
  shared helper.

[`tests/dependencies.spec.ts`](../tests/dependencies.spec.ts) protects metadata
parsing and the lint plugin's directory-glob behavior.

Draft publication preparation uses `yaml`'s document editor in
[`src/lib/blogContributions.ts`](../src/lib/blogContributions.ts) to update only
publication dates while preserving other front matter and comments. Both dates
are explicitly quoted so the shared `js-yaml` reader keeps them as strings.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Missing packages or modules | Select the Node version in `.nvmrc` and run `npm ci` at the repository root |
| Font download fails | Restore access to Google Fonts and rerun the build |
| Blog cover validation fails | Check `image`, `imageAlt`, the local file, and the [authoring rules](../content/blog/README.md) |
| Playwright cannot launch Chromium | Run `npx playwright install chromium`, or the Linux `--with-deps` variant |
| Locked or conflicting output | Stop this checkout's duplicate dev/test or build process before restarting |
| `next start` rejects the export | Build and serve `out/` with a static host |
| `/_vercel/` analytics scripts return 404 on a plain static host | Those endpoints come from Vercel, not the exported files; the portfolio still renders without analytics |
| Image sizing warnings in development | Compliance marks use fixed bounding boxes with `object-fit: contain`; inspect the rendered marks before changing their dimensions |

## Maintaining screenshots

The README image is a real capture of the local production export. Refresh it
with the existing Playwright browser after visual changes, wait for fonts and
visible images to load, and keep it free of local paths, browser chrome, or
private data. Capture meaningful content rather than a loading state, and
inspect it at desktop and mobile sizes before publishing.

## AI-assisted maintenance

You are responsible for everything you change, including AI-assisted code,
documentation, and assets. Review and test the result, and be able to explain
what it does and why it is needed. This does not change the repository's
[contribution policy](../CONTRIBUTING.md).
