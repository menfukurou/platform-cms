import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { graderUrl } from '@/lib/site'
import { getJournalList, formatDate } from '@/lib/journal'
import { isLocale, type Locale } from '@/i18n/locales'
import { btn } from '@/lib/ui'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import ResultCard from '@/components/visuals/ResultCard'
import { ArrowRight, ArrowUpRight, Layers, Chart, Globe, Compass, Heart, Bookmark } from '@/components/icons'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.meta' })
  return { title: t('title'), description: t('description') }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = isLocale(locale) ? getJournalList(locale).slice(0, 3) : []

  return (
    <>
      <Hero />
      <ServiceSection />
      <ValuesSection />
      <JournalSection posts={posts} locale={locale as Locale} />
      <AboutTeaser />
      <CtaSection />
    </>
  )
}

/* ---------------------------------------------------------------- Hero */

function Hero() {
  const t = useTranslations('home.hero')
  const visualT = useTranslations('home.visual')
  const statsT = useTranslations('home.stats')
  const locale = useLocale()
  const stats = statsT.raw('items') as { value: string; label: string }[]
  const traits = visualT.raw('traits') as string[]
  const tags = visualT.raw('tags') as string[]

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-70" />
      <div aria-hidden className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-violet-200/40 blur-3xl" />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-12 py-20 sm:py-24 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:py-28">
          <div className="md:max-w-xl">
            <Eyebrow>{t('kicker')}</Eyebrow>
            <h1 className="display mt-5 whitespace-pre-line text-pretty text-[2.1rem] font-bold text-slate-900 xs:text-4xl sm:text-[2.9rem] md:text-4xl lg:text-[2.9rem]">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 md:max-w-md">{t('lead')}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/service" className={btn('primary', 'lg')}>
                {t('ctaPrimary')}
                <ArrowRight width={16} height={16} />
              </Link>
              <a href={graderUrl(locale)} target="_blank" rel="noreferrer" className={btn('ghost', 'lg')}>
                {t('ctaSecondary')}
                <ArrowUpRight width={15} height={15} />
              </a>
            </div>

            <dl className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
              {stats.map((s, i) => (
                <div key={i} className="flex items-baseline gap-1.5">
                  <dt className="font-semibold text-slate-900">{s.value}</dt>
                  <dd className="text-slate-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex justify-center md:justify-end">
            <ResultCard
              title={visualT('title')}
              scoreLabel={visualT('score')}
              traits={traits}
              tags={tags}
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------- Service */

const SERVICE_ICONS = [Layers, Chart, Globe]

function ServiceSection() {
  const t = useTranslations('home.service')
  const locale = useLocale()
  const features = t.raw('features') as { title: string; body: string }[]

  return (
    <section className="section-y">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50/70 px-6 py-12 sm:px-12 sm:py-16">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
          <div className="relative">
            <div className="max-w-2xl">
              <Eyebrow>{t('kicker')}</Eyebrow>
              <h2 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{t('lead')}</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
              {features.map((f, i) => {
                const Icon = SERVICE_ICONS[i] ?? Layers
                return (
                  <div key={i} className="bg-white p-7">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Icon width={22} height={22} />
                    </span>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-10">
              <a href={graderUrl(locale)} target="_blank" rel="noreferrer" className={btn('primary', 'lg')}>
                {t('cta')}
                <ArrowUpRight width={16} height={16} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* -------------------------------------------------------------- Values */

const VALUE_ICONS = [Compass, Heart, Bookmark]

function ValuesSection() {
  const t = useTranslations('home.values')
  const items = t.raw('items') as { title: string; body: string }[]

  return (
    <section className="section-y pt-0">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{t('kicker')}</Eyebrow>
          <h2 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((v, i) => {
            const Icon = VALUE_ICONS[i] ?? Compass
            return (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-shadow hover:shadow-lift"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-600/25 transition-colors group-hover:bg-violet-500">
                  <Icon width={20} height={20} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.body}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------- Journal */

function JournalSection({ posts, locale }: { posts: ReturnType<typeof getJournalList>; locale: Locale }) {
  const t = useTranslations('home.journal')
  if (posts.length === 0) return null

  return (
    <section className="section-y pt-0">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <Eyebrow>{t('kicker')}</Eyebrow>
            <h2 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{t('lead')}</p>
          </div>
          <Link href="/journal" className="group shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
            {t('viewAll')}
            <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
            >
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                {post.tag ? (
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 font-medium text-violet-700">{post.tag}</span>
                ) : null}
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-violet-700">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">
                {t('readMore')}
                <ArrowRight width={15} height={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}

          {/* 件数が 3 未満のときグリッドを埋める "すべて見る" タイル (空白の不格好さを防ぐ)。 */}
          {posts.length < 3 ? (
            <Link
              href="/journal"
              className="group flex min-h-[12rem] flex-col justify-end rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 transition-colors hover:border-violet-300 hover:bg-violet-50/30"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 shadow-soft transition-colors group-hover:text-violet-600">
                <ArrowRight width={20} height={20} />
              </span>
              <span className="mt-5 text-base font-semibold text-slate-900">{t('viewAll')}</span>
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------- About teaser */

function AboutTeaser() {
  const t = useTranslations('home.about')
  const op = useTranslations('footer')
  return (
    <section className="section-y pt-0">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-16 sm:px-14 sm:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <Eyebrow tone="light">{t('kicker')}</Eyebrow>
            <h2 className="display mt-4 text-3xl font-bold text-white sm:text-4xl">{t('title')}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">{t('lead')}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/about" className={btn('inverted', 'lg')}>
                {t('cta')}
                <ArrowRight width={16} height={16} />
              </Link>
              <span className="text-sm text-slate-400">{op('operator')}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ----------------------------------------------------------------- CTA */

function CtaSection() {
  const t = useTranslations('home.cta')
  const locale = useLocale()
  return (
    <section className="section-y border-t border-slate-200/70 bg-white pt-0">
      <Container>
        <div className="mx-auto max-w-2xl pt-20 text-center sm:pt-28">
          <h2 className="display text-3xl font-bold text-slate-900 sm:text-[2.6rem]">{t('title')}</h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{t('lead')}</p>
          <a
            href={graderUrl(locale)}
            target="_blank"
            rel="noreferrer"
            className={btn('accent', 'lg', 'mt-9')}
          >
            {t('button')}
            <ArrowUpRight width={16} height={16} />
          </a>
        </div>
      </Container>
    </section>
  )
}
