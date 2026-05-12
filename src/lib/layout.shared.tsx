import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, docsRoute, gitConfig, projectRoute, siteIconPath } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

export function baseOptions(locale: Locale = i18n.defaultLanguage): BaseLayoutProps {
  return {
    nav: {
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
          <span>{appName}</span>
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'Project',
        url: localizedPath(projectRoute, locale),
        active: 'nested-url',
      },
      {
        text: 'Documentation',
        url: localizedPath(docsRoute, locale),
        active: 'nested-url',
      },
    ],
  };
}
