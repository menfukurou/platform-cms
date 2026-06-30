import type { ReactNode } from 'react'

/** ページ幅をそろえる共通コンテナ。max-w-6xl + 左右 padding。 */
export default function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
