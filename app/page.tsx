import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
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
export const metadata: Metadata = {
  title: 'Terumiu',
  alternates: { canonical: new URL(`/${DEFAULT_LOCALE}/`, SITE_URL).toString() },
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
