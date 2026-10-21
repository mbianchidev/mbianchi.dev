import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parseFrontMatter } from '../src/lib/frontMatter';

test.describe('Front matter compatibility', () => {
  test('parses YAML metadata without changing the Markdown body', () => {
    const content = '# Example\n\nFixture body.\n';
    const source = [
      '---',
      'title: Fixture',
      'date: "2030-01-01T09:00:00Z"',
      'editedAt: null',
      'tags: [alpha, beta]',
      '---',
      content,
    ].join('\n');

    expect(parseFrontMatter(source, 'fixture.md')).toEqual({
      data: {
        title: 'Fixture',
        date: '2030-01-01T09:00:00Z',
        editedAt: null,
        tags: ['alpha', 'beta'],
      },
      content,
    });
  });

  test('preserves content without front matter', () => {
    const content = '# Example\n\nNo metadata.\n';

    expect(parseFrontMatter(content, 'fixture.md')).toEqual({
      data: {},
      content,
    });
  });

  test('accepts a byte-order mark and CRLF line endings', () => {
    const content = '# Example\r\n\r\nFixture body.\r\n';
    const source = `\uFEFF---\r\ntitle: Fixture\r\n---\r\n${content}`;

    expect(parseFrontMatter(source, 'fixture.md')).toEqual({
      data: { title: 'Fixture' },
      content,
    });
  });

  for (const [name, metadata] of [
    ['sequence', '- item'],
    ['number', '42'],
    ['string', 'plain string'],
    ['timestamp', '2030-01-01'],
  ]) {
    test(`rejects a ${name} instead of a metadata mapping`, () => {
      expect(() =>
        parseFrontMatter(`---\n${metadata}\n---\nBody.\n`, 'invalid-fixture.md')
      ).toThrow(/invalid-fixture\.md/);
    });
  }

  test('reports the filename for malformed YAML', () => {
    expect(() =>
      parseFrontMatter('---\ntags: [unfinished\n---\nBody.\n', 'invalid-fixture.md')
    ).toThrow(/invalid-fixture\.md/);
  });

  test('does not enable executable YAML tags', () => {
    expect(() =>
      parseFrontMatter(
        '---\nvalue: !!js/function "function () { return 1 }"\n---\nBody.\n',
        'invalid-fixture.md'
      )
    ).toThrow(/unknown tag/);
  });
});

test('preserves the Next lint plugin directory-glob contract', ({}, testInfo) => {
  const projectRequire = createRequire(path.resolve('package.json'));
  const nextRequire = createRequire(
    projectRequire.resolve('@next/eslint-plugin-next')
  );
  const { getRootDirs }: {
    getRootDirs(context: {
      cwd: string;
      settings: { next: { rootDir: string | string[] } };
    }): string[];
  } = nextRequire('./utils/get-root-dirs.js');
  const root = testInfo.outputPath('glob-roots');
  const apps = path.join(root, 'apps');
  const expected = ['alpha', 'beta'];

  try {
    for (const name of expected) {
      fs.mkdirSync(path.join(apps, name, 'src'), { recursive: true });
    }
    fs.writeFileSync(path.join(apps, 'not-a-directory'), 'fixture');

    const patterns = [
      `${apps}/*`,
      `${apps}/{alpha,beta}`,
      `${apps}/{alpha,beta}`.replace(/\//g, '\\'),
      expected.map((name) => path.join(apps, name)),
    ];

    for (const rootDir of patterns) {
      const directories = getRootDirs({
        cwd: root,
        settings: { next: { rootDir } },
      });

      expect(directories.map((directory) => path.basename(directory)).sort())
        .toEqual(expected);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
