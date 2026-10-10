import { type AnyOrama, create, getByID, load, search } from '@orama/orama';
import { createContentHighlighter, type SortedResult } from 'fumadocs-core/search';
import { i18n, isLocale, type Locale } from '@/lib/i18n';
import { searchDatabaseOptions, searchIndexPath } from '@/lib/search';

/**
 * Answers the search box, from indexes the build has already made.
 *
 * Each server instance used to build the index itself, from every page in every
 * language, on the first query it was sent. That took five to six seconds on
 * Vercel, and on a site this quiet nearly every search reached an instance that
 * had not done it yet. Now the build saves each language's index as a static
 * file (`./[locale]/route.ts`), and an instance fetches only the language it is
 * asked for and loads it, which is parsing rather than indexing.
 *
 * A failed load is forgotten, so the next query tries again instead of the
 * instance answering every one with the same error until it is recycled.
 */
const databases = new Map<Locale, Promise<AnyOrama>>();

function database(locale: Locale, request: Request): Promise<AnyOrama> {
  let db = databases.get(locale);

  if (!db) {
    db = loadDatabase(locale, request);
    databases.set(locale, db);
    db.catch(() => databases.delete(locale));
  }

  return db;
}

async function loadDatabase(locale: Locale, request: Request): Promise<AnyOrama> {
  const cookie = request.headers.get('cookie');
  const response = await fetch(new URL(searchIndexPath(locale), request.url), {
    // The index is the same deployment's own file. On a protected preview the
    // visitor's cookie is what lets the request through.
    headers: cookie ? { cookie } : undefined,
    // Far past what Next's data cache takes, and the instance keeps it anyway.
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Could not fetch the ${locale} search index: ${response.status} ${response.statusText}`);
  }

  const db = create({ schema: { _: 'string' }, ...searchDatabaseOptions(locale) });
  load(db, await response.json());
  return db;
}

/**
 * What Fumadocs' own server answered with, which is what its search box expects.
 *
 * Fumadocs means to stop at 60 results but passes its limit as `undefined` when
 * the query names none, which turns the limit off, so every matching page comes
 * back. That is what the site has always shown, and it is kept here.
 */
async function searchDocs(db: AnyOrama, query: string): Promise<SortedResult[]> {
  const result = await search(db, {
    term: query,
    properties: ['content'],
    groupBy: { properties: ['page_id'], maxResult: 8 },
  });
  const highlighter = createContentHighlighter(query);
  const list: SortedResult[] = [];

  for (const group of result.groups ?? []) {
    const pageId = group.values[0] as string;
    const page = getByID(db, pageId);
    if (!page) continue;

    list.push({
      id: pageId,
      type: 'page',
      content: highlighter.highlightMarkdown(page.content),
      breadcrumbs: page.breadcrumbs,
      url: page.url,
    });

    for (const hit of group.result) {
      if (hit.document.type === 'page') continue;

      list.push({
        id: hit.document.id.toString(),
        content: highlighter.highlightMarkdown(hit.document.content),
        breadcrumbs: hit.document.breadcrumbs,
        type: hit.document.type,
        url: hit.document.url,
      });
    }
  }

  return list;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const query = params.get('query');
  const locale = params.get('locale') ?? i18n.defaultLanguage;
  if (!query || !isLocale(locale)) return Response.json([]);

  const results = await searchDocs(await database(locale, request), query);

  return Response.json(results, {
    headers: {
      // An answer cannot change within a deployment, and Vercel purges its CDN
      // cache on every deployment, so the edge may keep one as long as it likes:
      // anything already searched for is answered without reaching a function.
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
