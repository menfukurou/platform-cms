import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import {
  getJournalList,
  formatDate,
  getJournalTotalPages,
  JOURNAL_PER_PAGE,
} from '@/lib/journal'
import { type Locale } from '@/i18n/locales'
import PageHero from '@/components/PageHero'
import Container from '@/components/ui/Container'
import CtaBand from '@/components/CtaBand'
import JournalBrowser, { type JournalItem } from '@/components/journal/JournalBrowser'

/**
 * `/journal`（1ページ目）と `/journal/page/[page]`（2ページ目以降）で共有する一覧ビュー。
 * 全記事メタ + 現在ページ番号を JournalBrowser に渡す。デフォルトは静的ページの
 * スライスを表示し、検索/フィルター時のみ client が全件から絞り込む。
 */
export default async function JournalListView({
  locale,
  currentPage,
}: {
  locale: Locale
  currentPage: number
}) {
  const t = await getTranslations({ locale, namespace: 'journal' })
  const posts = getJournalList(locale)
  const totalPages = getJournalTotalPages(locale)

  // 範囲外ページは 404（page 1 は /journal 側で扱う）。
  if (currentPage < 1 || currentPage > totalPages) notFound()

  const items: JournalItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tag: p.tag ?? '',
    dateLabel: formatDate(p.date, locale),
    readingMinutes: p.readingMinutes,
  }))
  const tags = [...new Set(items.map((i) => i.tag).filter(Boolean))]

  return (
    <>
      <PageHero kicker={t('hero.kicker')} title={t('hero.title')} lead={t('hero.lead')} />
      <section className="pb-20 pt-2 sm:pb-24">
        <Container>
          {items.length === 0 ? (
            <p className="text-slate-500">{t('empty')}</p>
          ) : (
            <JournalBrowser
              allItems={items}
              tags={tags}
              currentPage={currentPage}
              totalPages={totalPages}
              perPage={JOURNAL_PER_PAGE}
            />
          )}
        </Container>
      </section>
      <CtaBand />
    </>
  )
}
