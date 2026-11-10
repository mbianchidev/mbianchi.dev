// next.config.js

const pathRedirects = require('./src/data/redirects.json')
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const configuredBasePath = process.env.NEXT_BASE_PATH?.trim()
const basePath =
  configuredBasePath && configuredBasePath !== '/'
    ? `/${configuredBasePath.replace(/^\/|\/$/g, '')}`
    : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  basePath,
  poweredByHeader: false,
  reactStrictMode: true,
  agentRules: false,
  images: {
    unoptimized: true,
  },
}

module.exports = (phase) => ({
  ...nextConfig,
  ...(phase === PHASE_DEVELOPMENT_SERVER
    ? { redirects: async () => pathRedirects }
    : { output: 'export' }),
})
