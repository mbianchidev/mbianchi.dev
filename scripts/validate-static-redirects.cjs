const fs = require('node:fs')
const path = require('node:path')
const { isDeepStrictEqual } = require('node:util')
const pathRedirects = require('../src/data/redirects.json')
const vercelConfig = require('../vercel.json')
const { getVercelRedirects } = require('./sync-vercel-redirects.cjs')

const projectRoot = path.resolve(__dirname, '..')
const failures = []

if (!isDeepStrictEqual(vercelConfig.redirects, getVercelRedirects())) {
  failures.push('Vercel short-link rules are out of sync. Run npm run redirects:sync and commit vercel.json.')
}

for (const redirect of pathRedirects) {
  const routeSource = path.join(
    projectRoot,
    'src',
    'app',
    redirect.source.slice(1),
    'page.tsx'
  )
  const exportedPage = path.join(
    projectRoot,
    'out',
    redirect.source.slice(1),
    'index.html'
  )

  if (
    !fs.existsSync(routeSource)
    || !fs.readFileSync(routeSource, 'utf8').includes(`source="${redirect.source}"`)
  ) {
    failures.push(`Missing or incorrect short-link route: ${redirect.source}`)
  }

  if (!fs.existsSync(exportedPage)) {
    failures.push(`Missing exported short-link page: ${redirect.source}`)
    continue
  }

  if (!fs.readFileSync(exportedPage, 'utf8').includes(redirect.destination)) {
    failures.push(`Wrong exported destination for: ${redirect.source}`)
  }
}

const resumePath = path.join(
  projectRoot,
  'out',
  'static',
  'Matteo_Bianchi_resume.pdf'
)

if (
  !fs.existsSync(resumePath)
  || !fs.readFileSync(resumePath).subarray(0, 5).equals(Buffer.from('%PDF-'))
) {
  failures.push('Missing or invalid exported resume PDF')
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(`Validated ${pathRedirects.length} exported short links, their Vercel rules, and resume PDF.`)
