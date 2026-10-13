import { blogRoute, docsRoute, projectRoute, tutorialsRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

export type TopLevelNavKey = 'project' | 'docs' | 'blog' | 'tutorials';

export type TopLevelNavItem = {
  key: TopLevelNavKey;
  label: string;
  href: string;
  active: 'nested-url';
};

/** The sections' names in each language, as the home page footer also calls them. */
const LABELS: Record<Locale, Record<TopLevelNavKey, string>> = {
  en: { project: 'Project', docs: 'Documentation', blog: 'Blog', tutorials: 'Tutorials' },
  zh: { project: '项目', docs: '文档', blog: '博客', tutorials: '教程' },
  ja: { project: 'プロジェクト', docs: 'ドキュメント', blog: 'ブログ', tutorials: 'チュートリアル' },
};

const ROUTES: Record<TopLevelNavKey, string> = {
  project: projectRoute,
  docs: docsRoute,
  blog: blogRoute,
  tutorials: tutorialsRoute,
};

export function topLevelNavItems(locale: Locale = i18n.defaultLanguage): TopLevelNavItem[] {
  return (Object.keys(ROUTES) as TopLevelNavKey[]).map((key) => ({
    key,
    label: LABELS[locale][key],
    href: localizedPath(ROUTES[key], locale),
    active: 'nested-url',
  }));
}
