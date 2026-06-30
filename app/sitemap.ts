import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import { getJournalSlugs } from '@/lib/journal'

// static export 用に固定生成 (out/sitemap.xml として書き出される)。
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.origin
  const staticPaths = ['', '/service', '/about', '/journal']
  const entries: MetadataRoute.Sitemap = []

  for (const locale of SUPPORTED_LOCALES) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}/`,
        changeFrequency: path === '/journal' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      })
    }
    for (const slug of getJournalSlugs(locale)) {
      entries.push({
        url: `${base}/${locale}/journal/${slug}/`,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return entries
}
