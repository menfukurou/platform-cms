'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { graderUrl } from '@/lib/site'
import { btn } from '@/lib/ui'
import BrandMark from '@/components/BrandMark'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { ArrowUpRight } from '@/components/icons'

const NAV = [
  { href: '/service', key: 'service' },
  { href: '/about', key: 'about' },
  { href: '/journal', key: 'journal' },
] as const

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // スクロールで境界線/影をふわっと出す (固定ヘッダの "貼り付き感" を上品に)。
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-md backdrop-saturate-150'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Terumiu" className="-ml-1 rounded-lg p-1">
          <BrandMark />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <a href={graderUrl(locale)} target="_blank" rel="noreferrer" className={btn('primary', 'sm')}>
            {t('launchApp')}
            <ArrowUpRight width={15} height={15} />
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t('menuClose') : t('menuOpen')}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white/70 text-slate-700 backdrop-blur hover:bg-slate-50"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200/70 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t(item.key)}
              </Link>
            ))}
            <a
              href={graderUrl(locale)}
              target="_blank"
              rel="noreferrer"
              className={btn('primary', 'md', 'mt-2 w-full')}
            >
              {t('launchApp')}
              <ArrowUpRight width={15} height={15} />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
