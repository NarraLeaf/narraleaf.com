import type { Metadata } from 'next';
import { i18n, type Locale, localizedPath } from './i18n';
import { landingPageSeo, landingPaths, type LandingPageKey } from './landing-seo';
import { navBrandName, siteImageRoute, siteUrl } from './shared';

/**
 * An absolute URL for a site-relative path.
 *
 * Every canonical link, `hreflang` alternate, sitemap entry and structured-data
 * `@id` has to name an origin, and all of them have to name the same one: a
 * canonical that says `narraleaf.com` while the sitemap says `www.narraleaf.com`
 * describes two sites to a crawler. `siteUrl` is that single origin, and the
 * reason it carries `www` is recorded beside it.
 */
export function absoluteUrl(path: string): string {
  // `URL` renders the origin's root as a trailing slash, and Next drops that
  // same slash when it writes the canonical link. Trimming it here keeps the
  // home page one URL across the canonical, the sitemap and the structured
  // data rather than two spellings of one address.
  return new URL(path, siteUrl).toString().replace(/\/$/, '');
}

/**
 * The `hreflang` value published for each language the site is written in.
 *
 * `zh` rather than `zh-Hans` or `zh-CN`, matching what the proxy negotiates:
 * it folds every regional Chinese tag onto the one Chinese build, so naming a
 * region here would promise a page variant that does not exist.
 */
const HREFLANG: Record<Locale, string> = {
  en: 'en',
  zh: 'zh',
};

/** The `og:locale` value for each language, which Open Graph wants regionalized. */
const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
};

/**
 * The canonical URL and the language alternates for one page.
 *
 * `path` is the language-neutral path, the one an English reader sees, because
 * English is served from the unprefixed URL. Both facts here are load-bearing:
 *
 * - The canonical settles a duplicate the routing creates on its own. `[lang]`
 *   matches `en`, so `/en/docs/studio/installation` renders the same English
 *   page as `/docs/studio/installation`. Left alone a crawler sees two URLs with
 *   identical text and picks one itself; pointing both at the unprefixed path
 *   says which one is the page.
 * - The alternates pair the English and Chinese versions of a page, which is
 *   what puts the Chinese page in front of a Chinese reader instead of leaving
 *   the two competing for the same query. `x-default` names the English URL,
 *   the one the proxy falls back to when it cannot tell. Only languages the
 *   page was written in are listed, because an alternate that 404s is worse
 *   than none.
 */
export function alternatesFor(
  path: string,
  locale: Locale,
  /** The languages the page is written in; defaults to all of them. */
  available: readonly Locale[] = i18n.languages,
) {
  const languages: Record<string, string> = {};

  for (const language of available) {
    languages[HREFLANG[language]] = absoluteUrl(localizedPath(path, language));
  }
  if (available.includes(i18n.defaultLanguage)) {
    languages['x-default'] = absoluteUrl(localizedPath(path, i18n.defaultLanguage));
  }

  return {
    canonical: absoluteUrl(localizedPath(path, locale)),
    languages,
  };
}

/**
 * The terms the site is written to be found by, per language.
 *
 * Google stopped reading the `keywords` meta tag long ago; Bing, Baidu and
 * Yandex still weigh it, and Baidu is most of the traffic the Chinese pages can
 * expect. The list stays short and truthful for that reason: a term the page
 * does not deliver on costs ranking on the terms it does.
 */
const SITE_KEYWORDS: Record<Locale, string[]> = {
  en: [
    'visual novel engine',
    'visual novel maker',
    'visual novel editor',
    'visual novel software',
    'galgame engine',
    'AVG engine',
    'interactive fiction engine',
    'narrative game engine',
    'story editor',
    'React visual novel',
    'NarraLeaf',
    'NarraLeaf Studio',
    'narraleaf-react',
  ],
  zh: [
    '视觉小说引擎',
    '视觉小说制作工具',
    '视觉小说编辑器',
    'galgame 制作',
    'galgame 引擎',
    '文字冒险游戏引擎',
    'AVG 引擎',
    '互动叙事引擎',
    '剧情编辑器',
    'React 视觉小说',
    'NarraLeaf',
    'NarraLeaf Studio',
    'narraleaf-react',
  ],
};

/** The site-wide terms, plus whatever a single page is specifically about. */
export function keywordsFor(locale: Locale, extra: string[] = []): string[] {
  return [...extra, ...SITE_KEYWORDS[locale]];
}

export type SocialMetadataInput = {
  locale: Locale;
  /** The language-neutral path, as passed to `alternatesFor`. */
  path: string;
  title: string;
  description?: string;
  /** Site-relative URL of the 1200x630 card image. */
  image: string;
  /** `article` for a documentation page, `website` for a landing page. */
  type?: 'website' | 'article';
};

/**
 * The Open Graph and Twitter card for one page.
 *
 * Both blocks are filled from the same four values so a link shared to Discord,
 * X, Slack or a Chinese chat client renders the same title, summary and picture
 * that the page itself carries. Without them a share falls back to the origin
 * name and whatever text the scraper happens to lift first.
 */
export function socialMetadataFor({
  locale,
  path,
  title,
  description,
  image,
  type = 'website',
}: SocialMetadataInput) {
  const url = absoluteUrl(localizedPath(path, locale));

  return {
    openGraph: {
      type,
      url,
      siteName: navBrandName,
      locale: OG_LOCALE[locale],
      alternateLocale: i18n.languages
        .filter((language) => language !== locale)
        .map((language) => OG_LOCALE[language]),
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image],
    },
  };
}

/** Renders one structured-data block. */
export function jsonLdScript(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data).replaceAll('<', '\u003c'),
  };
}

/** URL of the generated card image for a landing page. */
export function landingImageUrl(key: string, locale: Locale): string {
  return `${siteImageRoute}/${locale}/${key}/image.png`;
}

/**
 * The complete metadata for one landing page.
 *
 * The title is absolute: these pages name their own product, so appending the
 * site template to them would repeat the brand twice in one result line.
 */
export function landingMetadata(key: LandingPageKey, locale: Locale): Metadata {
  const copy = landingPageSeo(key, locale);
  const path = landingPaths[key];

  return {
    title: { absolute: copy.title },
    description: copy.description,
    keywords: keywordsFor(locale, copy.keywords),
    alternates: alternatesFor(path, locale),
    ...socialMetadataFor({
      locale,
      path,
      title: copy.title,
      description: copy.description,
      image: landingImageUrl(key, locale),
    }),
  };
}
