import Image from 'next/image';
import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { gitConfig, navBrandName, siteLogoPath } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';
import { topLevelNavItems } from './top-level-nav';
import { DownloadStudioButton } from '@/components/download-studio-button';
import { GithubLogo } from '@/components/brand-icons';

export const githubRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/**
 * The download call to action, as a nav item.
 *
 * `custom` rather than `button` so the button keeps its own markup — the styled
 * link, not fumadocs' nav-button shape.
 */
export function downloadNavItem(locale: Locale = i18n.defaultLanguage): LinkItemType {
  return {
    type: 'custom',
    secondary: true,
    // `ms-2` because the icon items beside it carry `-mx-1`, which eats half of
    // the nav list's own gap: the button would otherwise sit 4px from the GitHub
    // mark and read as part of it.
    children: <DownloadStudioButton locale={locale} className="ms-2" />,
  };
}

/**
 * The home nav's links, right-hand group included.
 *
 * The GitHub icon is spelled out here rather than left to `githubUrl`, which
 * fumadocs appends *after* every link it is given — the shortcut cannot put the
 * download button to the right of it, so the layout drops `githubUrl` and states
 * the order itself.
 */
export function topLevelNavLinks(locale: Locale = i18n.defaultLanguage): NonNullable<BaseLayoutProps['links']> {
  return [
    ...topLevelNavItems(locale).map((item) => ({
      text: item.label,
      url: item.href,
      active: item.active,
    })),
    {
      type: 'icon',
      url: githubRepoUrl,
      text: 'GitHub',
      label: 'GitHub',
      icon: <GithubLogo />,
      external: true,
      secondary: true,
    },
    downloadNavItem(locale),
  ];
}

export function baseOptions(locale: Locale = i18n.defaultLanguage): BaseLayoutProps {
  return {
    nav: {
      url: localizedPath('/', locale),
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Image
            src={siteLogoPath}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-sm"
            preload
            unoptimized
          />
          <span>{navBrandName}</span>
        </span>
      ),
    },
    githubUrl: githubRepoUrl,
  };
}
