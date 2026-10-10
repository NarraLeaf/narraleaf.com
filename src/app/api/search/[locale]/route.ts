import { brotliCompressSync, constants } from 'node:zlib';
import { notFound } from 'next/navigation';
import { findPath } from 'fumadocs-core/page-tree';
import { type AdvancedIndex, initAdvancedSearch } from 'fumadocs-core/search/server';
import { i18n, isLocale, type Locale } from '@/lib/i18n';
import { searchDatabaseOptions } from '@/lib/search';
import { source } from '@/lib/source';

/**
 * One language's docs search index, built and saved at build time so that no
 * server has to build it. `../route.ts` loads it to answer queries.
 *
 * Only the language asked for is built. Fumadocs' `createFromSource` builds all
 * three at once, and each build worker rendering one of these would hold every
 * language's index, on a machine the build already nearly fills.
 *
 * The saved index is 20 to 40 MB of JSON, and Vercel will not serve a
 * prerendered response over 10 MB: it answers 502 FALLBACK_BODY_TOO_LARGE. So
 * the file is brotli-compressed here, to between 2 and 4 MB, and sent as opaque
 * bytes for `../route.ts` to decompress itself.
 */
export const revalidate = false;

/** Comfortably under Vercel's 10 MB, so a growing index stops the build rather than search. */
const MAX_BYTES = 9_000_000;

type Page = (typeof source)['$inferPage'];

/** The folders above a page in the sidebar, as `createFromSource` gives them. */
function breadcrumbs(page: Page): string[] | undefined {
  const tree = source.getPageTree(page.locale);
  const path = findPath(tree.children, (node) => node.type === 'page' && node.url === page.url);
  if (!path) return undefined;

  path.pop();
  return [tree.name, ...path.map((node) => node.name)].filter(
    (name): name is string => typeof name === 'string' && name.length > 0,
  );
}

/** What `createFromSource` indexes for each page of one language. */
function indexes(locale: Locale): AdvancedIndex[] {
  return source
    .getPages()
    .filter((page) => page.locale === locale)
    .map((page) => ({
      id: page.url,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      structuredData: page.data.structuredData,
      breadcrumbs: breadcrumbs(page),
    }));
}

export async function GET(_req: Request, { params }: RouteContext<'/api/search/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const server = initAdvancedSearch({ indexes: indexes(locale), ...searchDatabaseOptions(locale) });
  const json = Buffer.from(JSON.stringify(await server.export()));
  const body = brotliCompressSync(json, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 9,
      [constants.BROTLI_PARAM_SIZE_HINT]: json.length,
    },
  });

  if (body.length > MAX_BYTES) {
    throw new Error(
      `The ${locale} search index is ${body.length} bytes compressed, over the ${MAX_BYTES} a prerendered response may be on Vercel.`,
    );
  }

  return new Response(body, {
    headers: { 'Content-Type': 'application/octet-stream' },
  });
}

export function generateStaticParams() {
  return i18n.languages.map((locale) => ({ locale }));
}
