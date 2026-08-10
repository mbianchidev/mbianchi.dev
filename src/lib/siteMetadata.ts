import type { Metadata } from 'next'
import {
  siteConfig,
  socialImages,
  type SocialImageKey,
} from '@/lib/siteConfig'

export const siteUrl = siteConfig.url

export interface SocialImageDefinition {
  src: string
  width?: number
  height?: number
  alt?: string
  type?: string
}

export type SocialImageSource = SocialImageKey | SocialImageDefinition

export function getSocialImageDefinition(
  image: SocialImageSource,
  imageAlt?: string
): SocialImageDefinition {
  const selectedImage = typeof image === 'string' ? socialImages[image] : image
  const alt = imageAlt ?? selectedImage.alt

  return {
    ...selectedImage,
    ...(alt ? { alt } : {}),
  }
}

export function getBasePath() {
  const configuredBasePath = process.env.NEXT_BASE_PATH?.trim()

  if (!configuredBasePath || configuredBasePath === '/') {
    return ''
  }

  return `/${configuredBasePath.replace(/^\/|\/$/g, '')}`
}

export function withBasePath(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  const basePath = getBasePath()

  if (
    !basePath
    || normalizedPath === basePath
    || normalizedPath.startsWith(`${basePath}/`)
  ) {
    return normalizedPath
  }

  return `${basePath}${normalizedPath}`
}

function normalizePath(pathname: string) {
  const basePath = getBasePath()
  const pathWithoutBase =
    basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
      ? pathname.slice(basePath.length)
      : pathname

  return pathWithoutBase.startsWith('/') ? pathWithoutBase : `/${pathWithoutBase}`
}

export function createSiteUrl(pathname: string) {
  return new URL(normalizePath(pathname), siteUrl)
}

export function createAbsoluteImageUrl(pathname: string) {
  const imageUrl = createSiteUrl(pathname)

  if (imageUrl.origin !== siteUrl.origin) {
    throw new Error(`Social preview images must use the production origin: ${pathname}`)
  }

  return imageUrl
}

export function resolveSocialImage(image: SocialImageSource, imageAlt?: string) {
  const selectedImage = getSocialImageDefinition(image, imageAlt)

  return {
    url: createAbsoluteImageUrl(selectedImage.src),
    ...(selectedImage.width ? { width: selectedImage.width } : {}),
    ...(selectedImage.height ? { height: selectedImage.height } : {}),
    ...(selectedImage.alt ? { alt: selectedImage.alt } : {}),
    ...(selectedImage.type ? { type: selectedImage.type } : {}),
  }
}

interface PageMetadata {
  title: string
  description: string
  path: string
  image?: SocialImageSource
  imageAlt?: string
}

export function createPageMetadata({
  title,
  description,
  path,
  image = 'profile',
  imageAlt,
}: PageMetadata): Metadata {
  const canonical = createSiteUrl(path)
  const socialImage = resolveSocialImage(image, imageAlt)

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: socialImage.url,
          alt: socialImage.alt,
        },
      ],
    },
  }
}

interface ArticleMetadata extends PageMetadata {
  publishedTime: string
  modifiedTime?: string
  authors: string[]
  tags: string[]
}

export function createArticleMetadata({
  title,
  description,
  path,
  image = 'profile',
  imageAlt,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: ArticleMetadata): Metadata {
  const metadata = createPageMetadata({
    title,
    description,
    path,
    image,
    imageAlt,
  })

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      ...(modifiedTime ? { modifiedTime } : {}),
      authors,
      tags,
    },
  }
}
