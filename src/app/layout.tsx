import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { appDescription, appName, siteIconPath } from '@/lib/shared';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
