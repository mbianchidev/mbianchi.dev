const fs = require('node:fs')
const path = require('node:path')
const pathRedirects = require('../src/data/redirects.json')

function getVercelRedirects() {
  return pathRedirects.flatMap(({ source, destination, permanent }) => {
    if (!source.startsWith('/') || source === '/' || source.endsWith('/')) {
      throw new Error(`Short-link sources must be non-root paths without a trailing slash: ${source}`)
    }

    return [source, `${source}/`].map((route) => ({
      source: route,
      destination,
      permanent,
    }))
  })
}

if (require.main === module) {
  const configPath = path.resolve(__dirname, '..', 'vercel.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  config.redirects = getVercelRedirects()
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
  console.log(`Synchronized ${config.redirects.length} Vercel short-link rules.`)
}

module.exports = { getVercelRedirects }
