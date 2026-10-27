import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontMatter } from '../src/lib/frontMatter';
import { getAllDraftSlugs, getSortedPostsData } from '../src/lib/markdown';
import { prepareBlogPublication } from '../src/lib/blogContributions';
import { siteConfig } from '../src/lib/siteConfig';

const publishedPosts = getSortedPostsData();
const draftSlugs = getAllDraftSlugs();
const publicationTime = new Date('2035-02-01T00:05:00.000Z');
const publicationDate = publicationTime.toISOString().slice(0, 10);

test.describe('Publication Markdown preparation', () => {
  const fixtures = [
    {
      name: 'comments and existing dates',
      source: [
        '---',
        '# Retained fixture comment',
        'title: Fixture',
        'date: "2020-01-01" # Retained date comment',
        'updated: "2020-01-02"',
        'excerpt: |',
        '  A multiline fixture.',
        'tags: [alpha, beta]',
        '---',
        '# Fixture body',
        '',
        'date: Leave body examples unchanged.',
        'updated: Leave this example unchanged too.',
        '',
      ].join('\n'),
    },
    {
      name: 'missing dates with BOM and CRLF',
      source: '\uFEFF---\r\ntitle: Fixture\r\nexcerpt: Fixture summary\r\n---\r\n# Fixture\r\n',
    },
    {
      name: 'quoted keys and multiline placeholder values',
      source: [
        '---',
        'title: Fixture',
        '"date": >',
        '  Pending publication.',
        "'updated': [pending]",
        'excerpt: Fixture summary',
        '---',
        '# Fixture',
        '',
      ].join('\n'),
    },
  ];

  for (const { name, source } of fixtures) {
    test(`preserves the rest of the source for ${name}`, () => {
      const original = parseFrontMatter(source, 'fixture.md');
      const publication = prepareBlogPublication(source, publicationTime);
      const prepared = parseFrontMatter(publication.content, 'fixture.md');

      expect(publication.date).toBe(publicationDate);
      expect(prepared.data).toEqual({
        ...original.data,
        date: publicationDate,
        updated: publicationDate,
      });
      expect(prepared.content).toBe(original.content);
      expect(publication.content.startsWith('\uFEFF')).toBe(source.startsWith('\uFEFF'));
      if (source.includes('\r\n')) {
        expect(publication.content).not.toMatch(/(?<!\r)\n/);
      }
      for (const comment of source.match(/# Retained[^\r\n]*/g) ?? []) {
        expect(publication.content).toContain(comment);
      }
    });
  }

  for (const [name, source] of [
    ['missing front matter', '# Fixture\n'],
    ['non-mapping front matter', '---\n- fixture\n---\n# Fixture\n'],
    ['malformed front matter', '---\ntags: [unfinished\n---\n# Fixture\n'],
  ]) {
    test(`reports ${name} instead of preparing invalid Markdown`, () => {
      expect(() => prepareBlogPublication(source, publicationTime)).toThrow();
    });
  }
});

test.describe('Blog contributions', () => {
  test('published correction links work without JavaScript across the archive', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      for (const post of publishedPosts) {
        await page.goto(`/blog/${post.slug}/`, { waitUntil: 'domcontentloaded' });

        const correction = page.getByRole('link', { name: 'Propose a fix' });
        await expect(correction).toHaveAttribute(
          'href',
          `${siteConfig.repository.url}/edit/${siteConfig.repository.branch}/content/blog/${post.slug}.md`
        );
        await expect(correction).toHaveAttribute('target', '_blank');
        await expect(correction).toHaveAttribute('rel', 'noopener noreferrer');
        await expect(page.getByRole('button', { name: 'Publish draft', exact: true }))
          .toHaveCount(0);
      }
    } finally {
      await context.close();
    }
  });

  for (const slug of draftSlugs) {
    test(`prepares a manually reviewed publishing PR for ${slug}`, async ({ page }) => {
      await page.clock.setFixedTime(publicationTime);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async (content: string) => {
              document.documentElement.dataset.preparedPublication = content;
            },
          },
        });
      });
      await page.goto(`/blog/draft/${slug}/`, { waitUntil: 'networkidle' });

      const publish = page.getByRole('button', { name: 'Publish draft', exact: true });
      await expect(publish).toHaveCount(0);
      await page.getByLabel('Preview password').fill('thereisnocowlevel');
      await page.getByLabel('Preview password').press('Enter');

      await expect(publish).toBeVisible();
      await expect(publish).toHaveAttribute('aria-expanded', 'false');
      await expect(page.getByLabel('Publishing password')).toBeHidden();
      await expect(page.getByRole('link', { name: 'Open GitHub editor' })).toHaveCount(0);
      await publish.focus();
      await publish.press('Enter');

      const password = page.getByLabel('Publishing password');
      await expect(publish).toHaveAttribute('aria-expanded', 'true');
      await expect(password).toBeFocused();
      await password.fill('incorrect-publishing-fixture');
      await password.press('Enter');

      const publishing = page.getByRole('region', { name: 'Draft publishing' });
      await expect(publishing.getByRole('alert')).toBeVisible();
      await expect(password).toHaveAttribute('aria-invalid', 'true');
      await expect(password).toBeFocused();
      await expect(page.getByRole('link', { name: 'Open GitHub editor' })).toHaveCount(0);

      await password.fill('420');
      await password.press('Enter');

      const ready = publishing.getByRole('heading', { level: 3 });
      await expect(ready).toBeFocused();
      const editor = page.getByRole('link', { name: 'Open GitHub editor' });
      await expect(editor).toHaveAttribute(
        'href',
        `${siteConfig.repository.url}/edit/${siteConfig.repository.branch}/content/blog/_${slug}.md`
      );
      await expect(editor).toHaveAttribute('target', '_blank');
      await expect(editor).toHaveAttribute('rel', 'noopener noreferrer');

      const download = page.getByRole('link', { name: 'Download Markdown' });
      await expect(download).toHaveAttribute('download', `${slug}.md`);
      await page.getByRole('button', { name: 'Copy Markdown', exact: true }).click();
      await expect(publishing.getByRole('status')).not.toBeEmpty();

      const copiedSource = await page.locator('html').getAttribute('data-prepared-publication');
      if (!copiedSource) {
        throw new Error('The publication Markdown was not copied');
      }

      const source = fs.readFileSync(path.join('content/blog', `_${slug}.md`), 'utf8');
      const original = parseFrontMatter(source, `_${slug}.md`);
      const prepared = parseFrontMatter(copiedSource, `${slug}.md`);
      expect(prepared.data).toEqual({
        ...original.data,
        date: publicationDate,
        updated: publicationDate,
      });
      expect(prepared.content).toBe(original.content);
      const downloadUrl = await download.getAttribute('href');
      expect(downloadUrl).toBe(
        `data:text/markdown;charset=utf-8,${encodeURIComponent(copiedSource)}`
      );

      const downloadEvent = page.waitForEvent('download');
      await download.click();
      const downloaded = await downloadEvent;
      expect(downloaded.suggestedFilename()).toBe(`${slug}.md`);
      const downloadPath = await downloaded.path();
      if (!downloadPath) {
        throw new Error('The publication Markdown was not downloaded');
      }
      expect(fs.readFileSync(downloadPath, 'utf8')).toBe(copiedSource);

      await page.evaluate(() => {
        const reportError = console.error;
        console.error = (message: unknown, ...details: unknown[]) => {
          if (
            message === 'Could not copy the prepared Markdown'
            && details[0] instanceof Error
            && details[0].message === 'Clipboard denied fixture'
          ) {
            document.documentElement.dataset.clipboardErrorReported = 'true';
            return;
          }
          reportError(message, ...details);
        };
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async () => {
              throw new Error('Clipboard denied fixture');
            },
          },
        });
      });
      await page.getByRole('button', { name: 'Copy Markdown', exact: true }).click();
      await expect(publishing.getByRole('alert')).toBeVisible();
      await expect(publishing.getByRole('status')).toBeEmpty();
      await expect(download).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-clipboard-error-reported', 'true');

      await publish.press('Space');
      await expect(publish).toHaveAttribute('aria-expanded', 'false');
      await expect(editor).toHaveCount(0);
      await publish.press('Enter');
      await expect(password).toBeVisible();
      await expect(password).toBeEmpty();
      await expect(download).toHaveCount(0);

      await password.fill('420');
      await password.press('Enter');
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: () => new Promise<void>((resolve) => {
              document.addEventListener('resolve-publishing-copy', () => resolve(), { once: true });
            }),
          },
        });
      });
      await page.getByRole('button', { name: 'Copy Markdown', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Copying Markdown...' })).toBeDisabled();
      await publish.press('Space');
      await publish.press('Enter');
      await password.fill('420');
      await password.press('Enter');
      await page.evaluate(async () => {
        document.dispatchEvent(new Event('resolve-publishing-copy'));
        await new Promise((resolve) => requestAnimationFrame(resolve));
      });
      await expect(publishing.getByRole('status')).toBeEmpty();

      await page.reload({ waitUntil: 'networkidle' });
      await page.getByLabel('Preview password').fill('thereisnocowlevel');
      await page.getByLabel('Preview password').press('Enter');
      await expect(publish).toHaveAttribute('aria-expanded', 'false');
      await expect(editor).toHaveCount(0);
    });
  }
});
