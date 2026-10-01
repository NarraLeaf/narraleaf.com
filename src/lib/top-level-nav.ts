import { blogRoute, docsRoute, projectRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

export type TopLevelNavKey = 'project' | 'docs' | 'blog';

export type TopLevelNavItem = {
  key: TopLevelNavKey;
  label: string;
  href: string;
  active: 'nested-url';
};

export function topLevelNavItems(locale: Locale = i18n.defaultLanguage): TopLevelNavItem[] {
  return [
    {
      key: 'project',
      label: 'Project',
      href: localizedPath(projectRoute, locale),
      active: 'nested-url',
    },
    {
      key: 'docs',
      label: 'Documentation',
      href: localizedPath(docsRoute, locale),
      active: 'nested-url',
    },
    {
      key: 'blog',
      label: 'Blog',
      href: localizedPath(blogRoute, locale),
      active: 'nested-url',
    },
  ];
}
