import { useId } from 'react'

/**
 * Terumiu ブランドマーク「Teru Mark」。頭文字 T を 3 つのやさしい形で構成:
 * 左上=半円 / 右上=葉(成長・気づき) / 縦=カプセル(軸)。左上=濃 右下=明の青紫グラデ。
 * (sample.png を忠実にベクター化)
 */
function TeruShapes({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <path d="M20,17 L44,17 Q50,17 50,23 L50,24 A18 16 0 0 1 14,24 L14,23 Q14,17 20,17 Z" />
      <path d="M51,40 C 52,25 66,17 80,16.5 Q87,16 85.5,23 C 84,34 63,42 51,40 Z" />
      <rect x="36" y="41" width="15" height="43" rx="7.5" />
    </g>
  )
}

/** シンボル単体。fill 未指定はブランドの青紫グラデ。 */
export function TeruMark({ size = 30, fill }: { size?: number; fill?: string }) {
  const id = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden focusable="false">
      {fill ? null : (
        <defs>
          <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="20" y1="18" x2="80" y2="84">
            <stop offset="0" stopColor="#5a27d2" />
            <stop offset="0.5" stopColor="#8a63f0" />
            <stop offset="1" stopColor="#c3b4fa" />
          </linearGradient>
        </defs>
      )}
      <TeruShapes fill={fill ?? `url(#${id})`} />
    </svg>
  )
}

/** ロックアップ（シンボル + ワードマーク）。ヘッダー/フッターで使用。 */
export default function BrandMark({
  showWordmark = true,
  className = '',
}: {
  showWordmark?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <TeruMark size={34} />
      {showWordmark ? (
        <span className="text-[1.35rem] font-bold tracking-tight text-slate-900">
          Terumiu
        </span>
      ) : null}
    </span>
  )
}
