import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound, redirect } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { docsRoute, gitConfig } from '@/lib/shared';
import { type Locale, i18n, localizedPath } from '@/lib/i18n';
import { alternatesFor, jsonLdScript, keywordsFor, socialMetadataFor } from '@/lib/seo';
import { breadcrumbJsonLd, type BreadcrumbEntry, techArticleJsonLd } from '@/lib/structured-data';
import type { Metadata } from 'next';

export type DocsProductSegment = 'narraleaf' | 'studio' | 'narraleaf-react';

/**
 * What each documentation tab is called in a result line.
 *
 * The site's three products are searched for by name, so the name belongs in
 * the title of every page that documents one: `Installation | NarraLeaf Studio`
 * competes for a query the site can win, where `Installation | NarraLeaf` does
 * not say which of the three it installs.
 */
const PRODUCT_NAMES: Record<DocsProductSegment, string> = {
  studio: 'NarraLeaf Studio',
  narraleaf: 'NarraLeaf Desktop',
  'narraleaf-react': 'NarraLeaf-React',
};

/** The path a product tab's trail starts at, `narraleaf` redirecting to its library. */
const PRODUCT_ROOTS: Record<DocsProductSegment, string> = {
  studio: `${docsRoute}/studio`,
  narraleaf: `${docsRoute}/narraleaf/library`,
  'narraleaf-react': `${docsRoute}/narraleaf-react`,
};

function fullSlug(segment: DocsProductSegment, slugSuffix?: string[]): string[] {
  if (!slugSuffix?.length) return [segment];
  return [segment, ...slugSuffix];
}

function pagePath(slugs: string[]): string {
  return `${docsRoute}/${slugs.join('/')}`;
}

/** The languages this page exists in, so no alternate is published for a missing one. */
function availableLocales(slugs: string[]): Locale[] {
  return i18n.languages.filter((locale) => source.getPage(slugs, locale) !== undefined);
}

function pageTitle(segment: DocsProductSegment, title: string): string {
  const product = PRODUCT_NAMES[segment];
  return title.includes(product) ? title : `${title} | ${product}`;
}

/**
 * Home, the product tab, every section index between them, and the page.
 *
 * The intermediate steps are taken from the prefixes that resolve to a page of
 * their own: a section without an index page is not a place a reader can be, so
 * it is left out of the trail rather than named as a link that does not exist.
 */
function breadcrumbEntries(
  segment: DocsProductSegment,
  slugs: string[],
  locale: Locale,
  title: string,
): BreadcrumbEntry[] {
  const entries: BreadcrumbEntry[] = [
    { name: 'NarraLeaf', path: '/' },
    { name: PRODUCT_NAMES[segment], path: PRODUCT_ROOTS[segment] },
  ];

  for (let depth = 2; depth < slugs.length; depth += 1) {
    const prefix = slugs.slice(0, depth);
    const page = source.getPage(prefix, locale);
    if (!page) continue;
    if (pagePath(prefix) === PRODUCT_ROOTS[segment]) continue;
    entries.push({ name: page.data.title, path: pagePath(prefix) });
  }

  const path = pagePath(slugs);
  if (entries.at(-1)?.path !== path) {
    entries.push({ name: title, path });
  }

  return entries;
}

export async function DocumentationEntryPage(props: {
  segment: DocsProductSegment;
  locale: Locale;
  slug?: string[];
}) {
  const { segment, locale, slug } = props;

  if (segment === 'narraleaf' && !slug?.length) {
    redirect(localizedPath(`${docsRoute}/narraleaf/library`, locale));
  }

  const slugs = fullSlug(segment, slug);
  const page = source.getPage(slugs, locale);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const path = pagePath(slugs);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          techArticleJsonLd({
            locale,
            path,
            title: page.data.title,
            description: page.data.description,
            image: getPageImage(page).url,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd(locale, breadcrumbEntries(segment, slugs, locale, page.data.title)),
        )}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function documentationEntryMetadata(props: {
  segment: DocsProductSegment;
  locale: Locale;
  slug?: string[];
}): Promise<Metadata> {
  const { segment, locale, slug } = props;
  let slugs = fullSlug(segment, slug);
  if (segment === 'narraleaf' && !slug?.length) {
    slugs = ['narraleaf', 'library'];
  }
  const page = source.getPage(slugs, locale);
  if (!page) notFound();

  const path = pagePath(slugs);
  const title = pageTitle(segment, page.data.title);
  const image = getPageImage(page).url;

  return {
    // Absolute, because the product name is already in it: run through the
    // site template the result line would end `... | NarraLeaf Studio |
    // NarraLeaf`.
    title: { absolute: title },
    description: page.data.description,
    keywords: keywordsFor(locale, [page.data.title, PRODUCT_NAMES[segment]]),
    alternates: alternatesFor(path, locale, availableLocales(slugs)),
    ...socialMetadataFor({
      locale,
      path,
      title,
      description: page.data.description,
      image,
      type: 'article',
    }),
  };
}

export function documentationGenerateStaticParams(segment: DocsProductSegment) {
  const seen = new Set<string>();
  const result: { lang: Locale; slug?: string[] }[] = [];

  for (const item of source.generateParams()) {
    const slug = item.slug;
    if (!slug?.length || slug[0] !== segment) continue;
    const rest = slug.slice(1);
    if (segment === 'narraleaf' && rest.length === 0) continue;

    const lang = item.lang as Locale;
    if (!i18n.languages.includes(lang)) continue;

    const key = `${lang}:${rest.length === 0 ? '__index__' : JSON.stringify(rest)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (rest.length === 0) {
      result.push({ lang });
    } else {
      result.push({ lang, slug: rest });
    }
  }

  return result;
}
