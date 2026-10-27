import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parseFrontMatter } from '../src/lib/frontMatter';

const postsDirectory = path.join(process.cwd(), 'content/blog');
const articles = fs.readdirSync(postsDirectory)
  .filter((file) => file.endsWith('.md') && !['README.md', '_template.md'].includes(file))
  .map((file) => {
    const source = fs.readFileSync(path.join(postsDirectory, file), 'utf8');
    const { data } = parseFrontMatter(source, file);
    const draft = file.startsWith('_');
    const slug = file.replace(/^_/, '').replace(/\.md$/, '');

    return {
      file,
      route: `/blog/${draft ? 'draft/' : ''}${slug}/`,
      draft,
      cover: typeof data.image === 'string' && data.image.startsWith('/') ? data.image : null,
    };
  });

test('keeps blog image assets in WebP format', () => {
  const files = fs.readdirSync('public/images/blog', { recursive: true });
  const legacyImages = files.filter((file) =>
    /\.(?:avif|gif|jpe?g|png|svg|tiff?|bmp)$/i.test(String(file))
  );

  expect(legacyImages).toEqual([]);
});

test('imports mock image assets without changing prose, pixels, or animation timing', async ({}, testInfo) => {
  const directory = testInfo.outputPath('image-import-fixture');
  const images = path.join(directory, 'public/images/blog');
  const posts = path.join(directory, 'content/blog');
  const script = path.resolve('scripts/optimize-blog-images.cjs');
  const animationHeader = '47494638396101000100800000000000ffffff21ff0b4e45545343415045322e300301000000';
  const blackFrame = '21f90400050000002c0000000001000100000202440100';
  const whiteFrame = '21f904000a0000002c00000000010001000002024c0100';
  const animation = Buffer.from(`${animationHeader}${blackFrame}${whiteFrame}3b`, 'hex');
  const repeatedAnimation = Buffer.from(
    `${animationHeader}${blackFrame}${blackFrame}${whiteFrame}3b`,
    'hex'
  );
  const source = [
    '---',
    'title: Fixture',
    'date: "2030-01-01"',
    'image: "/images/blog/fixture.png" # Retained fixture comment',
    '---',
    '# Fixture',
    '',
    '![Fixture](/images/blog/fixture.png)',
    '![Animation][animation]',
    '![Repeated animation](/images/blog/repeated.gif)',
    '',
    '[animation]: /images/blog/animation.gif "Fixture animation"',
    '',
    '`/images/blog/fixture.png` is a code example.',
    '',
  ].join('\n');

  try {
    fs.mkdirSync(images, { recursive: true });
    fs.mkdirSync(posts, { recursive: true });
    const png = await sharp({
      create: { width: 4, height: 3, channels: 4, background: { r: 10, g: 30, b: 80, alpha: 0.5 } },
    }).png().toBuffer();
    fs.writeFileSync(path.join(images, 'fixture.png'), png);
    fs.writeFileSync(path.join(images, 'animation.gif'), animation);
    fs.writeFileSync(path.join(images, 'repeated.gif'), repeatedAnimation);
    fs.writeFileSync(path.join(posts, 'fixture.md'), source);
    const run = () => execFileSync(process.execPath, [script], {
      cwd: directory,
      encoding: 'utf8',
      timeout: 30_000,
    });

    run();
    const converted = fs.readFileSync(path.join(posts, 'fixture.md'), 'utf8');
    const original = parseFrontMatter(source, 'fixture.md');
    const prepared = parseFrontMatter(converted, 'fixture.md');
    expect(prepared.data).toEqual({ ...original.data, image: '/images/blog/fixture.webp' });
    expect(converted).toContain('# Retained fixture comment');
    expect(prepared.content).toBe(original.content
      .replace('![Fixture](/images/blog/fixture.png)', '![Fixture](/images/blog/fixture.webp)')
      .replace('[animation]: /images/blog/animation.gif', '[animation]: /images/blog/animation.webp')
      .replace('![Repeated animation](/images/blog/repeated.gif)', '![Repeated animation](/images/blog/repeated.webp)'));
    expect(await sharp(path.join(images, 'fixture.webp')).ensureAlpha().raw().toBuffer())
      .toEqual(await sharp(png).ensureAlpha().raw().toBuffer());

    const before = await sharp(animation, { animated: true }).metadata();
    const after = await sharp(path.join(images, 'animation.webp'), { animated: true }).metadata();
    expect(after.format).toBe('webp');
    expect(after.pages).toBe(before.pages);
    expect(after.loop).toBe(before.loop);
    expect(after.delay).toEqual(before.delay);
    expect(await sharp(path.join(images, 'animation.webp'), { animated: true }).ensureAlpha().raw().toBuffer())
      .toEqual(await sharp(animation, { animated: true }).ensureAlpha().raw().toBuffer());

    const repeatedBefore = await sharp(repeatedAnimation, { animated: true }).metadata();
    const repeatedAfter = await sharp(path.join(images, 'repeated.webp'), { animated: true }).metadata();
    const beforePixels = await sharp(repeatedAnimation, { animated: true }).ensureAlpha().raw().toBuffer();
    const afterPixels = await sharp(path.join(images, 'repeated.webp'), { animated: true }).ensureAlpha().raw().toBuffer();
    if (!repeatedBefore.delay || !repeatedAfter.delay) {
      throw new Error('The repeated-frame fixture lost its animation timing');
    }
    expect(repeatedAfter.loop).toBe(repeatedBefore.loop);
    expect(repeatedAfter.delay.reduce((sum, delay) => sum + delay, 0))
      .toBe(repeatedBefore.delay.reduce((sum, delay) => sum + delay, 0));
    const frameAt = (pixels: Buffer, delays: number[], time: number) => {
      let end = 0;
      for (let frame = 0; frame < delays.length; frame += 1) {
        end += delays[frame];
        if (time < end) return pixels.subarray(frame * 4, (frame + 1) * 4);
      }
      throw new Error('No fixture frame at the requested time');
    };
    for (const time of [0, 49, 50, 99, 100, 150, 199]) {
      expect(frameAt(afterPixels, repeatedAfter.delay, time))
        .toEqual(frameAt(beforePixels, repeatedBefore.delay, time));
    }

    run();
    expect(fs.readFileSync(path.join(posts, 'fixture.md'), 'utf8')).toBe(converted);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

for (const article of articles) {
  test(`renders blog media, list markers, and section links for ${article.file}`, async ({
    page,
    request,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(article.route, { waitUntil: 'networkidle' });

    if (article.draft) {
      await page.getByLabel('Preview password').fill('thereisnocowlevel');
      await page.getByLabel('Preview password').press('Enter');
    }

    const body = page.getByRole('article');
    await expect(body).toBeVisible();
    const imageSources = await body.locator('img').evaluateAll((images) =>
      images.map((image) => image.getAttribute('src'))
    );
    const sources = [...new Set([
      ...(article.cover ? [article.cover] : []),
      ...imageSources,
    ])];

    for (const source of sources) {
      expect(source, article.file).toMatch(/^\/images\/blog\/.+\.webp$/);
      if (!source) {
        throw new Error(`Missing image source in ${article.file}`);
      }

      const publicRoot = fs.realpathSync('public');
      const asset = fs.realpathSync(path.resolve(publicRoot, `.${source}`));
      const relative = path.relative(publicRoot, asset);
      expect(relative.startsWith('..') || path.isAbsolute(relative)).toBe(false);
      expect((await sharp(asset, { animated: true }).metadata()).format).toBe('webp');

      const response = await request.get(source);
      expect(response.ok(), source).toBe(true);
      expect(response.headers()['content-type'], source).toContain('image/webp');
      expect((await sharp(await response.body()).metadata()).format, source).toBe('webp');
    }

    await body.locator('img').evaluateAll((images) => {
      for (const image of images) {
        if (image instanceof HTMLImageElement) {
          image.loading = 'eager';
        }
      }
    });
    await expect.poll(() => body.locator('img').evaluateAll((images) =>
      images.every((image) =>
        image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0
      )
    ), { timeout: 10_000 }).toBe(true);

    const markers = await body.locator('li').evaluateAll((items) =>
      items.map((item) => ({
        task: item.classList.contains('task-list-item'),
        style: getComputedStyle(item).listStyleType,
      }))
    );
    for (const marker of markers) {
      if (marker.task) {
        expect(marker.style).toBe('none');
      } else {
        expect(marker.style).not.toBe('none');
      }
    }

    const ids = await body.locator('[id]').evaluateAll((elements) =>
      elements.map((element) => element.id)
    );
    expect(new Set(ids).size).toBe(ids.length);
    const fragments = await body.locator('a[href^="#"]').evaluateAll((links) =>
      links.flatMap((link) => {
        const href = link.getAttribute('href');
        return href && href.length > 1 ? [href.slice(1)] : [];
      })
    );
    for (const fragment of fragments) {
      expect(ids).toContain(decodeURIComponent(fragment));
    }

    const headings = await body.locator('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
      .evaluateAll((elements) => elements.map((element) => ({
        id: element.id,
        title: element.textContent?.replace(/\s+/g, ' ').trim(),
      })));
    const contentsLinks = body.getByRole('navigation').getByRole('link');
    for (const link of await contentsLinks.all()) {
      const fragment = (await link.getAttribute('href'))?.slice(1);
      const heading = headings.find((heading) => heading.id === fragment);

      expect(heading, article.file).toBeDefined();
      expect((await link.innerText()).replace(/\s+/g, ' ').trim()).toBe(heading?.title);
    }

    if (await contentsLinks.count()) {
      const firstLink = contentsLinks.first();
      await firstLink.focus();
      await firstLink.press('Enter');
      await expect.poll(() => page.evaluate(() => window.location.hash))
        .toBe(await firstLink.getAttribute('href'));
    }
  });
}
