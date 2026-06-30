import { useLocale, useTranslations } from 'next-intl'
import { graderUrl } from '@/lib/site'
import { btn } from '@/lib/ui'
import Container from '@/components/ui/Container'
import { ArrowUpRight } from '@/components/icons'

/** ページ下部の共通 CTA 帯。下層ページが余白で間延びしないよう締めに置く。 */
export default function CtaBand() {
  const t = useTranslations('home.cta')
  const locale = useLocale()
  return (
    <section className="section-y pt-0">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-linear-to-br from-slate-50 to-violet-50/50 px-8 py-14 text-center sm:px-12 sm:py-16">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="display text-2xl font-bold text-slate-900 sm:text-3xl">{t('title')}</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{t('lead')}</p>
            <a href={graderUrl(locale)} target="_blank" rel="noreferrer" className={btn('primary', 'lg', 'mt-8')}>
              {t('button')}
              <ArrowUpRight width={16} height={16} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
