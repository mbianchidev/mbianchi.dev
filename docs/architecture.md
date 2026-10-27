# Architecture and scope

[Documentation index](README.md) · [Development](development.md) ·
[Content and configuration](content.md)

## How it works

Next.js 16.4 App Router and React 19.3 pre-render local Markdown posts, structured
portfolio data, and static routes into `out/`. Builds retain Webpack for accurate
static AVIF image metadata. Shared Server Components provide the initial content;
client components enhance it with search, filtering, diagnostics, pagination,
quotes, and simulated status updates.

The application was migrated from static HTML/CSS/JavaScript to React and
Next.js while retaining static hosting and useful no-JavaScript content.
Production does not require a Next.js server.

## Repository layout

```text
src/app/           App Router pages, layouts, metadata routes, and route styles
src/components/    Shared server and interactive client components
src/data/          Structured portfolio content and redirect declarations
src/lib/           Markdown, metadata, social image, and status helpers
src/assets/        Imported portraits and editable brand assets
content/blog/      Markdown posts, template, and authoring guide
public/            Static images, company marks, icons, and downloads
scripts/           Image generation, lint compatibility, and export validation
tests/             Browser, dependency-compatibility, and status-model tests
docs/              Maintainer guides and intentional README screenshots
```

## Scope and limitations

- This is a portfolio, not a SaaS backend. Pricing is an estimate calculator;
  there is no checkout, account system, or job-application service. The careers
  pages describe roles Matteo is looking for, not vacancies at a startup.
- `/docs/` and `/press/` currently provide curated resource links rather than
  finished product documentation or a media kit. The repository's `docs/`
  directory is separate from that public route. `/support/` is a contact
  directory, not a ticketing system.
- The status page is fiction, not uptime telemetry. Company marks do not imply
  endorsement, and the compliance ledger does not claim certification.
- Static content and routes update through rebuilds. Filtering, quote changes,
  and status refreshes enhance the initial HTML with browser JavaScript.
- Blog draft previews intentionally render their articles only after a
  browser-side password check. This is a casual access gate, not authentication;
  the static payload and public source remain inspectable. See
  [draft previews](content.md#draft-previews).
- Blog correction links and draft publishing preparation hand off to GitHub's
  editor. Publishing uses a separate browser-side password, prepares the rename
  and current UTC dates, and leaves branch creation and PR submission to the
  reader. No GitHub token, server endpoint, automatic commit, or merge is used.
- Browser automation targets Chromium, not every browser or assistive
  technology. See [accessibility guidance](../ACCESSIBILITY.md) for the remaining
  manual verification.
