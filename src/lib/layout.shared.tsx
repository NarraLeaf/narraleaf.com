import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig, navBrandName, siteIconPath } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';
import { topLevelNavItems } from './top-level-nav';

export function topLevelNavLinks(locale: Locale = i18n.defaultLanguage): NonNullable<BaseLayoutProps['links']> {
  return topLevelNavItems(locale).map((item) => ({
    text: item.label,
    url: item.href,
    active: item.active,
  }));
}

export function baseOptions(locale: Locale = i18n.defaultLanguage): BaseLayoutProps {
  return {
    nav: {
      url: localizedPath('/', locale),
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Image
            src={siteIconPath}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-sm"
            priority
            unoptimized
          />
          <span>{navBrandName}</span>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
