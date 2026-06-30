import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllLegalParams, getLegalDoc } from '@/lib/legal'
import { formatDate } from '@/lib/journal'
import { isLocale, type Locale } from '@/i18n/locales'
import Container from '@/components/ui/Container'
import PageHero from '@/components/PageHero'
import MdxContent from '@/components/mdx/MdxContent'

export function generateStaticParams() {
  return getAllLegalParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const doc = getLegalDoc(locale, slug)
  if (!doc) return {}
  return { title: doc.title, description: doc.title }
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  if (!isLocale(locale)) notFound()
  const loc = locale as Locale
  const doc = getLegalDoc(loc, slug)
  if (!doc) notFound()
  const t = await getTranslations({ locale, namespace: 'legal' })

  return (
    <>
      <PageHero kicker={t('kicker')} title={doc.title}>
        {doc.updated ? (
          <p className="text-sm text-slate-500">{t('updated', { date: formatDate(doc.updated, loc) })}</p>
        ) : null}
      </PageHero>
      <section className="pb-20 pt-2 sm:pb-24">
        <Container className="max-w-3xl">
          <MdxContent source={doc.content} />
        </Container>
      </section>
    </>
  )
}
