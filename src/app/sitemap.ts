import type { MetadataRoute } from 'next';
import { blogSource, pagesWrittenIn, projectSource, source } from '@/lib/source';
import { blogPostLocales, publishedBlogSlugs } from '@/lib/blog';
import { i18n, type Locale, localizedPath } from '@/lib/i18n';
import { absoluteUrl } from '@/lib/seo';
import { blogRoute, docsRoute, downloadRoute, projectRoute } from '@/lib/shared';

/**
 * Every URL on the site worth indexing, in both languages, each one paired with
 * its counterpart in the other.
 *
 * The site publishes around 1,200 addressable pages and links to most of them
 * from a sidebar that a crawler only reaches after it has already found the
 * section. Without this file the deeper reference pages are discovered slowly
 * or not at all.
 *
 * Only paths that answer with a page are listed. `/docs` and `/docs/narraleaf`
 * both redirect, and a redirect in a sitemap is reported as an error rather
 * than followed.
 */

type Frequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

/**
 * When each language's version of a page last changed: the last commit to its
 * own file, so a fresh translation does not make the English page look edited.
 * A language is missing when there is no date to trust, and its entry then
 * goes out without `lastmod` - see src/lib/git-last-modified.ts.
 */
type LastModified = Partial<Record<Locale, Date>>;

/**
 * One entry per language for the same page, each naming the other as its
 * alternate.
 *
 * `languages` is what tells a search engine these are translations rather than
 * duplicates, and it has to list only the languages the page was actually
 * written in: promising a Chinese version of a page that has none sends readers
 * to a 404.
 */
function localizedEntries(
  path: string,
  locales: Locale[],
  options: { changeFrequency: Frequency; priority: number },
  lastModified: LastModified = {},
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((locale) => [locale, absoluteUrl(localizedPath(path, locale))]),
  );
  // Named here as well as in the page's own `<link rel="alternate">`, so the
  // two agree on which version answers a reader whose language the site does
  // not publish.
  if (locales.includes(i18n.defaultLanguage)) {
    languages['x-default'] = absoluteUrl(localizedPath(path, i18n.defaultLanguage));
  }

  return locales.map((locale) => ({
    url: absoluteUrl(localizedPath(path, locale)),
    lastModified: lastModified[locale],
    alternates: { languages },
    ...options,
  }));
}

/**
 * The documentation and project trees, grouped by page so translations pair up.
 *
 * A page that has not been translated yet is listed only in the languages it
 * was written in. The site still serves it under the other prefixes, falling
 * back to English, but a sitemap that named those addresses would be claiming
 * translations that do not exist.
 */
function contentEntries(): MetadataRoute.Sitemap {
  const localesByPath = new Map<string, Locale[]>();
  const datesByPath = new Map<string, LastModified>();
  const ordered: string[] = [];

  const record = (path: string, locale: Locale, date: Date | undefined) => {
    const known = localesByPath.get(path);
    if (known) {
      known.push(locale);
    } else {
      localesByPath.set(path, [locale]);
      datesByPath.set(path, {});
      ordered.push(path);
    }
    if (date) datesByPath.get(path)![locale] = date;
  };

  for (const locale of i18n.languages) {
    for (const page of pagesWrittenIn(source, locale)) {
      // `/docs/narraleaf` redirects into the library section; the pages beneath
      // it are listed on their own.
      if (page.slugs.length === 1 && page.slugs[0] === 'narraleaf') continue;
      record(`${docsRoute}/${page.slugs.join('/')}`, locale, page.data.lastModified);
    }

    for (const page of pagesWrittenIn(projectSource, locale)) {
      const slugs = page.slugs.join('/');
      record(slugs ? `${projectRoute}/${slugs}` : projectRoute, locale, page.data.lastModified);
    }
  }

  return ordered.flatMap((path) =>
    localizedEntries(
      path,
      localesByPath.get(path)!,
      {
        changeFrequency: 'weekly',
        // A documentation page ranks below the landing pages it is reached from,
        // except for the three section roots, which are the entry points readers
        // are most often looking for.
        priority: path.split('/').length <= 3 ? 0.8 : 0.6,
      },
      datesByPath.get(path),
    ),
  );
}

/**
 * The blog index in every language, and each post in the languages it has been
 * published in. A translation still marked draft is served as the English post,
 * so like an untranslated docs page it is left out here.
 */
function blogEntries(): MetadataRoute.Sitemap {
  return [
    ...localizedEntries(blogRoute, [...i18n.languages], {
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
    ...publishedBlogSlugs().flatMap((slug) => {
      const locales = blogPostLocales(slug);
      const lastModified: LastModified = {};
      for (const locale of locales) {
        const date = blogSource.getPage([slug], locale)?.data.lastModified;
        if (date) lastModified[locale] = date;
      }
      return localizedEntries(
        `${blogRoute}/${slug}`,
        locales,
        { changeFrequency: 'monthly', priority: 0.7 },
        lastModified,
      );
    }),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...localizedEntries('/', [...i18n.languages], {
      changeFrequency: 'weekly',
      priority: 1,
    }),
    ...localizedEntries(downloadRoute, [...i18n.languages], {
      // The panel reads the current release, so this page changes whenever
      // Studio publishes one.
      changeFrequency: 'daily',
      priority: 0.9,
    }),
    ...contentEntries(),
    ...blogEntries(),
  ];
}
