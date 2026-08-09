import { test, expect } from '@playwright/test';
import pathRedirects from '../src/data/redirects.json';
import { getAllPostSlugs, getSortedPostsData } from '../src/lib/markdown';
import { createAbsoluteImageUrl, withBasePath } from '../src/lib/siteMetadata';
import vercelConfig from '../vercel.json';

const pages = [
  { name: 'homepage', path: '/', title: 'Matteo — The Human Platform' },
  { name: 'links', path: '/links', title: 'Links — Matteo' },
  { name: 'about', path: '/about', title: 'A Note from Our CEO — Matteo' },
  { name: 'blog', path: '/blog', title: 'Field Notes — Matteo' },
  {
    name: 'blog-article',
    path: '/blog/yet-another-monumentally-long-year-in-review-2025',
    title: 'Yet Another Monumentally Long Year in Review: 2025 — Matteo',
  },
  { name: 'roadmap', path: '/roadmap', title: 'Changelog — Matteo' },
  { name: 'portfolio', path: '/portfolio', title: 'Open Source — Matteo' },
  { name: 'customers', path: '/customers', title: 'Customers — Matteo' },
  { name: 'careers', path: '/careers', title: 'Careers — Matteo' },
  { name: 'pricing', path: '/pricing', title: 'Pricing — Matteo' },
  { name: 'documentation', path: '/documentation', title: 'Documentation — Matteo' },
  { name: 'press', path: '/press', title: 'Press — Matteo' },
  { name: 'support', path: '/support', title: 'Support — Matteo' },
  { name: 'status', path: '/status', title: 'Status — Matteo' },
  { name: 'privacy', path: '/privacy', title: 'Privacy — Matteo' },
  { name: 'cookies', path: '/cookies', title: 'Cookie Policy — Matteo' },
  { name: 'terms', path: '/terms', title: 'Terms — Matteo' },
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
  test('does not publish underscore-prefixed blog templates', () => {
    const slugs = getAllPostSlugs();

    expect(slugs).not.toContain('_template');
    expect(slugs.every((slug) => !slug.startsWith('_'))).toBe(true);
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
        ...getSortedPostsData().map(({ slug }) => `https://mbianchi.dev/blog/${slug}/`),
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

      await expect(browserPage).toHaveTitle(page.title);
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

    await page.goto('/blog/yet-another-monumentally-long-year-in-review-2025', {
      waitUntil: 'domcontentloaded',
    });
    await expect(canonical).toHaveAttribute(
      'href',
      'https://mbianchi.dev/blog/yet-another-monumentally-long-year-in-review-2025/'
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
      await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
        'content',
        'Matteo'
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical!);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
        'content',
        '1600'
      );
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
        'content',
        '1066'
      );
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
        'content',
        'Matteo Bianchi speaking on stage at KCD Denmark'
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image'
      );
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        openGraphImage!
      );

      expect(openGraphImage).toBe('https://mbianchi.dev/images/matteo-kcd-denmark.jpg');
      const imageResponse = await request.get(new URL(openGraphImage!).pathname);
      expect(imageResponse.ok(), openGraphImage!).toBe(true);
      expect(imageResponse.headers()['content-type']).toContain('image/jpeg');
    }
  });

  test('uses blog frontmatter to override article social previews', async ({ page, request }) => {
    await page.goto('/blog/yet-another-monumentally-long-year-in-review-2025', {
      waitUntil: 'domcontentloaded',
    });

    const expectedUrl =
      'https://mbianchi.dev/blog/yet-another-monumentally-long-year-in-review-2025/';
    const expectedImage =
      'https://mbianchi.dev/blog-social-images/yet-another-monumentally-long-year-in-review-2025/matteo-mark.png';

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedUrl);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      expectedImage
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      'Matteo human platform brand mark'
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      '1024'
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      'content',
      '1024'
    );
    await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      '2025-12-29T00:00:00.000Z'
    );
    await expect(page.locator('meta[property="article:author"]')).toHaveAttribute(
      'content',
      'Matteo Bianchi'
    );
    await expect(page.locator('meta[property="article:tag"]')).toHaveAttribute(
      'content',
      'Personal'
    );
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
    expect(imageResponse.headers()['content-type']).toContain('image/png');
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

    const publicLinks = page.getByRole('region', { name: 'Public links' });
    await expect(page.getByRole('heading', { name: '@mbianchidev' })).toBeVisible();
    await expect(publicLinks.getByRole('link')).toHaveCount(3);

    const expectedLinks = [
      {
        service: 'MentorCruise',
        href: 'https://mentorcruise.com/mentor/matteobianchi',
      },
      {
        service: 'YouTube',
        href: 'https://youtube.com/mbianchidev',
      },
      {
        service: 'GitHub',
        href: 'https://github.com/mbianchidev',
      },
    ];

    for (const expectedLink of expectedLinks) {
      const link = publicLinks.getByRole('link', { name: new RegExp(expectedLink.service) });
      await expect(link).toHaveAttribute('href', expectedLink.href);
      await expect(link).toHaveAttribute('target', '_blank');
    }
  });

  test('publishes the complete English blog archive', async ({ page }) => {
    const expectedBlogRoutes = [
      '/blog/2023-devops-is-terrible/',
      '/blog/2026-ai-sucks/',
      '/blog/apple-pays-4-15-apy-on-saving-accounts/',
      '/blog/cloud-native-rejekts-kubecon-na-2024/',
      '/blog/community-101/',
      '/blog/doubling-your-engineering-team-wont-double-the-output/',
      '/blog/fear-and-loathing-in-free-and-open-source/',
      '/blog/how-netflix-is-k-lling-itself/',
      '/blog/i-dont-like-chatgpt/',
      '/blog/idx-a-revolution-or-just-a-new-vscode-re-skin/',
      '/blog/is-this-the-end-of-open-source-software/',
      '/blog/italy-vs-openai-a-fact-b-i-ased-clarification/',
      '/blog/kubecon-rejekts-kubetrain-kcd/',
      '/blog/kubernetes-community-days-experience/',
      '/blog/kubernetes-v1-31-elli-an-insider-view/',
      '/blog/my-2023-wrapped/',
      '/blog/my-2024-wrapped/',
      '/blog/my-experience-as-kcd-organizer/',
      '/blog/new-year-resolutions-of-a-fresh-cto/',
      '/blog/rip-devrel-2010-2024-why-it-died-and-how-to-stop-killing-it/',
      '/blog/scrum-sucks/',
      '/blog/surviving-kubecon-an-updated-guide-na-2024-edition/',
      '/blog/surviving-kubecon-eu-2024-attendee-edition/',
      '/blog/terraform-wtf/',
      '/blog/the-end-of-my-first-journey-in-the-startup-world/',
      '/blog/when-everything-is-urgent-then-nothing-is-urgent/',
      '/blog/wtf-is-devrel/',
      '/blog/yet-another-monumentally-long-year-in-review-2025/',
    ];

    await page.goto('/blog', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('28 field notes', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Field notes from the workbench.' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Latest field note' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'The reading desk' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Browse field notes by topic' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The complete archive.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'My 2023 wrapped' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'I don’t like ChatGPT.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Read I don’t like ChatGPT.' })).toHaveAttribute(
      'href',
      '/blog/i-dont-like-chatgpt/'
    );
    const publishedRoutes = await page.locator('a[href^="/blog/"]').evaluateAll((links) =>
      [
        ...new Set(
          links
            .map((link) => link.getAttribute('href'))
            .filter((href) => href !== null && href !== '/blog/')
        ),
      ].sort()
    );
    expect(publishedRoutes).toEqual(expectedBlogRoutes.sort());

    await page.goto('/blog/2026-ai-sucks', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('2026 AI sucks. — Matteo');
    await expect(page.getByRole('heading', { name: 'AI in 2026 sucks.' })).toBeVisible();
    await expect(page.getByText('Photo © AFP', { exact: true })).toBeVisible();
    await expect(page.locator('article img')).toHaveCount(2);
    await expect(page.locator('article img').nth(0)).toHaveAttribute(
      'src',
      '/images/Amodei-Altman.jpg'
    );
    await expect(page.locator('article img').nth(1)).toHaveAttribute(
      'src',
      '/images/OpenAI-circle-investing.jpg'
    );

    await page.goto('/blog/i-dont-like-chatgpt', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('I don’t like ChatGPT. — Matteo');
    await expect(page.getByRole('heading', { name: 'Here is why I don’t like ChatGPT' })).toBeVisible();
    await expect(page.locator('article img')).toHaveCount(6);

    await page.goto('/blog/my-2023-wrapped', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Todo list for 2024' })).toBeVisible();
    await expect(page.getByText('That’s all for now, ciao :)', { exact: true })).toBeVisible();
    await expect(page.locator('article img')).toHaveCount(3);
  });

  test('renders the main-branch loved-by logo set', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const lovedBy = page.getByRole('region', { name: 'Loved and trusted by people at' });
    await expect(lovedBy).toBeVisible();

    for (const company of ['GitHub', 'Google', 'Microsoft', 'Uber', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'NVIDIA', 'Adobe', 'Edera', 'Replit', 'OpenAI', 'Anthropic']) {
      const logo = lovedBy.getByRole('img', { name: company });
      await expect(logo).toHaveCount(1);
      await expect
        .poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth))
        .toBeGreaterThan(0);
    }
  });

  test('updates the compatibility result', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    const automationBacklog = page.getByRole('button', { name: /Automation backlog/ });
    await automationBacklog.click();

    await expect(automationBacklog).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#compatibility-result')).toContainText(
      'Automate repeated work without automating responsibility.'
    );
  });

  test('exposes the mobile navigation with accurate state', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();

    await expect(page.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    await expect(
      page
        .getByRole('navigation', { name: 'Primary navigation' })
        .getByRole('link', { name: 'Product' })
    ).toBeVisible();
  });

  test('uses the requested top navbar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    for (const label of ['Product', 'Customers', 'About', 'Blog']) {
      await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(navigation.getByRole('link', { name: 'Features', exact: true })).toHaveCount(0);
    await expect(navigation.getByRole('link', { name: 'Integrations', exact: true })).toHaveCount(0);
  });

  test('presents the About page as an accessible CEO note', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'A note from our CEO.' })).toBeVisible();
    await expect(page.getByRole('article', { name: 'A note from Matteo Bianchi' })).toBeVisible();
    await expect(page.getByText('I was lying.', { exact: true })).toBeVisible();
    await expect(page.getByText('To be continued…', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'Matteo Bianchi speaking on stage at KCD Denmark' })
    ).toBeVisible();

    await page.locator('html[data-hydrated="true"]').waitFor();
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    const aboutLink = page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'About', exact: true });
    await expect(aboutLink).toHaveAttribute('aria-current', 'page');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  });

  test('renders the Duck Runtime identity and app metadata', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const headerLogo = page
      .getByRole('banner')
      .getByRole('link', { name: /Matteo\s*human platform/i });
    const footerLogo = page
      .getByRole('contentinfo')
      .getByRole('link', { name: /Matteo\s*human platform/i });

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
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content'
    );
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

    await expect(page.getByRole('heading', { name: 'Service status' })).toBeVisible();
    await expect(page.getByText('99.99%', { exact: true })).toBeVisible();
    await expect(page.getByText('3 minutes - PTO', { exact: true })).toBeVisible();
    await expect(page.getByText('All systems operational. Human included.')).toBeVisible();
    await expect(page.getByText('No active incidents reported.')).toBeVisible();
    await expect(page.locator('[data-uptime-day]')).toHaveCount(360);
  });

  test('does not expose the removed K-Lab CLI project', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('K-Lab CLI', { exact: true })).toHaveCount(0);

    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('K-Lab CLI', { exact: true })).toHaveCount(0);
  });

  test('uses the requested homepage copy and balanced proof layout', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: 'Platform as a Human' })).toBeVisible();
    await expect(
      page.getByText(
        'Matteo turns customer pain into cloud systems, developer platforms, and AI automation people actually adopt - then tells the story to engineers, leaders and the open source community.'
      )
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Start trial' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'See changelog' })).toHaveAttribute(
      'href',
      '/roadmap/'
    );
    await expect(
      page.getByText(
        'Human infrastructure for teams that need platforms, AI automation, customer outcomes, and clear technical communication to reinforce each other.'
      )
    ).toBeVisible();
    await expect(
      page.getByText(
        'Repeated work tends to become a script, agent, or internal product. Humans keep the judgment and the reclaimed time.'
      )
    ).toBeVisible();

    const featured = page
      .getByRole('heading', { name: 'Platform Engineering Roadmap' })
      .locator('xpath=ancestor::article');
    const sendbox = page
      .getByRole('heading', { name: 'Sendbox' })
      .locator('xpath=ancestor::article');
    const [featuredBox, sendboxBox] = await Promise.all([
      featured.boundingBox(),
      sendbox.boundingBox(),
    ]);

    expect(featuredBox).not.toBeNull();
    expect(sendboxBox).not.toBeNull();
    expect(Math.abs(featuredBox!.height - sendboxBox!.height)).toBeLessThan(2);

    const integrations = page
      .getByRole('heading', { name: 'Native integrations. Human judgment included.' })
      .locator('xpath=ancestor::section');
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

  test('publishes the refreshed portfolio and changelog facts', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('LIVE SYSTEM', { exact: true })).toBeVisible();
    await expect(page.getByText('Stuff Engineering + customer empathy', { exact: true })).toBeVisible();
    await expect(page.getByText('Platform - Solutions - Open Source - AI', { exact: true })).toBeVisible();
    await expect(page.locator('#compatibility-result')).toContainText(
      'Led infrastructure and built APIs serving 10M+ daily users to this day'
    );

    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('30+', { exact: true })).toHaveCount(2);
    await expect(
      page.getByText('Kubernetes, CNCF, Actions (ARC)... and more', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('12 articles, 17 podcasts, 22 talks', { exact: true })).toBeVisible();
    await expect(page.getByText('140+ GitHub stars', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Kubernetes' }).locator('xpath=preceding-sibling::p')
    ).toHaveText('Maintainer');
    await expect(
      page.getByText('Mentees coached · 5/5 stars').locator('xpath=preceding-sibling::dt')
    ).toHaveText('20+');

    await page.goto('/roadmap', { waitUntil: 'domcontentloaded' });
    for (const release of [
      'KubeCon EU Amsterdam 2026',
      'Kubernetes SIG Release contributor award',
      'Kubernetes v1.34',
      'Kubernetes v1.33',
    ]) {
      await expect(page.getByRole('heading', { name: release, exact: true })).toBeVisible();
    }
  });

  test('uses the requested customer, blog, and careers copy', async ({ page }) => {
    await page.goto('/customers', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('30 recorded deployments', { exact: true })).toBeVisible();
    await expect(page.getByText('19 domains', { exact: true })).toBeVisible();
    await expect(page.getByText('GitHub (Microsoft)', { exact: true })).toBeVisible();

    await page.goto('/blog', { waitUntil: 'domcontentloaded' });
    for (const removedPost of [
      'Security in the Cloud Native Era',
      'Kubernetes Best Practices for Production',
      'Building Scalable Cloud Native Applications',
    ]) {
      await expect(page.getByRole('heading', { name: removedPost, exact: true })).toHaveCount(0);
    }

    await page.goto('/careers', { waitUntil: 'domcontentloaded' });
    const close = page
      .getByRole('heading', {
        name: 'If these capabilities need to reinforce each other, test the human interface.',
      })
      .locator('xpath=ancestor::section');
    const deploy = close.getByRole('link', { name: 'Deploy' });
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

    const benchmarks = page
      .getByRole('heading', { name: 'Field report, not vanity dashboard.' })
      .locator('xpath=ancestor::section');
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

    const primaryMetricLines = await benchmarks.getByText('20–25%', { exact: true }).evaluate(
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

    for (const planName of ['Advisory', 'Delivery', 'Full-time']) {
      const plan = page
        .getByRole('heading', { name: planName, exact: true })
        .locator('xpath=ancestor::article');
      const [articleBox, headingBox, priceBox, descriptionBox, toggleBox, actionBox, hasOverflow] =
        await Promise.all([
          plan.boundingBox(),
          plan.getByRole('heading', { name: planName, exact: true }).boundingBox(),
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
    await footer.getByRole('link', { name: 'Privacy' }).click();
    await expect(page).toHaveURL(/\/privacy\/?$/);
    await expect(page).toHaveTitle('Privacy — Matteo');
    await expect(
      page.getByRole('heading', { name: 'Privacy without the surveillance novella.' })
    ).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Cookie Policy' })
      .click();
    await expect(page).toHaveURL(/\/cookies\/?$/);
    await expect(page).toHaveTitle('Cookie Policy — Matteo');
    await expect(
      page.getByRole('heading', { name: 'Cookies, minus the crumbs.' })
    ).toBeVisible();

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Terms of Service' })
      .click();
    await expect(page).toHaveURL(/\/terms\/?$/);
    await expect(page).toHaveTitle('Terms — Matteo');
    await expect(
      page.getByRole('heading', { name: 'Terms that fit on one reasonable page.' })
    ).toBeVisible();
  });

  test('documents the active measurement tools without claiming cookies', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /Anonymous audience measurement/ })).toBeVisible();
    await expect(page.getByText('Vercel Web Analytics runs on every page')).toBeVisible();
    await expect(page.getByText('Vercel Speed Insights runs on each page load')).toBeVisible();
    await expect(page.getByRole('main').getByRole('link', { name: 'Cookie Policy' })).toHaveAttribute(
      'href',
      '/cookies/'
    );

    await page.goto('/cookies', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(/does not set or read cookies/)).toBeVisible();
    await expect(page.getByText(/does not use third-party cookies/).first()).toBeVisible();
  });

  test('uses the requested Product and Company footer taxonomy', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const product = page.getByRole('navigation', { name: 'Product' });
    await expect(product.getByRole('link')).toHaveText([
      'Features',
      'Integrations',
      'Pricing',
      'Changelog',
    ]);

    const company = page.getByRole('navigation', { name: 'Company' });
    await expect(company.getByRole('link')).toHaveText([
      'Open source',
      'About',
      'Careers',
      'Customers',
    ]);

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
      await expect(footer).toContainText(`© ${new Date().getFullYear()} SyncTune`);
      const businessDetails = footer.locator(
        'dl[aria-label="Business registration details"]'
      );
      await expect(businessDetails.getByText('KVK', { exact: true })).toBeVisible();
      await expect(businessDetails.getByText('91602289', { exact: true })).toBeVisible();
      await expect(businessDetails.getByText('VAT', { exact: true })).toBeVisible();
      await expect(
        businessDetails.getByText('NL004901960B70', { exact: true })
      ).toBeVisible();

      const hasOverflow = await footer.evaluate(
        (element) => element.scrollWidth > element.clientWidth
      );
      expect(hasOverflow).toBe(false);
    }
  });

  test('calculates an advisory quote accessibly', async ({ page }) => {
    await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
    await page.locator('html[data-hydrated="true"]').waitFor();

    await page.getByLabel('Exact monthly hours').fill('20');
    await page.getByLabel('Engagement tier').selectOption('advisory');

    await expect(page.locator('output')).toHaveText('€2,000');
    await expect(page.getByRole('button', { name: '20h' })).toHaveAttribute('aria-pressed', 'true');
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

    await page.getByRole('button', { name: 'Load 7 more deployment history entries' }).click();
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
    await expect(page.getByRole('heading', { name: 'Endpoint not implemented.' })).toBeVisible();
  });
});
