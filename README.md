# platform-cms

Terumiu 運営事務局のコーポレートサイト。CMS の代わりに、記事を Markdown/MDX のテキストで
直接書いて **Next.js の静的書き出し (SSG)** で配信する構成。日英 (ja-JP / en-US) 対応。

参考: 隣の `platform-web` (Next.js 16 + next-intl + Tailwind v4)。本リポジトリはそれに
スタックとデザインを揃えつつ、サーバ配信ではなく static export + GitHub Pages にしている。

## スタック

- Next.js 16 (App Router, `output: 'export'`)
- next-intl v4 (URL prefix 方式 `/{locale}/...`、日英)
- Tailwind CSS v4
- MDX 記事 (`next-mdx-remote/rsc`, ビルド時 compile)

## ディレクトリ

```
app/[locale]/            … 各言語ページ (TOP / service / about / journal)
content/journal/{locale} … 記事 (.mdx)。frontmatter: title / date / excerpt / tag
components/               … Header / Footer / LanguageSwitcher / MDX など
i18n/                     … locale 定義・routing・request config
messages/{locale}.json    … UI 文言
public/                   … index.html(ルート言語振り分け) / CNAME / .nojekyll / favicon
```

## 記事の追加

`content/journal/{locale}/<slug>.mdx` を追加するだけ。frontmatter 例:

```mdx
---
title: 記事タイトル
date: 2026-07-01
excerpt: 一覧/OG に出る要約。
tag: お知らせ
---

本文を Markdown / MDX で。
```

ja-JP と en-US で同じ slug にしておくと、言語スイッチャーで相互に行き来できる。

## 開発

```bash
npm install
npm run dev      # http://localhost:3000 (→ /ja-JP/ にリダイレクト)
npm run build    # out/ に静的サイトを書き出し
```

## デプロイ

`main` への push / `v*` タグ / 手動実行で `.github/workflows/deploy.yml` が走り、
`out/` を **GitHub Pages** に公開する。独自ドメイン `terumiu.com` (apex) を `public/CNAME`
で指定済み。GitHub 側の設定:

1. リポジトリ Settings → Pages → Source = "GitHub Actions"
2. Settings → Pages → Custom domain = `terumiu.com`
3. DNS: apex `terumiu.com` を GitHub Pages の A/AAAA レコードに向ける
   (`app.terumiu.com` のサービス本体とは別レコードなので共存可)
