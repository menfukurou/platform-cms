import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import {
  getAllJournalParams,
  getJournalPost,
  formatDate,
} from '@/lib/journal'
import { isLocale, type Locale } from '@/i18n/locales'
import { ogImage } from '@/lib/site'
import { pageAlternates, blogPostingLd, breadcrumbLd, localeUrl } from '@/lib/seo'
import Container from '@/components/ui/Container'
import MdxContent from '@/components/mdx/MdxContent'
import CtaBand from '@/components/CtaBand'
import JsonLd from '@/components/JsonLd'
import { ArrowRight } from '@/components/icons'

/** 全 locale × 全 slug をビルド時に生成。 */
export function generateStaticParams() {
  return getAllJournalParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = getJournalPost(locale, slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: pageAlternates(locale, `/journal/${slug}`),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date || undefined,
      images: [ogImage(locale)],
    },
  }
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  if (!isLocale(locale)) notFound()
  const loc = locale as Locale
  const post = getJournalPost(loc, slug)
  if (!post) notFound()

  const t = await getTranslations({ locale, namespace: 'journal' })
  const path = `/journal/${slug}`
  const articleLd = blogPostingLd({
    locale,
    path,
    title: post.title,
    description: post.excerpt,
    datePublished: post.date,
  })
  const crumbLd = breadcrumbLd([
    { name: 'Terumiu', url: localeUrl(loc, '') },
    { name: t('hero.title'), url: localeUrl(loc, '/journal') },
    { name: post.title, url: localeUrl(loc, path) },
  ])

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={crumbLd} />
      <article className="relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-16">
        <div aria-hidden className="bg-grid absolute inset-x-0 top-0 h-64 [mask-image:linear-gradient(black,transparent)] opacity-60" />
        <div aria-hidden className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl" />
        <Container className="relative max-w-3xl">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-violet-700"
          >
            <ArrowRight width={15} height={15} className="rotate-180" />
            {t('backToList')}
          </Link>

          <header className="mt-6 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-400">
              {post.tag ? (
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                  {post.tag}
                </span>
              ) : null}
              <time dateTime={post.date}>{t('publishedOn', { date: formatDate(post.date, loc) })}</time>
              <span aria-hidden>·</span>
              <span>{t('readingTime', { minutes: post.readingMinutes })}</span>
            </div>
            <h1 className="display mt-4 text-3xl font-bold text-slate-900 sm:text-[2.6rem]">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>
            ) : null}
          </header>

          <div className="mt-2">
            <MdxContent source={post.content} />
          </div>

          <div className="mt-14 border-t border-slate-200 pt-8">
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-600"
            >
              <ArrowRight width={15} height={15} className="rotate-180" />
              {t('backToList')}
            </Link>
          </div>
        </Container>
      </article>

      <CtaBand />
    </>
  )
}
