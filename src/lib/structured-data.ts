import { type Locale, localizedPath } from './i18n';
import { absoluteUrl } from './seo';
import { appName, navBrandName, siteUrl } from './shared';
import { STUDIO_REPO } from './studio-release';

const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

/**
 * Structured data is what turns a result from a title and a grey line into a
 * breadcrumb trail, a software listing or an article card. Every block below is
 * a plain object handed to `JSON.stringify`; the page renders it inside a
 * `application/ld+json` script tag and nothing reads it at runtime.
 *
 * Each block only ever states what the page already shows. A rating, a price or
 * an author that appears nowhere on the page is what gets structured data
 * ignored for a whole site.
 */

/**
 * The publisher and the site, on every page.
 *
 * One graph rather than two scripts, and rendered from the root layout rather
 * than the home page, because the article block on each documentation page
 * points at both by `@id`. A reference to a node that is only declared on some
 * other page is a reference a crawler reading this page cannot resolve.
 */
export function siteGraphJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: navBrandName,
        url: siteUrl,
        logo: absoluteUrl('/static/img/narraleaf-logo.webp'),
        sameAs: ['https://github.com/NarraLeaf'],
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: navBrandName,
        alternateName: appName,
        url: absoluteUrl(localizedPath('/', locale)),
        inLanguage: locale,
        publisher: { '@id': ORGANIZATION_ID },
      },
    ],
  };
}

/**
 * NarraLeaf Studio as a downloadable application.
 *
 * `offers` at zero is not decoration: without a price a software listing is
 * incomplete, and Studio is free, so the page can say so truthfully.
 */
export function studioApplicationJsonLd(locale: Locale, version: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${siteUrl}/#studio`,
    name: 'NarraLeaf Studio',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Game Development',
    operatingSystem: 'Windows 10, Windows 11, macOS 11 or later',
    url: absoluteUrl(localizedPath('/download', locale)),
    downloadUrl: `https://github.com/${STUDIO_REPO}/releases`,
    // Releases are tagged `v0.9.1`; the version field wants the version.
    ...(version ? { softwareVersion: version.replace(/^v/, '') } : {}),
    inLanguage: ['en', 'zh', 'ja'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export type BreadcrumbEntry = {
  name: string;
  /** Language-neutral path; the locale prefix is applied here. */
  path: string;
};

/**
 * The trail a documentation page sits at the end of.
 *
 * This is the block that replaces the bare URL under a result with
 * `narraleaf.com > NarraLeaf Studio > Installation`, which is the difference
 * between a reader knowing what they are about to open and guessing.
 */
export function breadcrumbJsonLd(locale: Locale, entries: BreadcrumbEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(localizedPath(entry.path, locale)),
    })),
  };
}

export type TechArticleInput = {
  locale: Locale;
  /** Language-neutral path of the page. */
  path: string;
  title: string;
  description?: string;
  /** Site-relative URL of the page's card image. */
  image: string;
};

/** One documentation page, as an article belonging to this site. */
export function techArticleJsonLd({
  locale,
  path,
  title,
  description,
  image,
}: TechArticleInput) {
  const url = absoluteUrl(localizedPath(path, locale));

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: title,
    ...(description ? { description } : {}),
    inLanguage: locale,
    url,
    image: absoluteUrl(image),
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
  };
}
