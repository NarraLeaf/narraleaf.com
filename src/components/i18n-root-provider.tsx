'use client';

import { type ReactNode, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider/next';
import {
  type Locale,
  i18nUI,
  isLocale,
  localizedPath,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
} from '@/lib/i18n';

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

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const i18n = useMemo(
    () => ({
      ...i18nUI.provider(locale),
      onLocaleChange: (value: string) => {
        if (!isLocale(value)) return;
        // Record the choice before navigating. The proxy falls back to
        // Accept-Language only when this cookie is missing, so without it a
        // browser set to Chinese would be redirected off the English pages
        // again the instant this navigation landed.
        document.cookie = `${LOCALE_COOKIE}=${value};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};samesite=lax`;
        window.location.assign(localizedPathname(pathname, value));
      },
    }),
    [locale, pathname],
  );

  return <RootProvider i18n={i18n}>{children}</RootProvider>;
}
