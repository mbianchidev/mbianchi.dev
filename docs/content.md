# Content and configuration

[Documentation index](README.md) · [Development](development.md) ·
[Status simulation](status.md)

Most content changes belong in structured data, not duplicated component copy.
Rebuild the export after changing content or configuration.

| What to change | Source |
| --- | --- |
| Site identity and production origin | [src/lib/siteConfig.ts](../src/lib/siteConfig.ts) |
| Canonical URLs and social metadata helpers | [src/lib/siteMetadata.ts](../src/lib/siteMetadata.ts) |
| Public profile and `/links/` destinations | [src/data/links.ts](../src/data/links.ts) |
| Open-source evidence | [src/data/projects.json](../src/data/projects.json) |
| Customer history and local logo mapping | [src/data/customers.json](../src/data/customers.json), [src/data/customerLogos.ts](../src/data/customerLogos.ts) |
| Career roles, departments, and locations | [src/data/jobs.ts](../src/data/jobs.ts) |
| Integration inventory | [src/data/integrations.ts](../src/data/integrations.ts) |
| Short links | [src/data/redirects.json](../src/data/redirects.json) and matching App Router pages |
| Fictional components and incident catalogue | [src/data/status.ts](../src/data/status.ts) |
| Shared social image catalogue | [src/data/socialImages.json](../src/data/socialImages.json) |

## Base path

`NEXT_BASE_PATH` optionally sets a build-time mount prefix in
[`next.config.js`](../next.config.js). An unset, empty, or `/` value uses the site
root; a value such as `/portfolio` supplies a prefix.

It does not change the production origin, canonical URLs, or external
destinations. Root deployment on `mbianchi.dev` is the default. Review those
values and asset paths before publishing a fork or mounting the site elsewhere;
this is not a general hosting migration switch.

## Blog posts

Start from [content/blog/_template.md](../content/blog/_template.md). A Markdown
filename becomes its `/blog/[slug]/` URL; files prefixed with `_` are drafts or
templates and are not published.

Required front matter: `title`, `date`, `author`, `category`, `excerpt`, `image`,
and `imageAlt`. Use a local cover under `public/images/blog/` or a supported
catalogue key. The same image appears in the archive and social previews.
Development, tests, and builds validate covers before Next.js starts; missing
or invalid images fail the command.

The [blog authoring guide](../content/blog/README.md) defines date formats,
optional edit timestamps, tags, supported image formats, and migration rules.
Markdown is trusted repository-authored content, not an untrusted upload
interface. The shared YAML parser is described in
[dependency maintenance](development.md#dependency-maintenance).

## Public links

Add an item to `linksPageConfig.links` in
[`src/data/links.ts`](../src/data/links.ts):

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
`PublicLinkIcon` and add its SVG case to `LinkIcon` in
[`src/app/links/page.tsx`](../src/app/links/page.tsx).

## Short links

Keep [`src/data/redirects.json`](../src/data/redirects.json) synchronized with
the matching `src/app/<short-link>/page.tsx` pages that render `ShortLinkPage`.
`next.config.js` uses the declarations during development, but Next.js redirects
are not exported as static HTTP redirects.

The exported pages navigate with JavaScript and retain a normal destination
link without JavaScript. The export warning about redirects is expected;
`npm run build` validates the static fallbacks separately. Configure the hosting
platform too when a host-level HTTP redirect is required.
