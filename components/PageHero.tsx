import type { ReactNode } from 'react'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'

/** 下層ページ共通のヘッダー帯。eyebrow + title(\n 対応) + lead + 任意のアクション。 */
export default function PageHero({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string
  title: string
  lead?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] opacity-70" />
      <div aria-hidden className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <Container className="relative">
        <div className="max-w-3xl pb-10 pt-14 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
          <Eyebrow>{kicker}</Eyebrow>
          <h1 className="display mt-5 text-pretty whitespace-pre-line text-4xl font-bold text-slate-900 sm:text-5xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{lead}</p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  )
}
