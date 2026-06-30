/**
 * Hero の主役ビジュアル。Grader の "アセスメント結果" を抽象化した UI モックを
 * 自前 SVG で描く (= 画像生成の代替。ベクタなので軽量・高精細・テーマ追従)。
 * レーダーチャート + 総合スコア + トレイトのタグで「結果が出る」体験を一目で伝える。
 */

type Props = {
  title: string
  scoreLabel: string
  traits: string[]
  tags: string[]
}

const VALUES = [86, 64, 92, 73, 58] // 5 トレイトのスコア (有機的なバランス)
const OVERALL = 82
const R = 78 // レーダー外周半径
const CX = 110
const CY = 104

function point(i: number, ratio: number): [number, number] {
  const angle = (-90 + i * 72) * (Math.PI / 180)
  return [CX + R * ratio * Math.cos(angle), CY + R * ratio * Math.sin(angle)]
}

function polygon(ratio: number, values?: number[]): string {
  return VALUES.map((v, i) => point(i, values ? v / 100 : ratio).join(','))
    .join(' ')
}

export default function ResultCard({ title, scoreLabel, traits, tags }: Props) {
  const dataPoly = polygon(0, VALUES)

  return (
    <div className="relative w-full max-w-sm">
      {/* 背面の柔らかいグラデ光 (Hero アクセントとして唯一の多色グラデ)。 */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-linear-to-br from-indigo-300/40 via-violet-300/30 to-fuchsia-300/30 blur-2xl"
      />

      {/* 浮遊する小チップ (奥行き付け)。 */}
      <div className="absolute -right-3 -top-4 z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-lift">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-slate-700">+1.2k</span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lift">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-lg bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-1.5 text-[9px] font-bold tracking-wider text-white">
              Terumiu
            </span>
            <span className="text-xs font-medium text-slate-500">{title}</span>
          </div>
          <span className="flex gap-1" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-4">
          {/* radar (viewBox に左右マージンを持たせ、英語の長い軸ラベルも切れないようにする) */}
          <svg viewBox="-36 -6 292 220" className="w-full" role="img" aria-label="radar chart">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="1" stopColor="#d946ef" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* grid rings */}
            {[0.4, 0.7, 1].map((ratio) => (
              <polygon
                key={ratio}
                points={polygon(ratio)}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            ))}
            {/* axes */}
            {VALUES.map((_, i) => {
              const [x, y] = point(i, 1)
              return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />
            })}
            {/* data */}
            <polygon points={dataPoly} fill="url(#radarFill)" stroke="#7c3aed" strokeWidth="2" />
            {VALUES.map((v, i) => {
              const [x, y] = point(i, v / 100)
              return <circle key={i} cx={x} cy={y} r="3" fill="#7c3aed" />
            })}
            {/* axis labels */}
            {traits.slice(0, 5).map((label, i) => {
              const [x, y] = point(i, 1.18)
              const anchor = x < CX - 6 ? 'end' : x > CX + 6 ? 'start' : 'middle'
              return (
                <text
                  key={label}
                  x={x}
                  y={y + 3}
                  textAnchor={anchor}
                  className="fill-slate-400 text-[8px]"
                >
                  {label}
                </text>
              )
            })}
          </svg>

          {/* score ring */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#eef2ff" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={`${(OVERALL / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold tracking-tight text-slate-900">{OVERALL}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">
                {scoreLabel}
              </span>
            </div>
          </div>
        </div>

        {/* tags */}
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
