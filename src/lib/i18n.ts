import { defineI18n } from 'fumadocs-core/i18n';
import { defineI18nUI } from 'fumadocs-ui/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'zh', 'ja'],
  hideLocale: 'default-locale',
  parser: 'dot',
});

export type Locale = (typeof i18n.languages)[number];

/**
 * Holds a language the visitor picked by hand in the language switcher.
 *
 * The proxy negotiates from `Accept-Language` only when this is absent, so an
 * explicit choice always outranks what the browser advertises. Without it the
 * switcher would not work at all: a browser set to Chinese would be sent back
 * to Chinese the moment it asked for an English page.
 */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/** One year, refreshed every time the visitor picks a language. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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
  ja: {
    displayName: '日本語',
    search: '検索',
    searchNoResult: '結果が見つかりません',
    toc: 'このページの目次',
    tocNoHeadings: '見出しがありません',
    lastUpdate: '最終更新',
    chooseLanguage: '言語を選択',
    nextPage: '次のページ',
    previousPage: '前のページ',
    chooseTheme: 'テーマ',
    editOnGithub: 'GitHub で編集',
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
