import { i18n, isLocale } from '@/lib/i18n';
import { I18nRootProvider } from '@/components/i18n-root-provider';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <I18nRootProvider locale={lang}>{children}</I18nRootProvider>;
}
