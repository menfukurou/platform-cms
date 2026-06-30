import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getJournalPageParams } from '@/lib/journal'
import { isLocale, type Locale } from '@/i18n/locales'
import { pageAlternates } from '@/lib/seo'
import JournalListView from '@/components/journal/JournalListView'

/** 2 ページ目以降を静的生成 (`/journal/page/2` ...)。1 ページ目は `/journal`。 */
export function generateStaticParams() {
  return getJournalPageParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>
}): Promise<Metadata> {
  const { locale, page } = await params
  const t = await getTranslations({ locale, namespace: 'journal' })
  return {
    title: t('pageMetaTitle', { page }),
    description: t('meta.description'),
    alternates: pageAlternates(locale, `/journal/page/${page}`),
  }
}

export default async function JournalPagedPage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>
}) {
  const { locale, page } = await params
  setRequestLocale(locale)
  const n = Number(page)
  // page 1 は /journal 側。2 未満や非整数は 404。上限は JournalListView で判定。
  if (!isLocale(locale) || !Number.isInteger(n) || n < 2) notFound()
  return <JournalListView locale={locale as Locale} currentPage={n} />
}
