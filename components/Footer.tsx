import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { graderUrl, CONTACT_FORM_URL } from '@/lib/site'
import BrandMark from '@/components/BrandMark'
import { ArrowUpRight } from '@/components/icons'

/**
 * フッター。server component (next-intl の useTranslations は server/client 両対応)。
 * 著作権 year はビルド時固定値 (static export と整合)。
 */
export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const legal = useTranslations('legal')
  const locale = useLocale()
  const year = new Date().getFullYear()

  const linkClass = 'text-sm text-slate-500 transition-colors hover:text-slate-900'

  return (
    <footer className="relative mt-auto border-t border-slate-200/70 bg-white">
      {/* 上辺の細いブランドアクセント。 */}
      <div aria-hidden className="h-px w-full bg-linear-to-r from-transparent via-violet-300/60 to-transparent" />

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr] lg:px-8">
        {/* brand は狭幅で 2 列ぶんを使い、サイト/サービスを下段 2 カラムに。lg で 3 カラム横並び。 */}
        <div className="col-span-2 max-w-sm lg:col-span-1">
          <BrandMark />
          <p className="mt-5 text-sm leading-relaxed text-slate-500">{t('tagline')}</p>
        </div>

        <nav>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {t('sections.site')}
          </h3>
          <ul className="mt-4 space-y-3">
            <li><Link href="/service" className={linkClass}>{nav('service')}</Link></li>
            <li><Link href="/about" className={linkClass}>{nav('about')}</Link></li>
            <li><Link href="/journal" className={linkClass}>{nav('journal')}</Link></li>
          </ul>
        </nav>

        <nav>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            {t('sections.service')}
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={graderUrl(locale)} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-1 ${linkClass}`}>
                Grader
                <ArrowUpRight width={13} height={13} className="text-slate-400 transition-colors group-hover:text-slate-700" />
              </a>
            </li>
            <li>
              <a href={CONTACT_FORM_URL} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-1 ${linkClass}`}>
                {nav('contact')}
                <ArrowUpRight width={13} height={13} className="text-slate-400 transition-colors group-hover:text-slate-700" />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{t('copyright', { year })}</p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/legal/privacy" className="transition-colors hover:text-slate-700">
              {legal('privacy')}
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-slate-700">
              {legal('terms')}
            </Link>
            <span className="text-slate-400">{t('operator')}</span>
          </nav>
        </div>
      </div>
    </footer>
  )
}
