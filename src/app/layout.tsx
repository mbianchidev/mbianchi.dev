import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Archivo_Black, Public_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { siteConfig } from '@/lib/siteConfig'
import { resolveSocialImage, siteUrl } from '@/lib/siteMetadata'

const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-archivo-black',
})

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteConfig.name,
  title: siteConfig.title,
  description: siteConfig.description,
  authors: [siteConfig.author],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  referrer: 'strict-origin-when-cross-origin',
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [resolveSocialImage('profile')],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [resolveSocialImage('profile')],
  },
  appleWebApp: {
    capable: true,
    title: 'Matteo',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0A0A0B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${publicSans.variable} ${archivoBlack.variable}`}
    >
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}