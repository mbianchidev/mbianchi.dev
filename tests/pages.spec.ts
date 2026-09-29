import { test, expect } from '@playwright/test';
import customersData from '../src/data/customers.json';
import { linksPageConfig } from '../src/data/links';
import projectsData from '../src/data/projects.json';
import pathRedirects from '../src/data/redirects.json';
import { getAllPostSlugs, getSortedPostsData, parseBlogDate } from '../src/lib/markdown';
import { profilePortrait, siteConfig } from '../src/lib/siteConfig';
import {
  createAbsoluteImageUrl,
  getSocialImageDefinition,
  withBasePath,
} from '../src/lib/siteMetadata';
import vercelConfig from '../vercel.json';

const publishedPosts = getSortedPostsData();
const samplePost = publishedPosts[0]!;
const visibleCustomers = customersData.companies.filter((company) => company.show);

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'links', path: '/links' },
  { name: 'about', path: '/about' },
  { name: 'blog', path: '/blog' },
  {
    name: 'blog-article',
    path: `/blog/${samplePost.slug}`,
  },
  { name: 'roadmap', path: '/roadmap' },
  { name: 'portfolio', path: '/portfolio' },
  { name: 'customers', path: '/customers' },
  { name: 'careers', path: '/careers' },
  { name: 'pricing', path: '/pricing' },
  { name: 'documentation', path: '/documentation' },
  { name: 'press', path: '/press' },
  { name: 'support', path: '/support' },
  { name: 'status', path: '/status' },
  { name: 'privacy', path: '/privacy' },
  { name: 'cookies', path: '/cookies' },
  { name: 'terms', path: '/terms' },
];

test.describe('Short links', () => {
  test('redirects every configured path', async ({ request }) => {
    for (const redirect of pathRedirects) {
      const response = await request.get(`${redirect.source}/`, { maxRedirects: 0 });
      const expectedLocation = redirect.destination.startsWith('http')
        ? new URL(redirect.destination).toString()
        : redirect.destination;

      expect(response.status(), redirect.source).toBe(307);
      expect(response.headers().location, redirect.source).toBe(expectedLocation);
    }
  });

  test('serves the placeholder resume PDF', async ({ request }) => {
    const response = await request.get('/static/Matteo_Bianchi_resume.pdf');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  });
});

