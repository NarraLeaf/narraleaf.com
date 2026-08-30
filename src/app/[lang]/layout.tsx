import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { i18n, isLocale, type Locale } from '@/lib/i18n';
import { I18nRootProvider } from '@/components/i18n-root-provider';
import { notFound } from 'next/navigation';
import { appDescription, appName, navBrandName, siteIconPath, siteUrl } from '@/lib/shared';
import { jsonLdScript } from '@/lib/seo';
import { siteGraphJsonLd } from '@/lib/structured-data';
import '../global.css';

const inter = Inter({
  subsets: ['latin'],
});

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${navBrandName}`,
  },
  description: appDescription,
  applicationName: appName,
  // No `keywords` here on purpose: the terms differ per language, and every
  // page that can be indexed names its own. A default set in one language
  // would attach English terms to the Chinese pages.
  icons: {
    icon: [{ url: siteIconPath, type: 'image/x-icon' }],
    shortcut: siteIconPath,
  },
  // Stated rather than left to the crawler's default, because the default is
  // only a default: an intermediary that injects a restrictive `X-Robots-Tag`
  // is overruled by a page that says what it wants. `max-image-preview:large`
  // is what lets a result carry the page's card image instead of a thumbnail.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * The document shell lives here, under `[lang]`, rather than in an `app/layout`
 * above it.
 *
 * `<html lang>` has to state the language of the page it wraps, and a layout
 * above the dynamic segment is never told which language that is. Serving the
 * Chinese pages inside `lang="en"` told every crawler and every screen reader
 * that they were English, and it also decided their typography: the player and
 * the docs body break lines under `line-break: strict`, which only applies when
 * the document declares a CJK language.
 *
 * Everything outside `[lang]` is a route handler (`/og`, `/llms.txt`, the search
 * API, the sitemap), and a route handler returns its own response without a
 * document shell, so nothing else needs one.
 */
export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(siteGraphJsonLd(locale))}
        />
        <I18nRootProvider locale={locale}>{children}</I18nRootProvider>
      </body>
    </html>
  );
}
