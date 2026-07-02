import type { Metadata } from 'next'
import { SITE_URL, SITE_NAME, ogImage } from '@/lib/site'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import './globals.css'

/**
 * ルート `/` の言語振り分け。static export では middleware が無く、また
 * `next dev` は `public/index.html` を `/` に割り当てない (= dev だと root が 404)
 * ため、振り分けを React 側の root page に一本化する。これで dev / 本番
 * (`out/index.html`) の双方で同じ挙動になる。
 *
 * 自前 `<html>` は描画しない。root layout が無いので Next が既定シェル
 * (`<html><body>`) を供給する ([not-found](not-found.tsx) と同じ理由)。
 *
 * 下の inline script が同期実行で `navigator.language` を判定し、日本語なら
 * `/ja-JP/`、それ以外は `/en-US/` へ `location.replace` する。JS 無効時のみ
 * `<noscript>` の meta refresh で既定 (ja-JP) にフォールバックする。
 */
/**
 * ルート `/` は JS で言語振り分けするが、SNS のクローラ (Twitterbot 等) は JS を
 * 実行せず素のドメイン (terumiu.com/) をそのまま読む。ここに OG/Twitter メタが無いと
 * X などでカード画像が出ないため、ルートにも og:image 等を明示する。
 */
const ROOT_URL = new URL(`/${DEFAULT_LOCALE}/`, SITE_URL).toString()
const ROOT_DESC =
  'Terumiu は、性格・スキル・興味関心を測る公開アセスメント「Grader」を運営するプロダクトスタジオです。'
const ROOT_TITLE = '自分を知る、ひとつのアセスメントから。'

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: SITE_NAME,
  description: ROOT_DESC,
  alternates: { canonical: ROOT_URL },
  // Google はサイトのファビコンをホーム (= ルート) の <head> から拾うため、ルートにも明示する。
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: ROOT_TITLE,
    description: ROOT_DESC,
    url: ROOT_URL,
    locale: 'ja_JP',
    images: [ogImage(DEFAULT_LOCALE)],
  },
  twitter: {
    card: 'summary_large_image',
    title: ROOT_TITLE,
    description: ROOT_DESC,
    images: [ogImage(DEFAULT_LOCALE).url],
  },
}

const REDIRECT_SCRIPT = `(function () {
  var supported = ['ja-JP', 'en-US'];
  var lang = (navigator.language || 'ja').toLowerCase();
  var target = lang.indexOf('ja') === 0 ? 'ja-JP' : 'en-US';
  if (supported.indexOf(target) === -1) target = 'ja-JP';
  location.replace('/' + target + '/');
})();`

export default function RootRedirect() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-slate-600 antialiased">
      {/* parse 時に同期実行され、描画より先に location.replace する。 */}
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${DEFAULT_LOCALE}/`} />
      </noscript>
      <p style={{ fontFamily: 'sans-serif' }}>
        Redirecting… <a href="/ja-JP/">日本語</a> / <a href="/en-US/">English</a>
      </p>
    </main>
  )
}
