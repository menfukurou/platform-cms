import fs from 'node:fs'
import path from 'node:path'
import { SUPPORTED_LOCALES, type Locale } from '@/i18n/locales'

/**
 * 法務ページ (プライバシーポリシー / 利用規約) の content 層。
 * `content/legal/{locale}/{slug}.mdx` に MDX で置き、frontmatter に title / updated を持たせる。
 * Journal と同様にビルド時 fs 読み込みなので RSC / generateStaticParams から呼べる。
 */

const ROOT = path.join(process.cwd(), 'content', 'legal')

export const LEGAL_SLUGS = ['privacy', 'terms'] as const
export type LegalSlug = (typeof LEGAL_SLUGS)[number]

export type LegalDoc = {
  slug: string
  locale: Locale
  title: string
  /** 最終更新日 (YYYY-MM-DD)。 */
  updated: string
  content: string
}

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(raw)
  if (!match) return { data: {}, content: raw }
  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  }
  return { data, content: raw.slice(match[0].length) }
}

export function getLegalDoc(locale: Locale, slug: string): LegalDoc | null {
  const file = path.join(ROOT, locale, `${slug}.mdx`)
  if (!fs.existsSync(file)) return null
  const { data, content } = parseFrontmatter(fs.readFileSync(file, 'utf8'))
  return {
    slug,
    locale,
    title: data.title ?? slug,
    updated: data.updated ?? '',
    content,
  }
}

/** 全 locale × 全 slug。legal/[slug] の generateStaticParams 用。 */
export function getAllLegalParams(): { locale: Locale; slug: LegalSlug }[] {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    LEGAL_SLUGS.filter((slug) => getLegalDoc(locale, slug) !== null).map((slug) => ({
      locale,
      slug,
    }))
  )
}