test.describe('Static route experience', () => {
  test('does not publish underscore-prefixed blog files', () => {
    const slugs = getAllPostSlugs();

    expect(slugs).not.toContain('_template');
    expect(slugs.every((slug) => !slug.startsWith('_'))).toBe(true);
  });

  test('accepts timezone-aware blog publication dates', () => {
    expect(parseBlogDate('2026-08-23T09:00:00+02:00').toISOString()).toBe(
      '2026-08-23T07:00:00.000Z'
    );
    expect(() => parseBlogDate('2026-02-30T09:00:00+02:00')).toThrow();
  });

  test('renders blog edit timestamps only when frontmatter declares them', async ({ request }) => {
    const posts = getSortedPostsData();
    const editedPosts = posts.flatMap((post) =>
      post.editedAt === null ? [] : [{ ...post, editedAt: post.editedAt }]
    );
    const uneditedPost = posts.find((post) => post.editedAt === null);
    expect(editedPosts.length).toBeGreaterThan(0);
    expect(uneditedPost).toBeDefined();

    for (const post of editedPosts) {
      const response = await request.get(`/blog/${post.slug}/`);
      expect(response.ok(), post.slug).toBe(true);
      const html = await response.text();
      expect(html, post.slug).toContain(
        `dateTime="${parseBlogDate(post.editedAt).toISOString()}"`
      );
    }

    if (!uneditedPost) {
      throw new Error('Expected at least one blog post without an edit timestamp');
    }

    const response = await request.get(`/blog/${uneditedPost.slug}/`);
    expect(response.ok(), uneditedPost.slug).toBe(true);
    expect(await response.text(), uneditedPost.slug).not.toMatch(
      /<article[^>]*>[\s\S]*<time dateTime=/
    );
  });

  test('publishes canonical sitemap and robots metadata routes', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBe(true);

    const sitemap = await sitemapResponse.text();
    const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expectedUrls = [
      ...new Set([
        ...pages.map(({ path }) =>
          new URL(path.endsWith('/') ? path : `${path}/`, 'https://mbianchi.dev').toString()
        ),
        ...publishedPosts.map(({ slug }) => `https://mbianchi.dev/blog/${slug}/`),
      ]),
    ].sort();

    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemapUrls).toEqual(expectedUrls);
    expect(new Set(sitemapUrls).size).toBe(sitemapUrls.length);

    for (const redirect of pathRedirects) {
      expect(sitemapUrls).not.toContain(
        new URL(`${redirect.source}/`, 'https://mbianchi.dev').toString()
      );
    }
    expect(sitemapUrls.some((url) => url.includes('/redirect/'))).toBe(false);

    const robotsResponse = await request.get('/robots.txt');
    expect(robotsResponse.ok()).toBe(true);

    const robots = await robotsResponse.text();
    expect(robots).toContain('User-Agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Disallow: /redirect/');
    expect(robots).toContain('Disallow: /secret/');
    expect(robots).toContain('Sitemap: https://mbianchi.dev/sitemap.xml');
    expect(robots).toContain('Host: https://mbianchi.dev');
    expect(robots).not.toContain('/_next/');
  });

  for (const page of pages) {
    test(`renders ${page.name}`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path, { waitUntil: 'domcontentloaded' });

      await expect
        .poll(() => browserPage.title().then((title) => title.trim().length))
        .toBeGreaterThan(0);
      await expect(browserPage.locator('header')).toBeVisible();
      await expect(browserPage.locator('main')).toBeVisible();
      await expect(browserPage.locator('h1').first()).toBeVisible();
      await expect(browserPage.locator('footer')).toBeVisible();

      await browserPage.screenshot({
        path: `tests/screenshots/${page.name}-page.png`,
        fullPage: true,
      });
    });
  }

  test('publishes canonical URLs on static and dynamic routes', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(canonical).toHaveAttribute('href', 'https://mbianchi.dev/');

    await page.goto('/about', { waitUntil: 'domcontentloaded' });
    await expect(canonical).toHaveAttribute('href', 'https://mbianchi.dev/about/');

    await page.goto('/links', { waitUntil: 'domcontentloaded' });
    await expect(canonical).toHaveAttribute('href', 'https://mbianchi.dev/links/');

    await page.goto(`/blog/${samplePost.slug}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(canonical).toHaveAttribute(
      'href',
      `https://mbianchi.dev/blog/${samplePost.slug}/`
    );
  });

  test('publishes complete default social previews with reachable images', async ({
    page,
    request,
  }) => {
    for (const route of ['/', '/about']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      const openGraphImage = await page.locator('meta[property="og:image"]').getAttribute('content');

      expect(canonical).toBe(
        new URL(route.endsWith('/') ? route : `${route}/`, 'https://mbianchi.dev').toString()
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
      await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical!);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
        'content',
        '1600'
      );
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
        'content',
        '1066'
      );
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /.+/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      );
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        openGraphImage!
      );

      expect(openGraphImage).toBe(new URL(profilePortrait.src, siteConfig.url).toString());
      const imageResponse = await request.get(new URL(openGraphImage!).pathname);
      expect(imageResponse.ok(), openGraphImage!).toBe(true);
      expect(imageResponse.headers()['content-type']).toContain('image/jpeg');
    }
  });

  test('uses blog frontmatter to override article social previews', async ({ page, request }) => {
    await page.goto(`/blog/${samplePost.slug}`, {
      waitUntil: 'domcontentloaded',
    });

    const image = getSocialImageDefinition(samplePost.image, samplePost.imageAlt);
    const expectedUrl = `https://mbianchi.dev/blog/${samplePost.slug}/`;
    const expectedImage = createAbsoluteImageUrl(image.src).toString();

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedUrl);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      expectedImage
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      String(image.width)
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      'content',
      String(image.height)
    );
    await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      parseBlogDate(samplePost.date).toISOString()
    );
    await expect(page.locator('meta[property="article:author"]')).toHaveAttribute('content', /.+/);
    const articleTags = page.locator('meta[property="article:tag"]');
    expect(await articleTags.count()).toBeGreaterThan(0);
    expect(
      await articleTags.evaluateAll((tags) =>
        tags.every((tag) => Boolean(tag.getAttribute('content')?.trim()))
      )
    ).toBe(true);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      expectedImage
    );

    const imageResponse = await request.get(new URL(expectedImage).pathname);
    expect(imageResponse.ok()).toBe(true);
    expect(imageResponse.headers()['content-type']).toContain(image.type);
  });

  test('shows every post social image in the blog archive', async ({ page, request }) => {
    const posts = getSortedPostsData();

    await page.goto('/blog', { waitUntil: 'domcontentloaded' });

    for (const post of posts) {
      const image = getSocialImageDefinition(post.image, post.imageAlt);
      const expectedPath = image.src;
      const archiveRow = page.locator(`[data-blog-slug="${post.slug}"]`);
      const cover = archiveRow.locator('img');

      expect(image.width).toBeGreaterThan(0);
      expect(image.height).toBeGreaterThan(0);
      await expect(archiveRow).toBeVisible();
      await expect(cover).toBeVisible();
      await expect(cover).toHaveAttribute('src', withBasePath(expectedPath));
      await expect(cover).toHaveAttribute('alt', /.+/);

      const imageResponse = await request.get(expectedPath);
      expect(imageResponse.ok(), expectedPath).toBe(true);
      expect(imageResponse.headers()['content-type']).toContain(image.type);
    }
  });

  test('keeps social image URLs absolute and independent of an export base path', () => {
    const previousBasePath = process.env.NEXT_BASE_PATH;
    process.env.NEXT_BASE_PATH = '/mbianchi.dev';

    try {
      expect(
        createAbsoluteImageUrl('/mbianchi.dev/_next/static/media/preview.jpg').toString()
      ).toBe('https://mbianchi.dev/_next/static/media/preview.jpg');
      expect(createAbsoluteImageUrl('/mbianchi.dev/brand/matteo-mark.png').toString()).toBe(
        'https://mbianchi.dev/brand/matteo-mark.png'
      );
      expect(withBasePath('/images/matteo-kcd-denmark.jpg')).toBe(
        '/mbianchi.dev/images/matteo-kcd-denmark.jpg'
      );
    } finally {
      if (previousBasePath === undefined) {
        delete process.env.NEXT_BASE_PATH;
      } else {
        process.env.NEXT_BASE_PATH = previousBasePath;
      }
    }
  });

  test('keeps redirect fallback pages noncanonical and noindex', async ({ request }) => {
    const response = await request.get('/redirect/blog/');
    const html = await response.text();

    expect(response.ok()).toBe(true);
    expect(html).toMatch(/<meta name="robots" content="noindex, nofollow"\/?>/);
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('property="og:');
    expect(html).not.toContain('name="twitter:');
  });

  test('publishes the configurable public link manifest', async ({ page }) => {
    await page.goto('/links', { waitUntil: 'domcontentloaded' });

    const publicLinks = page.locator('main li > a');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(publicLinks).toHaveCount(linksPageConfig.links.length);

    for (const expectedLink of linksPageConfig.links) {
      const link = page.locator(`main a[href="${expectedLink.href}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('publishes the complete English blog archive', async ({ page }) => {
    const expectedBlogRoutes = publishedPosts
      .map(({ slug }) => `/blog/${slug}/`)
      .sort();

    await page.goto('/blog', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('[data-blog-slug]')).toHaveCount(publishedPosts.length);

    for (const post of publishedPosts) {
      const archiveRow = page.locator(`[data-blog-slug="${post.slug}"]`);
      await expect(archiveRow.locator('h3')).toBeVisible();
      await expect(archiveRow.locator(`a[href="/blog/${post.slug}/"]`).first()).toBeVisible();
      await expect(archiveRow.locator(`time[datetime="${post.date}"]`)).toBeVisible();
    }

    const publishedRoutes = await page.locator('a[href^="/blog/"]').evaluateAll((links) =>
      [
        ...new Set(
          links
            .map((link) => link.getAttribute('href'))
            .filter((href) => href !== null && href !== '/blog/')
        ),
      ].sort()
    );
    expect(publishedRoutes).toEqual(expectedBlogRoutes);
  });

  test('renders the company logo set', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const lovedBy = page.locator('section[aria-labelledby="loved-by-title"]');
    const logos = lovedBy.locator('ul:not([aria-hidden="true"]) img');
    await expect(lovedBy).toBeVisible();
    await expect(logos).toHaveCount(15);

    const logoState = await logos.evaluateAll((images) =>
      images.map((image) => ({
        alt: image.getAttribute('alt'),
        width: (image as HTMLImageElement).naturalWidth,
      }))
    );
    expect(logoState.every(({ alt, width }) => Boolean(alt?.trim()) && width > 0)).toBe(true);
  });

  test('shows the current year and month in the release badge', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    const currentVersion = await page.evaluate(() => {
      const now = new Date();
      return `${now.getFullYear()}.${now.getMonth() + 1}`;
    });

    await expect(page.locator('[data-release-badge]')).toContainText(`v${currentVersion}`);
  });

  test('keeps the compatibility intro visible and updates the result', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    const introBox = await page.locator('section#compatibility > div').first().boundingBox();
    expect(introBox).not.toBeNull();
    expect(introBox!.x).toBeGreaterThanOrEqual(0);
    expect(introBox!.x + introBox!.width).toBeLessThanOrEqual(1280);

    const automationBacklog = page.locator('[data-scenario-id="ai-automation"]');
    await automationBacklog.click();

    await expect(automationBacklog).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#compatibility-result')).toHaveAttribute(
      'data-selected-scenario',
      'ai-automation'
    );
  });

  test('exposes the mobile navigation with accurate state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    const menuButton = page.locator('header button[aria-controls]');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();

    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('header nav a[href="/#features"]')).toBeVisible();
  });

  test('uses the requested top navigation routes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const destinations = await page.locator('header nav ul a[href^="/"]').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href'))
    );
    expect(destinations).toEqual(['/#features', '/customers/', '/about/', '/blog/']);
  });

  test('presents the About page as an accessible CEO note', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('article#the-note')).toBeVisible();
    await expect(page.locator('article#the-note blockquote')).toHaveCount(2);
    await expect(page.locator('article#the-note blockquote').first()).toBeVisible();
    await expect(page.locator('picture[data-responsive-portrait] img')).toBeVisible();

    await page.locator('html[data-hydrated="true"]').waitFor();
    await page.locator('header button[aria-controls]').click();
    const aboutLink = page.locator('header nav a[href="/about/"]');
    await expect(aboutLink).toHaveAttribute('aria-current', 'page');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  });

  test('renders the Duck Runtime identity and app metadata', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const headerLogo = page.locator('header a[href="/"]');
    const footerLogo = page.locator('footer a[href="/"]');

    await expect(headerLogo).toBeVisible();
    await expect(footerLogo).toBeVisible();
    await expect(page.locator('[data-brand-mark]')).toHaveCount(2);

    const loadedMarks = await page.locator('[data-brand-mark]').evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).naturalWidth)
    );
    expect(loadedMarks.every((width) => width > 0)).toBe(true);

    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
      'href',
      /\/manifest\.webmanifest$/
    );
    await expect(page.locator('link[rel~="icon"]').first()).toHaveAttribute('href', /icon|favicon/);
    await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(0);
    await expect(page.locator('body > a[href="#main-content"]')).toBeVisible();
    await expect(page.locator('main#main-content')).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('script[data-sdkn="@vercel/analytics/next"]')).toHaveAttribute(
      'src',
      'https://va.vercel-scripts.com/v1/script.debug.js'
    );
    await expect(page.locator('script[data-sdkn="@vercel/speed-insights/next"]')).toHaveAttribute(
      'src',
      'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js'
    );
  });

  test('serves responsive modern portrait formats', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const portrait = page.locator('picture[data-responsive-portrait]').first();
    await expect(portrait.locator('source[type="image/avif"]')).toHaveAttribute(
      'srcset',
      /\.avif 320w.+\.avif 1280w/
    );
    await expect(portrait.locator('source[type="image/webp"]')).toHaveAttribute(
      'srcset',
      /\.webp 320w.+\.webp 1280w/
    );
    await expect
      .poll(() => portrait.locator('img').evaluate((image: HTMLImageElement) => image.currentSrc))
      .toMatch(/\.avif$/);
  });

  test('defines hardened production response headers', () => {
    const routeHeaders = vercelConfig.headers.find(({ source }) => source === '/(.*)');
    expect(routeHeaders).toBeDefined();

    const headers = Object.fromEntries(
      routeHeaders!.headers.map(({ key, value }) => [key, value])
    );
    expect(Object.keys(headers)).toEqual(
      expect.arrayContaining([
        'Content-Security-Policy',
        'Cross-Origin-Opener-Policy',
        'Permissions-Policy',
        'Referrer-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'X-Frame-Options',
      ])
    );
    expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
    expect(headers['Content-Security-Policy']).toContain("object-src 'none'");
    expect(headers['Content-Security-Policy']).toContain('https://va.vercel-scripts.com');
    expect(headers['Content-Security-Policy']).toContain('https://vitals.vercel-insights.com');
    expect(headers['Content-Security-Policy']).not.toContain("'unsafe-eval'");
  });

  test('reports status uptime and PTO incident', async ({ page }) => {
    await page.goto('/status', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('[role="status"]')).toBeVisible();
    await expect(page.locator('main dl > div')).toHaveCount(3);
    await expect(page.locator('main article time[datetime="PT3M"]')).toBeVisible();
    await expect(page.locator('[data-uptime-day]')).toHaveCount(360);
  });

  test('keeps the homepage proof layout balanced', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main a[href="/roadmap/"]')).toBeVisible();

    const proofArticles = page.locator('#proof article');
    await expect(proofArticles).toHaveCount(2);
    const featured = proofArticles.nth(0);
    const supporting = proofArticles.nth(1);
    const [featuredBox, supportingBox] = await Promise.all([
      featured.boundingBox(),
      supporting.boundingBox(),
    ]);

    expect(featuredBox).not.toBeNull();
    expect(supportingBox).not.toBeNull();
    expect(Math.abs(featuredBox!.height - supportingBox!.height)).toBeLessThan(2);

    const integrations = page.locator('#integrations');
    const integrationsColors = await integrations.evaluate((section) => {
      const computed = getComputedStyle(section);
      return {
        background: computed.backgroundColor,
        color: computed.color,
      };
    });

    expect(integrationsColors).toEqual({
      background: 'rgb(0, 217, 255)',
      color: 'rgb(10, 10, 11)',
    });
  });

  test('renders portfolio and changelog records', async ({ page }) => {
    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main article')).toHaveCount(projectsData.projects.length);
    for (const project of projectsData.projects) {
      await expect(page.locator(`main a[href="${project.url}"]`)).toHaveCount(1);
    }

    await page.goto('/roadmap', { waitUntil: 'domcontentloaded' });
    const releases = page.locator('main ol > li');
    expect(await releases.count()).toBeGreaterThan(0);
    await expect(releases.locator('h3')).toHaveCount(await releases.count());
  });

  test('renders customer history and careers closing layout', async ({ page }) => {
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    const customerCodes = page.locator('[data-customer-logo]');
    await expect(customerCodes).toHaveCount(7);
    expect(await customerCodes.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('data-customer-logo'))
    )).toEqual(visibleCustomers.slice(0, 7).map((company) => company.code));

    const loadMoreHistory = page.locator('[data-load-more-customers]');
    while (await loadMoreHistory.count()) {
      await loadMoreHistory.click();
    }
    await expect(customerCodes).toHaveCount(visibleCustomers.length);

    await page.goto('/careers', { waitUntil: 'domcontentloaded' });
    const close = page.locator('[data-careers-close]');
    const deploy = close.locator('a');
    const [headingBox, deployBox] = await Promise.all([
      close.getByRole('heading').boundingBox(),
      deploy.boundingBox(),
    ]);

    expect(headingBox).not.toBeNull();
    expect(deployBox).not.toBeNull();
    expect(deployBox!.y).toBeGreaterThan(headingBox!.y + headingBox!.height);
    expect(Math.abs(deployBox!.x - headingBox!.x)).toBeLessThanOrEqual(1);
  });

  test('keeps benchmark metrics separated and pricing cards aligned', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const benchmarks = page.locator('[data-benchmarks]');
    const metricRows = benchmarks.locator('dl > div');
    await expect(metricRows).toHaveCount(3);

    for (let index = 0; index < 3; index += 1) {
      const row = metricRows.nth(index);
      const [valueBox, copyBox] = await Promise.all([
        row.locator('dt').boundingBox(),
        row.locator('dd').boundingBox(),
      ]);

      expect(valueBox).not.toBeNull();
      expect(copyBox).not.toBeNull();
      expect(valueBox!.x + valueBox!.width).toBeLessThan(copyBox!.x);
    }

    const primaryMetricLines = await benchmarks.locator('[data-primary-metric]').evaluate(
      (element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return range.getClientRects().length;
      }
    );
    expect(primaryMetricLines).toBe(1);

    await page.goto('/pricing', { waitUntil: 'domcontentloaded' });

    const pricingRows: Array<{
      articleTop: number;
      articleBottom: number;
      headingTop: number;
      priceTop: number;
      descriptionTop: number;
      toggleTop: number;
      actionTop: number;
    }> = [];

    for (const planId of ['advisory', 'delivery', 'full-time']) {
      const plan = page.locator(`[data-pricing-plan="${planId}"]`);
      const [articleBox, headingBox, priceBox, descriptionBox, toggleBox, actionBox, hasOverflow] =
        await Promise.all([
          plan.boundingBox(),
          plan.locator('h3').boundingBox(),
          plan.locator('strong').first().boundingBox(),
          plan.locator(':scope > p').boundingBox(),
          plan.getByRole('button').boundingBox(),
          plan.locator(':scope > a').boundingBox(),
          plan.evaluate((article) => article.scrollWidth > article.clientWidth + 1),
        ]);

      expect(articleBox).not.toBeNull();
      expect(headingBox).not.toBeNull();
      expect(priceBox).not.toBeNull();
      expect(descriptionBox).not.toBeNull();
      expect(toggleBox).not.toBeNull();
      expect(actionBox).not.toBeNull();
      expect(headingBox!.y + headingBox!.height).toBeLessThan(priceBox!.y);
      expect(hasOverflow).toBe(false);

      pricingRows.push({
        articleTop: articleBox!.y,
        articleBottom: articleBox!.y + articleBox!.height,
        headingTop: headingBox!.y,
        priceTop: priceBox!.y,
        descriptionTop: descriptionBox!.y,
        toggleTop: toggleBox!.y,
        actionTop: actionBox!.y,
      });
    }

    for (const row of [
      'articleTop',
      'articleBottom',
      'headingTop',
      'priceTop',
      'descriptionTop',
      'toggleTop',
      'actionTop',
    ] as const) {
      const positions = pricingRows.map((plan) => plan[row]);
      expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(1);
    }
  });

  test('navigates to every policy from the footer', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const footer = page.getByRole('contentinfo');
    await footer.locator('a[href="/privacy/"]').click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    await expect(page.locator('main h1')).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('footer a[href="/cookies/"]').click();
    await expect(page).toHaveURL(/\/cookies\/?$/);
    await expect(page.locator('main h1')).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('footer a[href="/terms/"]').click();
    await expect(page).toHaveURL(/\/terms\/?$/);
    await expect(page.locator('main h1')).toBeVisible();
  });

  test('documents the active measurement tools without claiming cookies', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main section[aria-label] section')).toHaveCount(8);
    await expect(
      page.locator('main a[href="https://vercel.com/docs/analytics/privacy-policy"]')
    ).toBeVisible();
    await expect(
      page.locator('main a[href="https://vercel.com/docs/speed-insights/privacy-policy"]')
    ).toBeVisible();
    await expect(page.locator('main a[href="/cookies/"]')).toBeVisible();

    await page.goto('/cookies', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main section[aria-label] section')).toHaveCount(6);
    await expect(
      page.locator('main a[href="https://vercel.com/docs/analytics/privacy-policy"]')
    ).toBeVisible();
    await expect(
      page.locator('main a[href="https://vercel.com/docs/speed-insights/privacy-policy"]')
    ).toBeVisible();
  });

  test('uses the requested Product and Company footer routes', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const footerNavigations = page.locator('footer nav');
    const product = footerNavigations.nth(0);
    const company = footerNavigations.nth(1);
    expect(await product.locator('a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href'))
    )).toEqual(['/#features', '/#integrations', '/pricing/', '/roadmap/']);
    expect(await company.locator('a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href'))
    )).toEqual(['/portfolio/', '/about/', '/careers/', '/customers/']);

    for (const navigation of [product, company]) {
      const positions = await navigation.getByRole('link').evaluateAll((links) =>
        links.map((link) => link.getBoundingClientRect().top)
      );

      expect(positions).toEqual([...positions].sort((a, b) => a - b));
      expect(new Set(positions).size).toBe(positions.length);
    }
  });

  test('shows SyncTune registration details without footer overflow', async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1600, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const footer = page.getByRole('contentinfo');
      const businessDetails = footer.locator(
        'dl[aria-label="Business registration details"]'
      );
      await expect(businessDetails.locator(':scope > div')).toHaveCount(2);
      const identifiers = await businessDetails.locator(':scope > div').evaluateAll((entries) =>
        entries.map((entry) => ({
          term: entry.querySelector('dt')?.textContent?.trim(),
          value: entry.querySelector('dd')?.textContent?.trim(),
        }))
      );
      expect(identifiers.every(({ term, value }) => Boolean(term) && Boolean(value))).toBe(true);

      const hasOverflow = await footer.evaluate(
        (element) => element.scrollWidth > element.clientWidth
      );
      expect(hasOverflow).toBe(false);
    }
  });

  test('calculates an advisory quote accessibly', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    await page.locator('#hours-input').fill('20');
    await page.locator('#tier-select').selectOption('advisory');

    await expect(page.locator('output')).toHaveText('€2,000');
    await expect(page.locator('[data-hours-preset="20"]')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  test('loads more deployment history without replacing existing entries', async ({ page }) => {
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    const historyEntries = page.locator('main section ol > li');
    const historyLogos = page.locator('[data-customer-logo]');
    const historyImages = historyLogos.locator('img');
    await expect(historyEntries).toHaveCount(7);
    await expect(historyLogos).toHaveCount(7);
    await expect(historyImages).toHaveCount(6);
    await expect(page.locator('[data-customer-logo="ING"] img')).toBeVisible();

    await page.locator('[data-load-more-customers]').click();
    await expect(historyEntries).toHaveCount(14);
    await expect(historyLogos).toHaveCount(14);
    await expect(historyImages).toHaveCount(13);

    const loadedWidths = await historyImages.evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).naturalWidth)
    );
    expect(loadedWidths.every((width) => width > 0)).toBe(true);
  });

  test('renders the branded not-found route', async ({ page }) => {
    const response = await page.goto('/definitely-not-a-route', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(404);
    await expect(page.locator('main h1')).toBeVisible();
  });
});
