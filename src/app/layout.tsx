import type { Metadata } from 'next';
import { appDescription, appName, siteIconPath } from '@/lib/shared';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  icons: {
    icon: [{ url: siteIconPath, type: 'image/x-icon' }],
    shortcut: siteIconPath,
  },
};

/**
 * The document shell lives in `app/[lang]/layout.tsx`, not here.
 *
 * This layout is locale-agnostic, so an <html> tag written at this level could
 * only ever hardcode one `lang` — which is how every Chinese page came to
 * announce itself as English. Everything outside `[lang]` is a route handler
 * (api, og, llms*) that returns data rather than a document, so nothing else
 * needs a shell.
 */
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return children;
}
