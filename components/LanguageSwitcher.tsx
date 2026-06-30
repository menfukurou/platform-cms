'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { SUPPORTED_LOCALES, type Locale } from '@/i18n/locales'

/**
 * 言語切替。static export では middleware が無いので、next-intl の navigation
 * utilities (localePrefix='always') で現 path の locale を差し替えて client side に
 * 遷移する。`usePathname()` は locale prefix を剥がした path を返すので、
 * `router.replace(pathname, {locale})` で同じ page の別言語版に飛べる。
 */
export default function LanguageSwitcher() {
  const t = useTranslations('common.language')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function change(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <label
      className={`inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white/70 py-1 pl-2 pr-1 text-sm text-slate-700 backdrop-blur transition-colors ${
        isPending ? 'opacity-50' : 'hover:border-slate-300'
      }`}
      title={t('label')}
    >
      <GlobeIcon />
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        value={locale}
        disabled={isPending}
        onChange={(e) => change(e.target.value as Locale)}
        className="cursor-pointer border-none bg-transparent pr-1 text-sm focus:outline-none disabled:cursor-not-allowed"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {t(l)}
          </option>
        ))}
      </select>
    </label>
  )
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-500"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
