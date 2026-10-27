import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import {
  getAllDraftSlugs,
  getAllPostSlugs,
  getDraftPostData,
  getPostData,
  getSortedPostsData,
} from '../src/lib/markdown';

const draftSlugs = fs.readdirSync(path.join(process.cwd(), 'content/blog'))
  .filter((fileName) => fileName.startsWith('_') && fileName.endsWith('.md'))
  .map((fileName) => fileName.slice(1, -3));

test.describe('Blog draft previews', () => {
  test('loads every underscore-prefixed file without publication metadata', async () => {
    expect(getAllDraftSlugs().sort()).toEqual([...draftSlugs].sort());

    for (const slug of draftSlugs) {
      const post = await getDraftPostData(slug);

      expect(post).not.toBeNull();
      expect(post?.slug).toBe(slug);
      expect(post?.title.trim().length).toBeGreaterThan(0);
      expect(post?.excerpt.trim().length).toBeGreaterThan(0);
      expect(post?.content).toMatch(/<\w+/);
      expect(Object.keys(post!)).toEqual(['slug', 'title', 'excerpt', 'content']);
    }

    const publishedOnlySlugs = getAllPostSlugs()
      .filter((slug) => !draftSlugs.includes(slug));
    for (const slug of ['missing-preview-fixture', '../README', ...publishedOnlySlugs]) {
      expect(await getDraftPostData(slug), slug).toBeNull();
    }
  });

  test('keeps every draft out of the public publishing pipeline', async ({ request }) => {
    const publicSlugs = getAllPostSlugs();
    const publicPosts = getSortedPostsData();
    const sitemapResponse = await request.get('/sitemap.xml');
    const archiveResponse = await request.get('/blog/');
    const manifest = JSON.parse(fs.readFileSync(
      path.join(process.cwd(), '.generated/blog-social-images.json'),
      'utf8'
    ));

    expect(sitemapResponse.ok()).toBe(true);
    expect(archiveResponse.ok()).toBe(true);
    const sitemap = await sitemapResponse.text();
    const archive = await archiveResponse.text();

    expect(sitemap).not.toContain('/blog/draft/');
    expect(archive).not.toContain('/blog/draft/');

    for (const slug of draftSlugs) {
      expect(publicSlugs).not.toContain(`_${slug}`);
      expect(publicPosts.some((post) => post.slug === `_${slug}`)).toBe(false);
      if (!publicSlugs.includes(slug)) {
        expect(manifest).not.toHaveProperty(slug);
      }
      expect(manifest).not.toHaveProperty(`_${slug}`);
      expect(await getPostData(`_${slug}`)).toBeNull();
    }
  });

  test('does not render draft content without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    try {
      for (const slug of draftSlugs) {
        const response = await page.goto(`/blog/draft/${slug}/`);

        expect(response?.ok(), slug).toBe(true);
        await expect(page.getByLabel('Preview password')).toBeVisible();
        await expect(page.getByRole('article')).toHaveCount(0);
      }
    } finally {
      await context.close();
    }
  });

  for (const slug of draftSlugs) {
    test(`gates the complete draft preview for ${slug}`, async ({ page, request }, testInfo) => {
      const route = `/blog/draft/${slug}/`;
      const response = await request.get(route);

      expect(response.ok()).toBe(true);
      expect(await response.text()).not.toMatch(/<article\b/);

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route, { waitUntil: 'networkidle' });

      const accessGate = page.getByRole('region', { name: 'Draft preview access' });
      const password = accessGate.getByLabel('Preview password');
      await expect(password).toHaveAttribute('type', 'password');
      await expect(password).toHaveAttribute('required', '');
      await expect(page.getByRole('article')).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex.*nofollow/
      );
      await expect(page.locator(
        'link[rel="canonical"], meta[name="description"], meta[property^="og:"], '
        + 'meta[property^="article:"], meta[name^="twitter:"], script[type="application/ld+json"]'
      )).toHaveCount(0);

      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() =>
          document.documentElement.scrollWidth <= document.documentElement.clientWidth
        )).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath(`locked-${width}.png`),
          fullPage: true,
        });
      }

      await password.fill('incorrect-preview-fixture');
      await password.press('Enter');

      await expect(accessGate.getByRole('alert')).toBeVisible();
      await expect(password).toHaveAttribute('aria-invalid', 'true');
      await expect(password).toBeFocused();
      await expect(page.getByRole('article')).toHaveCount(0);

      await password.fill('thereisnocowlevel');
      await expect(accessGate.getByRole('alert')).toHaveCount(0);
      await password.press('Tab');
      await expect(page.getByRole('button', { name: 'Preview draft' })).toBeFocused();
      await page.keyboard.press('Enter');

      await expect(page.getByRole('article')).toBeVisible();
      await expect(page.locator('#page-title')).toBeVisible();
      await expect(page.getByRole('main')).toBeFocused();
      await expect(password).toHaveCount(0);
      await expect(page.getByRole('article').locator('p')).not.toHaveCount(0);

      for (const width of [390, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() =>
          document.documentElement.scrollWidth <= document.documentElement.clientWidth
        )).toBe(true);
        await page.screenshot({
          path: testInfo.outputPath(`unlocked-${width}.png`),
        });
      }

      await page.reload({ waitUntil: 'networkidle' });

      await expect(password).toBeVisible();
      await expect(page.getByRole('article')).toHaveCount(0);
    });
  }
});
