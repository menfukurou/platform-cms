import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from './locales'

/**
 * locale 解決。static export なので cookie / headers は読まない (= 読むと
 * dynamic 化して export が失敗する)。URL の `[locale]` segment のみを採用し、
 * 未知 locale は defaultLocale に倒す。
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const messages = (await import(`../messages/${locale}.json`)).default
  return { locale, messages }
})
