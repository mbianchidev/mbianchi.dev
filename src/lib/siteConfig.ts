import socialImageCatalog from '@/data/socialImages.json'

export const siteConfig = {
  name: 'Matteo',
  title: 'Matteo — The Human Platform',
  description:
    'Matteo Bianchi builds developer platforms, ships software, works with customers, automates boring work, and contributes to open source.',
  url: new URL('https://mbianchi.dev'),
  locale: 'en_US',
  author: {
    name: 'Matteo Bianchi',
    url: new URL('https://mbianchi.dev/about/'),
  },
} as const

export const profilePortrait = socialImageCatalog.profile
export const socialImages = socialImageCatalog

export type SocialImageKey = keyof typeof socialImages

export function isSocialImageKey(value: unknown): value is SocialImageKey {
  return (
    typeof value === 'string'
    && Object.prototype.hasOwnProperty.call(socialImages, value)
  )
}
