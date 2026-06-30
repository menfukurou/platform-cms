'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Search } from '@/components/icons'

/**
 * Journal 一覧の検索 / ジャンルフィルター / ページネーション。
 *
 * - デフォルト（検索もフィルターも無し）: server が決めた `currentPage` のスライスを表示し、
 *   ページ送りは **静的ページへの実リンク**（/journal, /journal/page/2 ...）。SSG でクロール可能。
 * - 検索 or フィルター中: 全件 `allItems` から client で絞り込み、結果を client 側でページング。
 *   検索結果は URL を持たない（インデックス対象外で問題ない）。
 */

export type JournalItem = {
  slug: string
  title: string
  excerpt: string
  tag: string
  dateLabel: string
  readingMinutes: number
}

const pageHref = (n: number) => (n <= 1 ? '/journal' : `/journal/page/${n}`)

/** 1, …, current-1, current, current+1, …, total という省略付きのページ範囲。 */
function pageRange(current: number, total: number): (number | '…')[] {
  const out: (number | '…')[] = []
  let prev = 0
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      if (prev && i - prev > 1) out.push('…')
      out.push(i)
      prev = i
    }
  }
  return out
}

export default function JournalBrowser({
  allItems,
  tags,
  currentPage,
  totalPages,
  perPage,
}: {
  allItems: JournalItem[]
  tags: string[]
  currentPage: number
  totalPages: number
  perPage: number
}) {
  const t = useTranslations('journal')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [clientPage, setClientPage] = useState(1)

  const isFiltering = query.trim() !== '' || activeTag !== null

  // 検索語 / フィルターが変わったら client ページを 1 に戻す。
  useEffect(() => {
    setClientPage(1)
  }, [query, activeTag])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allItems.filter((p) => {
      if (activeTag && p.tag !== activeTag) return false
      if (!q) return true
      return `${p.title} ${p.excerpt}`.toLowerCase().includes(q)
    })
  }, [allItems, query, activeTag])

  const view = isFiltering ? filtered : allItems
  const viewPage = isFiltering ? clientPage : currentPage
  const viewTotal = isFiltering ? Math.max(1, Math.ceil(filtered.length / perPage)) : totalPages
  const start = (viewPage - 1) * perPage
  const pageItems = view.slice(start, start + perPage)
  const shownCount = isFiltering ? filtered.length : allItems.length

  function clearAll() {
    setQuery('')
    setActiveTag(null)
  }

  return (
    <div>
      {/* ツールバー: ジャンル + 検索 */}
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip active={activeTag === null} onClick={() => setActiveTag(null)}>
            {t('filterAll')}
          </FilterChip>
          {tags.map((tag) => (
            <FilterChip key={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)}>
              {tag}
            </FilterChip>
          ))}
        </div>

        <label className="relative w-full lg:w-72">
          <span className="sr-only">{t('searchLabel')}</span>
          <Search
            width={17}
            height={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-full border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </label>
      </div>

      <p className="mt-5 text-sm text-slate-500">{t('count', { count: shownCount })}</p>

      {/* 結果 */}
      {pageItems.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center">
          <p className="text-slate-600">{t('noResults')}</p>
          {isFiltering ? (
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-600"
            >
              {t('clear')}
            </button>
          ) : null}
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {pageItems.map((post) => (
            <li key={post.slug}>
              <Card
                post={post}
                readMore={t('readMore')}
                readingTime={t('readingTime', { minutes: post.readingMinutes })}
              />
            </li>
          ))}
        </ul>
      )}

      {/* ページネーション: 検索中は client ボタン、通常は静的リンク */}
      {viewTotal > 1 ? (
        isFiltering ? (
          <ClientPagination
            current={clientPage}
            total={viewTotal}
            onPage={setClientPage}
            prevLabel={t('prev')}
            nextLabel={t('next')}
          />
        ) : (
          <StaticPagination
            current={currentPage}
            total={totalPages}
            prevLabel={t('prev')}
            nextLabel={t('next')}
          />
        )
      ) : null}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-900 text-white'
          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  )
}

