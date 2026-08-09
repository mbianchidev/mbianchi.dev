# Blog Content

This directory contains blog posts written in Markdown format. Each blog post is a separate `.md` file.

## File Structure

Each blog post should be named using kebab-case (lowercase with hyphens), which will become the URL slug.
Files whose names start with `_` are templates or drafts and are never published.

Example:
- File: `my-awesome-post.md`
- URL: `/blog/my-awesome-post`

Copy `_template.md` when starting a post, then rename the copy without the
leading underscore to publish it.

## Frontmatter Format

Each blog post must include frontmatter at the top with the following fields:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
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
- **date**: Publication date in YYYY-MM-DD format
- **author**: Use `Matteo Bianchi` for every post
- **category**: Post category (e.g., "Cloud Native", "Kubernetes", "Security")
- **image**: A local image under `public/images/blog/`, referenced from `/images/blog/`, or a built-in image key (`profile` or `brand`)
- **imageAlt**: Concise alternative text describing the selected social preview image
- **excerpt**: A short summary (1-2 sentences) displayed on the blog listing page

### Optional Fields

- **readTime**: Reading time estimate (e.g., "5 min read"). If not provided, it will be calculated automatically.
- **updated**: Last substantial update date in YYYY-MM-DD format. When present, it is published as the article modification time.
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
emitted social URL is absolute and production-safe. Supported formats are AVIF,
JPEG, PNG, and WebP. Remote URLs and paths outside `public/` are rejected, and
missing or invalid images fail loudly. Relative repository paths remain
supported for migrated content and are exported to `public/blog-social-images/`.

## Markdown Support

You can use full Markdown syntax including:

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
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
![Alt text](image-url.jpg)
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

The in-site archive currently contains the 27 English-language posts published
from **I don’t like ChatGPT.** on December 23, 2022 through the latest post.
Italian-language posts are intentionally excluded.
