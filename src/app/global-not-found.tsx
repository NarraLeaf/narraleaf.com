import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { appName, siteIconPath, siteUrl } from '@/lib/shared';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

/**
 * The page for an address that does not exist.
 *
 * It renders its own document because the site's shell lives under `[lang]`,
 * and a request that never resolved to a language never reaches that shell.
 * Written in English for the same reason: there is no page here to take a
 * language from.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Page not found | ${appName}`,
  icons: {
    icon: [{ url: siteIconPath, type: 'image/x-icon' }],
    shortcut: siteIconPath,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm font-medium tracking-[0.18em] text-fd-muted-foreground uppercase">
          404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="max-w-md text-base leading-7 text-fd-muted-foreground">
          This address does not point to a page. The documentation is indexed from the home page.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground"
        >
          Go to narraleaf.com
        </Link>
      </body>
    </html>
  );
}
