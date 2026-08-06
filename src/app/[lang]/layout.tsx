import { Inter } from 'next/font/google';
import { i18n, isLocale } from '@/lib/i18n';
import { I18nRootProvider } from '@/components/i18n-root-provider';
import { notFound } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
});

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  // The document shell is here rather than in the root layout because this is
  // the first layout that knows the locale. A Chinese page has to say lang="zh"
  // — screen readers pick a voice from it, and crawlers read it to decide which
  // audience the page is for.
  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <I18nRootProvider locale={lang}>{children}</I18nRootProvider>
      </body>
    </html>
  );
}
