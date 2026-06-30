/**
 * UI のクラス組み立てヘルパ。ボタン等の "見た目の語彙" を 1 か所に集約して、
 * ページ間で半径・余白・色がバラつく "ぎこちなさ" を防ぐ。Link / a / button の
 * どれにでも className として付けられるよう、component ではなく関数で提供する。
 */

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'inverted'
type Size = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2'

const VARIANTS: Record<Variant, string> = {
  // 主役。落ち着いた ink。グラデは使わない。
  primary: 'bg-slate-900 text-white shadow-soft hover:bg-slate-700',
  // アクセント。単色 violet。
  accent: 'bg-violet-600 text-white shadow-soft hover:bg-violet-500',
  // 副次。白地 + 枠線。
  outline: 'border border-slate-300 bg-white/80 text-slate-800 backdrop-blur hover:border-slate-400 hover:bg-white',
  // テキストリンク調。
  ghost: 'text-slate-700 hover:text-violet-700',
  // 暗い面の上で使う白ボタン。
  inverted: 'bg-white text-slate-900 shadow-soft hover:bg-slate-100',
}

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-[0.95rem]',
}

export function btn(
  variant: Variant = 'primary',
  size: Size = 'md',
  extra = ''
): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`.trim()
}
