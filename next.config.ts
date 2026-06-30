import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // CMS の代替として「記事を静的書き出しして配信する」用途なので、Next を
  // フル static export する。middleware / redirects() / route handler は使わず、
  // 全ページを generateStaticParams でビルド時に生成して GitHub Pages に置く。
  output: 'export',
  // static export では next/image の最適化サーバが無いので unoptimized 必須。
  images: { unoptimized: true },
  // GitHub Pages は `/ja-JP/` のようなディレクトリ index.html を素直に返せる。
  // trailingSlash で全 route を `*/index.html` 形式に揃え、ルートの redirect 先も
  // `/ja-JP/` で一致させる。
  trailingSlash: true,
}

export default withNextIntl(nextConfig)
