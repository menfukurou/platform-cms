import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, localizedSiteName, ogImage } from '@/lib/site'
import { organizationLd, websiteLd } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
})

/** static export: 全 locale 分の `/{locale}/...` をビルド時に生成する。 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const name = localizedSiteName(locale)
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return {
    metadataBase: SITE_URL,
    title: { default: name, template: `%s | ${name}` },
    description: t('description'),
    icons: {
      // Google 検索のファビコンは ICO/PNG が確実に拾われるため、ラスタも併記する。
      icon: [
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    openGraph: {
      type: 'website',
      siteName: name,
      title: name,
      description: t('description'),
      locale: locale.replace('-', '_'),
      images: [ogImage(locale)],
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: t('description'),
      images: [ogImage(locale)],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${inter.variable} ${notoSansJp.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd(locale)} />
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col bg-linear-to-b from-slate-50 via-white to-slate-50">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
