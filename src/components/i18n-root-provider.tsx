'use client';

import { type ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type Locale, i18nUI, isLocale, localizedPath } from '@/lib/i18n';

function localizedPathname(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);

  if (isLocale(segments[0])) {
    segments.shift();
  }

  const path = segments.length > 0 ? `/${segments.join('/')}` : '/';
  return localizedPath(path, targetLocale);
}

export function I18nRootProvider(props: { children: ReactNode; locale: Locale }) {
  const { children, locale } = props;
  const pathname = usePathname();

  const i18n = useMemo(
    () => ({
      ...i18nUI.provider(locale),
      onLocaleChange: (value: string) => {
        if (!isLocale(value)) return;
        window.location.assign(localizedPathname(pathname, value));
      },
    }),
    [locale, pathname],
  );

  return <RootProvider i18n={i18n}>{children}</RootProvider>;
}
