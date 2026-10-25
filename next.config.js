// next.config.js

const pathRedirects = require('./src/data/redirects.json')
const configuredBasePath = process.env.NEXT_BASE_PATH?.trim()
const basePath =
  configuredBasePath && configuredBasePath !== '/'
    ? `/${configuredBasePath.replace(/^\/|\/$/g, '')}`
    : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  poweredByHeader: false,
  reactStrictMode: true,
  agentRules: false,
  async redirects() {
    return pathRedirects
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
