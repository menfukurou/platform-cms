import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isLocale, type Locale } from '@/i18n/locales'
import { pageAlternates } from '@/lib/seo'
import JournalListView from '@/components/journal/JournalListView'

export function generateStaticParams() {
  return [{ locale: 'ja-JP' }, { locale: 'en-US' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'journal.meta' })
  return { title: t('title'), description: t('description'), alternates: pageAlternates(locale, '/journal') }
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = (isLocale(locale) ? locale : 'ja-JP') as Locale
  return <JournalListView locale={loc} currentPage={1} />
}
