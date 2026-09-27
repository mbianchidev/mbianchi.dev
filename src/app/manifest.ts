import type { MetadataRoute } from 'next'
import { getBasePath } from '@/lib/siteMetadata'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  const basePath = getBasePath()

  return {
    name: 'Matteo — The Human Platform',
    short_name: 'Matteo',
    description: 'Developer platforms, software, open source, customer work, and practical automation.',
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: 'standalone',
    background_color: '#0A0A0B',
    theme_color: '#00D9FF',
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
