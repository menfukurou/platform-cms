import fs from 'node:fs'
import path from 'node:path'
import { SUPPORTED_LOCALES, type Locale } from '@/i18n/locales'

/**
 * Journal (お知らせ / 記事) の content 層。CMS の代替として、記事は
 * `content/journal/{locale}/{slug}.mdx` に Markdown/MDX のテキストで直接置く。
 * frontmatter でメタ情報を持たせ、ここでビルド時に fs から読んで一覧/詳細を生成する。
 *
 * すべて `node:fs` のビルド時読み込みなので RSC / generateStaticParams から呼べる
 * (static export と整合する)。client からは import しないこと。
 */

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'journal')

export type JournalMeta = {
  slug: string
  locale: Locale
  /** 記事タイトル。 */
  title: string
  /** 公開日 (YYYY-MM-DD)。一覧の並び替えキー。 */
  date: string
  /** 一覧/OG 用の要約。 */
  excerpt: string
  /** 「新アセスメント」「お知らせ」等のラベル。任意。 */
  tag?: string
  /** 推定読了時間 (分)。本文量から算出。 */
  readingMinutes: number
}

/**
 * 推定読了時間。日本語は文字数 / 500字・分、英語は語数 / 200語・分で見積もる
 * (markdown 記号は概算なので厳密には除かない)。最低 1 分。
 */
function readingMinutes(content: string, locale: Locale): number {
  if (locale === 'ja-JP') {
    const chars = content.replace(/\s/g, '').length
    return Math.max(1, Math.round(chars / 500))
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export type JournalPost = JournalMeta & {
  /** frontmatter を除いた MDX 本文。 */
  content: string
}

/**
 * ごく軽量な frontmatter パーサ。先頭の `---` で挟まれた YAML 風ブロックから
 * `key: value` を取り出す (値は文字列のみ、必要十分)。外部依存を増やさないため自前。
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(raw)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    // 前後のクォートを剥がす。
    value = value.replace(/^["']|["']$/g, '')
    if (key) data[key] = value
  }
  return { data, content: raw.slice(match[0].length) }
}

function localeDir(locale: Locale): string {
  return path.join(CONTENT_ROOT, locale)
}

/** 指定 locale の全 slug。記事ファイルが無い locale は空配列。 */
export function getJournalSlugs(locale: Locale): string[] {
  const dir = localeDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

/** 指定 locale / slug の記事を読む。存在しなければ null。 */
export function getJournalPost(locale: Locale, slug: string): JournalPost | null {
  const dir = localeDir(locale)
  const file = ['.mdx', '.md']
    .map((ext) => path.join(dir, `${slug}${ext}`))
    .find((p) => fs.existsSync(p))
  if (!file) return null

  const raw = fs.readFileSync(file, 'utf8')
  const { data, content } = parseFrontmatter(raw)
  return {
    slug,
    locale,
    title: data.title ?? slug,
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    tag: data.tag || undefined,
    readingMinutes: readingMinutes(content, locale),
    content,
  }
}

/** 指定 locale の記事メタ一覧。公開日の降順 (新しい順)。 */
export function getJournalList(locale: Locale): JournalMeta[] {
  return getJournalSlugs(locale)
    .map((slug) => getJournalPost(locale, slug))
    .filter((p): p is JournalPost => p !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

/** 全 locale × 全 slug。journal/[slug] の generateStaticParams 用。 */
export function getAllJournalParams(): { locale: Locale; slug: string }[] {
  return SUPPORTED_LOCALES.flatMap((locale) =>
    getJournalSlugs(locale).map((slug) => ({ locale, slug }))
  )
}

/** 一覧の 1 ページあたり件数。route と一覧 UI で共有する。 */
export const JOURNAL_PER_PAGE = 10

/** 指定 locale の総ページ数 (最低 1)。 */
export function getJournalTotalPages(locale: Locale): number {
  return Math.max(1, Math.ceil(getJournalSlugs(locale).length / JOURNAL_PER_PAGE))
}

/**
 * 静的ページネーション用の params。ページ 1 は `/journal` が担うので、
 * ここでは 2 ページ目以降 (`/journal/page/{n}`) のみを返す。
 */
export function getJournalPageParams(): { locale: Locale; page: string }[] {
  return SUPPORTED_LOCALES.flatMap((locale) => {
    const total = getJournalTotalPages(locale)
    const params: { locale: Locale; page: string }[] = []
    for (let p = 2; p <= total; p++) params.push({ locale, page: String(p) })
    return params
  })
}

/** locale を意識した公開日フォーマット (YYYY-MM-DD → ロケール表記)。 */
export function formatDate(date: string, locale: Locale): string {
  if (!date) return ''
  const d = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}
