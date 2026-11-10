import fs from 'node:fs'
import path from 'node:path'
import pathRedirects from '@/data/redirects.json'

const appDirectory = path.join(process.cwd(), 'src/app')
const pageFilePattern = /^page\.(?:[jt]sx?)$/
const redirectRoutes = new Set(pathRedirects.map(({ source }) => normalizeRoute(source)))

function normalizeRoute(route: string) {
  const normalized = route.replace(/^\/|\/$/g, '')

  if (normalized === '') {
    return '/'
  }

  return `/${normalized}/`
}

function isRouteGroup(segment: string) {
  return segment.startsWith('(') && segment.endsWith(')')
}

function routeFromPageFile(pageFile: string) {
  const relativeDirectory = path.relative(appDirectory, path.dirname(pageFile))
  const segments = relativeDirectory === '' ? [] : relativeDirectory.split(path.sep)

  if (
    segments.some(
      (segment) =>
        segment.startsWith('[')
        || segment.startsWith('@')
        || segment.startsWith('_')
        || (segment.startsWith('(') && !isRouteGroup(segment))
    )
  ) {
    return null
  }

  const routeSegments = segments.filter((segment) => !isRouteGroup(segment))
  return normalizeRoute(routeSegments.join('/'))
}

function hasNoIndexMetadata(pageFile: string) {
  const sourceFiles = [pageFile]
  let directory = path.dirname(pageFile)

  while (directory.startsWith(appDirectory)) {
    for (const extension of ['ts', 'tsx', 'js', 'jsx']) {
      const layoutFile = path.join(directory, `layout.${extension}`)
      if (fs.existsSync(layoutFile)) {
        sourceFiles.push(layoutFile)
      }
    }

    if (directory === appDirectory) {
      break
    }

    directory = path.dirname(directory)
  }

  return sourceFiles.some((sourceFile) => {
    const source = fs.readFileSync(sourceFile, 'utf8')
    return (
      source.includes('shortLinkMetadata')
      || /\brobots\s*:\s*\{[\s\S]{0,500}?\bindex\s*:\s*false\b/.test(source)
      || /\brobots\s*:\s*(['"])[^'"]*\bnoindex\b[^'"]*\1/i.test(source)
    )
  })
}

function findPageFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return findPageFiles(entryPath)
      }

      return pageFilePattern.test(entry.name) ? [entryPath] : []
    })
}

export function getPublicStaticRoutes() {
  if (!fs.existsSync(appDirectory)) {
    return []
  }

  const routeFiles = findPageFiles(appDirectory)
    .map((pageFile) => ({ pageFile, route: routeFromPageFile(pageFile) }))
    .filter(
      (entry): entry is { pageFile: string; route: string } => entry.route !== null
    )

  return [
    ...new Set(
      routeFiles
        .filter(({ route }) => !route.startsWith('/redirect/'))
        .filter(({ route }) => !redirectRoutes.has(route))
        .filter(({ pageFile }) => !hasNoIndexMetadata(pageFile))
        .map(({ route }) => route)
    ),
  ].sort()
}

export function getRobotsDisallowRoutes() {
  return [
    '/redirect/',
    ...[...redirectRoutes].filter((route) => route !== '/').sort(),
  ]
}
