import { SITE_URL, SITE_NAME, ogImage } from '@/lib/site'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n/locales'

/**
 * SEO ヘルパ。canonical / hreflang alternates と JSON-LD 構造化データを組み立てる。
 * 全 URL は trailingSlash:true に合わせて末尾スラッシュ付きの絶対 URL にする。
 */

const withTrailingSlash = (u: string) => (u.endsWith('/') ? u : `${u}/`)

/** locale + locale-less path から絶対 URL (末尾 /)。path 例: '' | '/service' | '/journal/foo'。 */
export function localeUrl(locale: string, path = ''): string {
  return withTrailingSlash(new URL(`/${locale}${path}`, SITE_URL).toString())
}

/**
 * `generateMetadata` の `alternates`。canonical を現 locale の URL に、languages に
 * 各言語版 + x-default を並べる。これで `<link rel="canonical">` と `hreflang` が出る。
 */
export function pageAlternates(locale: string, path = '') {
  const languages: Record<string, string> = {}
  for (const l of SUPPORTED_LOCALES) languages[l] = localeUrl(l, path)
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, path)
  return { canonical: localeUrl(locale, path), languages }
}

const abs = (p: string) => new URL(p, SITE_URL).toString()

/** 運営元の Organization (publisher 共通)。 */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: abs('/'),
    logo: abs('/icon-192.png'),
  }
}

export function websiteLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: localeUrl(locale, ''),
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: abs('/') },
  }
}

export function blogPostingLd({
  locale,
  path,
  title,
  description,
  datePublished,
}: {
  locale: string
  path: string
  title: string
  description: string
  datePublished: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    inLanguage: locale,
    image: [abs(ogImage(locale).url)],
    mainEntityOfPage: { '@type': 'WebPage', '@id': localeUrl(locale, path) },
    author: { '@type': 'Organization', name: SITE_NAME, url: abs('/') },
    publisher: organizationLd(),
  }
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}
