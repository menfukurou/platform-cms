import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// static export 用に固定生成 (out/robots.txt として書き出される)。
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL.origin}/sitemap.xml`,
    host: SITE_URL.origin,
  }
}
