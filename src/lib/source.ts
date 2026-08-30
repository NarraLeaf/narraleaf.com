import { docs, project } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import {
  docsContentRoute,
  docsImageRoute,
  docsRoute,
  projectContentRoute,
  projectImageRoute,
  projectRoute,
} from './shared';
import { i18n, type Locale } from './i18n';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const projectSource = loader({
  baseUrl: projectRoute,
  i18n,
  source: project.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = page.locale ? [page.locale, ...page.slugs, 'image.png'] : [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getProjectPageImage(page: (typeof projectSource)['$inferPage']) {
  const segments = page.locale ? [page.locale, ...page.slugs, 'image.png'] : [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${projectImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = page.locale
    ? [page.locale, ...page.slugs, 'content.md']
    : [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export function getProjectPageMarkdownUrl(page: (typeof projectSource)['$inferPage']) {
  const segments = page.locale
    ? [page.locale, ...page.slugs, 'content.md']
    : [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${projectContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(
  page: (typeof source)['$inferPage'] | (typeof projectSource)['$inferPage'],
) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

/**
 * Whether a page is genuinely written in a language, rather than standing in
 * for a missing translation.
 *
 * `i18n.fallbackLanguage` defaults to English, so asking for a page in a
 * language it has not been translated into returns the English one instead of
 * nothing. That is the behaviour a reader wants and the wrong answer for a
 * search engine: it would put the same English text at two addresses and claim
 * a translation that does not exist. The page's `path` names the file it was
 * built from, so it settles the question no matter what the loader returned.
 */
function isWrittenIn(page: { path: string } | undefined, locale: Locale): boolean {
  return page?.path.endsWith(`.${locale}.mdx`) ?? false;
}

/** The languages a page has actually been translated into. */
export function translatedLocales(
  from: { getPage: (slugs: string[] | undefined, locale?: string) => { path: string } | undefined },
  slugs: string[] | undefined,
): Locale[] {
  return i18n.languages.filter((locale) => isWrittenIn(from.getPage(slugs, locale), locale));
}

/** The pages of one language, with the fallbacks for untranslated pages removed. */
export function pagesWrittenIn(
  from: { getPages: (locale?: string) => { path: string; slugs: string[] }[] },
  locale: Locale,
): { path: string; slugs: string[] }[] {
  return from.getPages(locale).filter((page) => isWrittenIn(page, locale));
}
