import type { MetadataRoute } from 'next'
import { SUPPORTED_LOCALES } from '@/i18n/locales'
import { getJournalSlugs, getJournalTotalPages } from '@/lib/journal'
import { localeUrl } from '@/lib/seo'

// static export 用に固定生成 (out/sitemap.xml として書き出される)。
export const dynamic = 'force-static'

/** locale-less path から hreflang alternates (全言語版) を組む。 */
function languages(path: string): Record<string, string> {
  const map: Record<string, string> = {}
  for (const l of SUPPORTED_LOCALES) map[l] = localeUrl(l, path)
  return map
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  const add = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']) => {
    for (const locale of SUPPORTED_LOCALES) {
      entries.push({
        url: localeUrl(locale, path),
        changeFrequency,
        priority,
        alternates: { languages: languages(path) },
      })
    }
  }

  // 主要ページ
  add('', 1, 'monthly')
  add('/service', 0.8, 'monthly')
  add('/about', 0.6, 'monthly')
  add('/journal', 0.9, 'weekly')
  add('/legal/privacy', 0.3, 'yearly')
  add('/legal/terms', 0.3, 'yearly')

  // ジャーナル記事 (slug は日英ミラー)
  for (const slug of getJournalSlugs('ja-JP')) {
    add(`/journal/${slug}`, 0.6, 'monthly')
  }

  // ジャーナルのページネーション (2ページ目以降)。総数は locale 共通前提。
  const totalPages = getJournalTotalPages('ja-JP')
  for (let p = 2; p <= totalPages; p++) {
    add(`/journal/page/${p}`, 0.4, 'weekly')
  }

  return entries
}
