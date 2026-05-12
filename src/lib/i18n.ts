import { defineI18n } from 'fumadocs-core/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
  hideLocale: 'default-locale',
  parser: 'dot',
});

export type Locale = (typeof i18n.languages)[number];

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
  },
  zh: {
    displayName: '中文',
    search: '搜索文档',
    searchNoResult: '没有找到结果',
    toc: '本页目录',
    tocNoHeadings: '没有标题',
    lastUpdate: '最后更新于',
    chooseLanguage: '选择语言',
    nextPage: '下一页',
    previousPage: '上一页',
    chooseTheme: '主题',
    editOnGithub: '在 GitHub 上编辑',
  },
});

export function isLocale(value: string | undefined): value is Locale {
  return i18n.languages.includes(value as Locale);
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (locale === i18n.defaultLanguage) {
    return normalized;
  }

  if (normalized === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

export function stripLocaleFromSlugs(slugs: string[] | undefined): {
  locale?: Locale;
  slugs: string[] | undefined;
} {
  if (!slugs?.length) {
    return { slugs };
  }

  const [first, ...rest] = slugs;
  if (!isLocale(first)) {
    return { slugs };
  }

  return { locale: first, slugs: rest };
}
