import { expect, test } from '@playwright/test';
import { getSortedPostsData } from '../src/lib/markdown';
import { siteConfig } from '../src/lib/siteConfig';

const publishedPosts = getSortedPostsData();

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
});
