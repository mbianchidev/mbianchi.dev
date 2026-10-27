# Blog Content

This directory contains blog posts written in Markdown format. Each blog post is a separate `.md` file.

## File Structure

Each blog post should be named using kebab-case (lowercase with hyphens), which will become the URL slug.
Files whose names start with `_` are templates or drafts and are never published.
They have password-gated previews at `/blog/draft/[slug]/`, without the filename's
leading underscore. See [draft previews](../../docs/content.md#draft-previews)
for the access gate and its limitations.
Published posts also link to GitHub for corrections. Drafts can prepare a
publication rename and current dates for a manually created PR; see
[corrections and publishing PRs](../../docs/content.md#corrections-and-publishing-prs).

Example:
- File: `my-awesome-post.md`
- URL: `/blog/my-awesome-post`

Copy `_template.md` when starting a post, then rename the copy without the
leading underscore to publish it.

## Frontmatter Format

Each published blog post must include frontmatter at the top with the following
fields. Draft previews only require `title` and `excerpt`; unfinished publication
dates and cover images do not block previewing the Markdown.

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DDT09:00:00+02:00"
editedAt: null
author: "Matteo Bianchi"
category: "Category Name"
image: "/images/blog/my-awesome-post.webp"
imageAlt: "A concise description of the selected cover image"
excerpt: "A brief description of your post (used in listing page)"
---

Your markdown content goes here...
```

### Required Fields

- **title**: The title of your blog post
- **date**: Publication date as `YYYY-MM-DD` or an ISO 8601 timestamp. New drafts default to `09:00:00+02:00`.
- **author**: Use `Matteo Bianchi` for every post
- **category**: Post category (e.g., "Cloud Native", "Kubernetes", "Security")
- **image**: A local WebP image under `public/images/blog/`, referenced from `/images/blog/`
- **imageAlt**: Concise alternative text describing the selected social preview image
- **excerpt**: A short summary (1-2 sentences) displayed on the blog listing page

### Optional Fields

- **readTime**: Reading time estimate (e.g., "5 min read"). If not provided, it will be calculated automatically.
- **updated**: Last substantial update date as `YYYY-MM-DD` or an ISO 8601 timestamp. When present, it is published as the article modification time.
- **editedAt**: Exact edit time as an ISO 8601 timestamp. It defaults to `null`; a timestamp is shown below the article and becomes its modification time.
- **tags**: YAML list of article tags. When omitted, the post category is used as the social metadata tag.

For a post-specific image, keep the file under `public/images/blog/` and
reference its public path:

```yaml
image: "/images/blog/my-post-cover.webp"
imageAlt: "Description of the post cover"
```

`npm run dev`, `npm run build`, and the Playwright test command validate the
image and read its dimensions before Next.js starts. The same file appears in
the `/blog` archive and in the post's Open Graph and Twitter metadata. The
emitted social URL is absolute and production-safe. Published images use WebP.
Run `npm run blog:images:optimize` to import remote or local source images and
update their references before starting development or building. It preserves
GIF animation and leaves local originals for you to remove after checking that
they are unused. See the [image workflow](../../docs/content.md#blog-images).
Missing or invalid covers fail loudly.

## Markdown Support

You can use full Markdown syntax including:

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

For table-of-contents links, give destination headings explicit HTML IDs. The
renderer preserves these IDs:

```markdown
[Section title](#section-title)

<h2 id="section-title">Section title</h2>
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
```

### Links

```markdown
[Link text](https://example.com)
```

### Images

```markdown
![Alt text](/images/blog/image-name.webp)
```

### Lists

```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

### Code Blocks

Inline code: \`code\`

Block code:
\`\`\`javascript
const example = "Hello World";
console.log(example);
\`\`\`

Supported languages: javascript, typescript, python, bash, yaml, json, dockerfile, go, and many more.

### Blockquotes

```markdown
> This is a blockquote
```

### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### Horizontal Rule

```markdown
---
```

## Example Post

See the existing posts in this directory for complete examples.

## Migration from External Blog

To migrate posts from https://blog.mb-consulting.dev/:

1. Export posts as Markdown files
2. Add the required frontmatter to each file
3. Place files in this directory
4. Build and deploy

The system will automatically:
- Generate slugs from filenames
- Calculate read times
- Sort posts by date
- Create individual post pages

The in-site archive currently contains the 28 English-language posts published
from **I don’t like ChatGPT.** on December 23, 2022 through the latest post.
Italian-language posts are intentionally excluded.
