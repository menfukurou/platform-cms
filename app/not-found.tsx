import Link from 'next/link'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import './globals.css'

/**
 * locale segment の外側 (= 不明な URL) で表示する global 404。static export では
 * これが `out/404.html` になり、GitHub Pages が未知パスに対して返す。i18n context が
 * 無いので翻訳は使わず、日英併記の固定文言にする。
 *
 * `<html>` / `<body>` は描画しない。root layout が無いため Next が既定シェル
 * (`<html><body>`) を供給する。ここで自前 `<html>` を持つと既定シェルと二重になり、
 * `out/404.html` が `<html><body><html>` の入れ子 = 不正 HTML / hydration mismatch
 * になる (本番出力にも出る)。中身だけ返してシェルに載せる。
 */
export const metadata = { title: '404 — Terumiu' }

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-900 antialiased">
      <p className="bg-linear-to-br from-indigo-600 to-fuchsia-600 bg-clip-text text-7xl font-bold text-transparent">
        404
      </p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
        ページが見つかりません
      </h1>
      <p className="mt-1 text-slate-500">Page not found</p>
      <Link
        href={`/${DEFAULT_LOCALE}/`}
        className="mt-8 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:from-indigo-500 hover:to-violet-500"
      >
        トップへ戻る / Back to home
      </Link>
    </main>
  )
}
