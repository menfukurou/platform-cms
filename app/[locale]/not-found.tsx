import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Container from '@/components/ui/Container'

/** locale 配下で notFound() が呼ばれた時 (例: 存在しない journal slug)。 */
export default function LocaleNotFound() {
  const t = useTranslations('notFound')
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="bg-linear-to-br from-indigo-600 to-fuchsia-600 bg-clip-text text-7xl font-bold text-transparent">
        404
      </p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
      <p className="mt-3 text-slate-600">{t('lead')}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:from-indigo-500 hover:to-violet-500"
      >
        {t('home')}
      </Link>
    </Container>
  )
}
