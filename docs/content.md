# Content and configuration

[Documentation index](README.md) · [Development](development.md) ·
[Status simulation](status.md)

Most content changes belong in structured data, not duplicated component copy.
Rebuild the export after changing content or configuration.

| What to change | Source |
| --- | --- |
| Site identity, production origin, and blog source repository | [src/lib/siteConfig.ts](../src/lib/siteConfig.ts) |
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
templates and stay out of the public archive and sitemap.

Required front matter: `title`, `date`, `author`, `category`, `excerpt`, `image`,
and `imageAlt`. Use a local WebP cover under `public/images/blog/`.
The same image appears in the archive and social previews. Development, tests,
and builds validate published covers before Next.js starts; missing or invalid
images fail the command.

The [blog authoring guide](../content/blog/README.md) defines date formats,
optional edit timestamps, tags, supported image formats, and migration rules.
Markdown is trusted repository-authored content, not an untrusted upload
interface. The shared YAML parser is described in
[dependency maintenance](development.md#dependency-maintenance).

### Blog images

Store cover and body images as WebP under `public/images/blog/` and reference
them from `/images/blog/`. Do not include `/public/` in browser URLs.

After adding a post with remote images or local PNG/JPEG/GIF sources, run:

```bash
npm run blog:images:optimize
```

The importer processes published posts and drafts, excluding the authoring
guide and template examples. It downloads HTTPS image sources, creates local
WebP assets, and updates only image destinations in Markdown and front matter.
Shared cover keys are copied into blog-local WebP assets without changing the
site-wide catalogue.

PNG and GIF conversion is lossless; JPEG conversion uses quality 85. Display
dimensions, animation content, timing, loops, alt text, captions, and non-image
content are preserved. Remote images receive stable URL-derived filenames under
`public/images/blog/body/`; rerunning the command reuses imported assets.

Original local files are not deleted. Check the changed references and remove
originals only when nothing else uses them. Commit the WebP files with the
Markdown changes. The importer refuses to overwrite a different destination or
a post edited while conversion was running.

This is an explicit authoring command, not part of development, testing, or
build startup. Rendering blog images does not contact the original image hosts.
The [authoring guide](../content/blog/README.md#headings) also explains explicit
section IDs for table-of-contents links.

### Draft previews

Keep the leading underscore while writing. `_my-post.md` is available at
`/blog/draft/my-post/` after rebuilding, including for files with unfinished
publication dates or cover images. Every underscore-prefixed Markdown file has
a preview, including the template. Previews only require `title` and `excerpt`
front matter and use the same Markdown renderer and article styles as public
posts.

Enter the shared password configured in
[`BlogDraftGate.tsx`](../src/app/blog/draft/BlogDraftGate.tsx) to render the
article. A reload locks it again. The gate requires JavaScript and stores no
cookie or browser-storage state.

Draft routes have only a generic preview title and `noindex, nofollow`; they
generate no post-specific SEO, canonical, social, or structured metadata and no
social images. They are not linked from the public archive or added to the
sitemap, and `/blog/_my-post/` does not publish an alternate copy.

This is a convenience gate, not authentication. The password and draft content
are shipped to the browser in the static export, and the source is public.
Do not use it for confidential material. Remove the filename's leading
underscore and complete the required publication front matter to publish.

### Corrections and publishing PRs

Published articles include a **Propose a fix** link to that post's source in
GitHub's editor. It works without JavaScript. Readers sign in to GitHub and
propose a change through a branch or fork and pull request. Repository and
branch destinations are configured in
[`siteConfig.repository`](../src/lib/siteConfig.ts).

Unlocked draft previews include **Publish draft**, protected by a separate
shared password in
[`DraftPublishAction.tsx`](../src/app/blog/draft/DraftPublishAction.tsx).
**Prepare publishing PR** creates copyable and downloadable Markdown with both
`date` and `updated` set to the current UTC date at preparation time. Other
front matter, comments, and the Markdown body are preserved. Reloading or
closing the publishing controls requires the publishing password again.

Copy or download the prepared Markdown, open the GitHub editor, remove the
filename's leading underscore, and replace the contents. Review any unfinished
cover-image or other placeholders, commit to a new branch, and open a pull
request. Do not commit directly to `main`.

This is deliberately a manual GitHub handoff. The static site has no GitHub
token or publishing backend, cannot create a PR itself, and never commits,
publishes, or merges anything automatically. Clipboard failures are reported
with the download link retained as a fallback.

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
