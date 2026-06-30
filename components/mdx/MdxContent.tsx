import type { ComponentProps } from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { Link } from '@/i18n/routing'

/**
 * Journal 記事 (MDX 本文) を描画する RSC コンポーネント。ビルド時に compile される
 * ので static export と整合する。`@tailwindcss/typography` には依存せず、要素ごとに
 * Tailwind クラスを当てて記事体裁を作る (デザインの一貫性を保つため)。
 */

type AnchorProps = ComponentProps<'a'>

const components = {
  h1: (p: ComponentProps<'h1'>) => (
    <h1 className="mt-12 mb-5 text-3xl font-bold tracking-tight text-slate-900" {...p} />
  ),
  h2: (p: ComponentProps<'h2'>) => (
    <h2 className="mt-12 mb-4 border-b border-slate-200 pb-2 text-2xl font-bold tracking-tight text-slate-900" {...p} />
  ),
  h3: (p: ComponentProps<'h3'>) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-slate-900" {...p} />
  ),
  p: (p: ComponentProps<'p'>) => (
    <p className="my-5 leading-8 text-slate-700" {...p} />
  ),
  a: ({ href = '', ...rest }: AnchorProps) => {
    const cls =
      'font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 transition-colors hover:text-violet-600'
    // 内部リンク (/service など) は next-intl Link で locale prefix を自動付与する。
    if (href.startsWith('/')) {
      return <Link href={href} className={cls} {...rest} />
    }
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...rest}
      />
    )
  },
  ul: (p: ComponentProps<'ul'>) => (
    <ul className="my-5 list-disc space-y-2 pl-6 text-slate-700 marker:text-indigo-400" {...p} />
  ),
  ol: (p: ComponentProps<'ol'>) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 text-slate-700 marker:text-indigo-400" {...p} />
  ),
  li: (p: ComponentProps<'li'>) => <li className="leading-7 pl-1" {...p} />,
  blockquote: (p: ComponentProps<'blockquote'>) => (
    // 和文は italic を当てると合成スラントで崩れるため、色と罫線だけで引用を表現する。
    <blockquote
      className="my-7 rounded-r-xl border-l-[3px] border-violet-400 bg-violet-50/50 py-2 pl-5 pr-4 font-medium text-slate-700"
      {...p}
    />
  ),
  code: (p: ComponentProps<'code'>) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] font-medium text-violet-700" {...p} />
  ),
  pre: (p: ComponentProps<'pre'>) => (
    <pre className="my-6 overflow-x-auto rounded-xl bg-slate-900 p-5 text-sm leading-6 text-slate-100" {...p} />
  ),
  hr: (p: ComponentProps<'hr'>) => <hr className="my-10 border-slate-200" {...p} />,
  table: (p: ComponentProps<'table'>) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  thead: (p: ComponentProps<'thead'>) => <thead className="bg-slate-50" {...p} />,
  th: (p: ComponentProps<'th'>) => (
    <th className="border-b border-slate-200 px-4 py-2.5 text-left font-semibold text-slate-700" {...p} />
  ),
  td: (p: ComponentProps<'td'>) => (
    <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600" {...p} />
  ),
  img: (p: ComponentProps<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 w-full rounded-xl border border-slate-200" alt="" {...p} />
  ),
  strong: (p: ComponentProps<'strong'>) => (
    <strong className="font-semibold text-slate-900" {...p} />
  ),
}

export default function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
    />
  )
}