/* ----------------------------------------------------------- pagination */

function StaticPagination({
  current,
  total,
  prevLabel,
  nextLabel,
}: {
  current: number
  total: number
  prevLabel: string
  nextLabel: string
}) {
  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="pagination">
      {current > 1 ? (
        <PageLink href={pageHref(current - 1)} ariaLabel={prevLabel}>
          <ArrowRight width={16} height={16} className="rotate-180" />
        </PageLink>
      ) : (
        <PageDisabled>
          <ArrowRight width={16} height={16} className="rotate-180" />
        </PageDisabled>
      )}

      {pageRange(current, total).map((n, i) =>
        n === '…' ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : n === current ? (
          <PageCurrent key={n}>{n}</PageCurrent>
        ) : (
          <PageLink key={n} href={pageHref(n)}>
            {n}
          </PageLink>
        )
      )}

      {current < total ? (
        <PageLink href={pageHref(current + 1)} ariaLabel={nextLabel}>
          <ArrowRight width={16} height={16} />
        </PageLink>
      ) : (
        <PageDisabled>
          <ArrowRight width={16} height={16} />
        </PageDisabled>
      )}
    </nav>
  )
}

function ClientPagination({
  current,
  total,
  onPage,
  prevLabel,
  nextLabel,
}: {
  current: number
  total: number
  onPage: (n: number) => void
  prevLabel: string
  nextLabel: string
}) {
  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="pagination">
      <PageButton disabled={current === 1} onClick={() => onPage(current - 1)} ariaLabel={prevLabel}>
        <ArrowRight width={16} height={16} className="rotate-180" />
      </PageButton>

      {pageRange(current, total).map((n, i) =>
        n === '…' ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-slate-400">
            …
          </span>
        ) : (
          <PageButton key={n} active={n === current} onClick={() => onPage(n)}>
            {n}
          </PageButton>
        )
      )}

      <PageButton
        disabled={current === total}
        onClick={() => onPage(current + 1)}
        ariaLabel={nextLabel}
      >
        <ArrowRight width={16} height={16} />
      </PageButton>
    </nav>
  )
}

const baseCell =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors'
const inactiveCell = 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'

function PageLink({
  href,
  ariaLabel,
  children,
}: {
  href: string
  ariaLabel?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} aria-label={ariaLabel} className={`${baseCell} ${inactiveCell}`}>
      {children}
    </Link>
  )
}

function PageCurrent({ children }: { children: React.ReactNode }) {
  return <span className={`${baseCell} bg-violet-600 text-white`} aria-current="page">{children}</span>
}

function PageDisabled({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${baseCell} cursor-not-allowed border border-slate-200 bg-white text-slate-300`}>
      {children}
    </span>
  )
}

function PageButton({
  active = false,
  disabled = false,
  onClick,
  ariaLabel,
  children,
}: {
  active?: boolean
  disabled?: boolean
  onClick: () => void
  ariaLabel?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={`${baseCell} ${
        active
          ? 'bg-violet-600 text-white'
          : `${inactiveCell} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`
      }`}
    >
      {children}
    </button>
  )
}

/* ----------------------------------------------------------------- card */

function Card({
  post,
  readMore,
  readingTime,
}: {
  post: JournalItem
  readMore: string
  readingTime: string
}) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lift sm:p-9"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {post.tag ? (
          <span className="rounded-full bg-violet-50 px-2.5 py-1 font-medium text-violet-700">
            {post.tag}
          </span>
        ) : null}
        <span className="text-slate-400">{post.dateLabel}</span>
        <span aria-hidden className="text-slate-300">·</span>
        <span className="text-slate-400">{readingTime}</span>
      </div>

      <h2 className="display mt-5 text-xl font-bold text-slate-900 transition-colors group-hover:text-violet-700 sm:text-2xl">
        {post.title}
      </h2>
      <p className="mt-3 line-clamp-3 flex-1 leading-relaxed text-slate-600">{post.excerpt}</p>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700">
        {readMore}
        <ArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
