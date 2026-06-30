import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { graderUrl } from '@/lib/site'
import { pageAlternates } from '@/lib/seo'
import { btn } from '@/lib/ui'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import CtaBand from '@/components/CtaBand'
import ResultCard from '@/components/visuals/ResultCard'
import { ArrowUpRight, Layers, Chart, Globe, Compass, Sprout, Users } from '@/components/icons'

export function generateStaticParams() {
  return [{ locale: 'ja-JP' }, { locale: 'en-US' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'service.meta' })
  return { title: t('title'), description: t('description'), alternates: pageAlternates(locale, '/service') }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <ServiceHero />
      <ServiceFeatures />
      <ServiceSteps />
      <ServiceAudience />
      <CtaBand />
    </>
  )
}

/* ヒーロー: テキスト + 結果ビジュアルを 1 つに統合 (旧ヒーロー/ショーケースの重複を解消)。 */
function ServiceHero() {
  const t = useTranslations('service.hero')
  const visualT = useTranslations('home.visual')
  const locale = useLocale()
  return (
    <section className="relative overflow-hidden border-b border-slate-200/60">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-70" />
      <div aria-hidden className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-violet-200/40 blur-3xl" />
      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 py-16 sm:py-20 md:grid-cols-[1.05fr_0.95fr] md:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:py-24">
          <div className="md:max-w-xl">
            <Eyebrow>{t('kicker')}</Eyebrow>
            <h1 className="display mt-5 text-5xl font-bold text-slate-900 sm:text-6xl">{t('title')}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 md:max-w-md">{t('lead')}</p>
            <div className="mt-8">
              <a href={graderUrl(locale)} target="_blank" rel="noreferrer" className={btn('primary', 'lg')}>
                {t('cta')}
                <ArrowUpRight width={16} height={16} />
              </a>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <ResultCard
              title={visualT('title')}
              scoreLabel={visualT('score')}
              traits={visualT.raw('traits') as string[]}
              tags={visualT.raw('tags') as string[]}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

const FEATURE_ICONS = [Layers, Chart, Globe]

function ServiceFeatures() {
  const cap = useTranslations('service.capabilities')
  const home = useTranslations('home.service')
  const features = home.raw('features') as { title: string; body: string }[]
  return (
    <section className="section-y">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{cap('kicker')}</Eyebrow>
          <h2 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{cap('title')}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = FEATURE_ICONS[i] ?? Layers
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-shadow hover:shadow-lift"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Icon width={22} height={22} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function ServiceSteps() {
  const t = useTranslations('service')
  const sections = t.raw('sections') as { title: string; body: string }[]
  return (
    <section className="section-y bg-slate-50/70 pt-0">
      <Container>
        <div className="border-t border-slate-200 pt-16 sm:pt-20">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{t('howTitle')}</h2>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
            {sections.map((s, i) => (
              <div key={i} className="relative">
                {/* ステップ間をつなぐ細線 (md 以上)。 */}
                {i < sections.length - 1 ? (
                  <span aria-hidden className="absolute left-12 top-4 hidden h-px w-full bg-slate-200 md:block" />
                ) : null}
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

const AUDIENCE_ICONS = [Compass, Sprout, Users]

function ServiceAudience() {
  const t = useTranslations('service.audience')
  const items = t.raw('items') as { title: string; body: string }[]
  return (
    <section className="section-y pt-0">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{t('kicker')}</Eyebrow>
          <h2 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h2>
        </div>

        {/* 入れ子のチップをやめ、アイコン + 見出し + 補足の編集的 3 カラム。md 以上は左罫線で区切る。 */}
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {items.map((p, i) => {
            const Icon = AUDIENCE_ICONS[i] ?? Compass
            return (
              <div
                key={i}
                className="sm:border-l sm:border-slate-200 sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm shadow-violet-600/25">
                  <Icon width={24} height={24} />
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-600">{p.body}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
