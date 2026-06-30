/**
 * locale の定数 / 型 / 判定ヘルパ。
 *
 * server-only API に依存しないので client component / routing config / request config
 * のいずれからも import できる。platform-web の同名ファイルを踏襲しつつ、本サイトは
 * 日英のみ展開なので 2 locale に絞っている。
 */

export const SUPPORTED_LOCALES = ['ja-JP', 'en-US'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ja-JP'

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    (SUPPORTED_LOCALES as readonly string[]).includes(value)
  )
}
