/** ブランドロゴ。グラデのバッジ + wordmark。platform-web のヘッダー意匠に揃える。 */
export default function BrandMark({
  showWordmark = true,
  className = '',
}: {
  showWordmark?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative inline-flex h-8 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-2 text-[10px] font-bold tracking-wider text-white shadow-sm shadow-violet-500/30">
        Terumiu
      </span>
      {showWordmark ? (
        <span className="hidden text-base font-semibold tracking-tight text-slate-900 min-[420px]:inline">
          Terumiu
        </span>
      ) : null}
    </span>
  )
}
