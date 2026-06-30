import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CONTACT_FORM_URL } from '@/lib/site'
import { pageAlternates } from '@/lib/seo'
import Container from '@/components/ui/Container'
import PageHero from '@/components/PageHero'
import { ArrowUpRight, Compass, Spark } from '@/components/icons'

export function generateStaticParams() {
  return [{ locale: 'ja-JP' }, { locale: 'en-US' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about.meta' })
  return { title: t('title'), description: t('description'), alternates: pageAlternates(locale, '/about') }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <AboutHero />
      <AboutBody />
      <OperatorSection />
    </>
  )
}

function AboutHero() {
  const t = useTranslations('about.hero')
  return <PageHero kicker={t('kicker')} title={t('title')} lead={t('lead')} />
}

function AboutBody() {
  const t = useTranslations('about')
  const blocks = [
    { title: t('mission.title'), body: t('mission.body'), Icon: Compass },
    { title: t('story.title'), body: t('story.body'), Icon: Spark },
  ]
  return (
    <section className="pb-20 pt-6 sm:pb-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {blocks.map(({ title, body, Icon }, i) => (
            <article
              key={i}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon width={22} height={22} />
              </span>
              <h2 className="mt-6 text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-4 leading-[1.9] text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

function OperatorSection() {
  const t = useTranslations('about.operator')
  const items = t.raw('items') as { label: string; value: string }[]
  return (
    <section className="section-y pt-0">
      <Container>
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-200 bg-slate-50/70 px-8 py-6 sm:px-10">
            <h2 className="text-xl font-semibold text-slate-900">{t('title')}</h2>
          </div>
          <dl className="divide-y divide-slate-100">
            {items.map((row, i) => (
              <div key={i} className="grid grid-cols-1 gap-1 px-8 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:px-10">
                <dt className="text-sm font-medium text-slate-500">{row.label}</dt>
                <dd className="text-slate-800">{row.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-1 gap-2 px-8 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:px-10">
              <dt className="text-sm font-medium text-slate-500">{t('contactLabel')}</dt>
              <dd>
                <p className="text-slate-600">{t('contactBody')}</p>
                <a
                  href={CONTACT_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-600"
                >
                  {t('contactLabel')}
                  <ArrowUpRight width={14} height={14} />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  )
}
