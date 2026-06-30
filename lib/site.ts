/**
 * サイト全体で使う定数。SEO / metadata / 外部リンク。
 */

/** 公開 origin。`metadataBase` / sitemap / canonical 用。独自ドメイン (ルート) 配信。 */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://terumiu.com'
export const SITE_URL = new URL(RAW_SITE_URL)

export const SITE_NAME = 'Terumiu'

/** 運営するサービス本体 (platform-web / Grader) の URL。 */
export const APP_URL = 'https://app.terumiu.com'

/** locale 別の Grader 入口。 */
export function graderUrl(locale: string): string {
  return `${APP_URL}/${locale}/apps/grader`
}

/** 問い合わせ窓口 (Google フォーム)。platform-web と共通。 */
export const CONTACT_FORM_URL = 'https://forms.gle/txFeHYCUgw1bD6mv6'

/** locale 別の表示用サイト名。日本語のみ読み仮名を併記してブランド検索を取りこぼさない。 */
export function localizedSiteName(locale: string): string {
  return locale === 'ja-JP' ? 'テルミュ（Terumiu）' : SITE_NAME
}

/** locale 別の OG 画像 (public/og/og-<locale>.png)。未知 locale は default に倒す。 */
export function ogImage(locale: string) {
  const known = locale === 'ja-JP' || locale === 'en-US'
  return {
    url: known ? `/og/og-${locale}.png` : '/og-default.png',
    width: 1200,
    height: 630,
    alt: SITE_NAME,
  }
}
