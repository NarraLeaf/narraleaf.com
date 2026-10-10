import { notFound } from 'next/navigation';
import { createFromSource, type ExportedData } from 'fumadocs-core/search/server';
import { i18n, isLocale } from '@/lib/i18n';
import { searchDatabaseOptions } from '@/lib/search';
import { source } from '@/lib/source';

/**
 * One language's docs search index, built and saved at build time so that no
 * server has to build it. `../route.ts` loads it to answer queries.
 */
export const revalidate = false;

const server = createFromSource(source, {
  localeMap: {
    en: searchDatabaseOptions('en'),
    zh: searchDatabaseOptions('zh'),
    ja: searchDatabaseOptions('ja'),
  },
});

export async function GET(_req: Request, { params }: RouteContext<'/api/search/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const exported = (await server.export()) as ExportedData;
  if (exported.type !== 'i18n') {
    throw new Error('The docs source is expected to be localized.');
  }

  return Response.json(exported.data[locale]);
}

export function generateStaticParams() {
  return i18n.languages.map((locale) => ({ locale }));
}
