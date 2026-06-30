import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './locales'

/**
 * URL の locale prefix 制御。本サイトは全 page が `/{locale}/...` を持つ構成
 * (`localePrefix: 'always'`)。static export では middleware が動かないため、
 * locale 切替は LanguageSwitcher から navigation utilities (useRouter) 経由で
 * client side に行う。ルート `/` の redirect は public/index.html が担当する。
 */
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
})

export const { Link, redirect, useRouter, usePathname, getPathname } =
  createNavigation(routing)
