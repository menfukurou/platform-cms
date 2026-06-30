import type { ReactNode } from 'react'

/** セクション上部の小見出し (eyebrow)。小さめ・字間広め・muted で品よく。 */
export default function Eyebrow({
  children,
  className = '',
  tone = 'accent',
}: {
  children: ReactNode
  className?: string
  tone?: 'accent' | 'light'
}) {
  const color = tone === 'light' ? 'text-violet-300' : 'text-violet-600'
  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${color} ${className}`}
    >
      <span className="h-px w-5 bg-current opacity-50" aria-hidden />
      {children}
    </span>
  )
}
