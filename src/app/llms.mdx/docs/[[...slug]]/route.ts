import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { stripLocaleFromSlugs } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const parsed = stripLocaleFromSlugs(slug?.slice(0, -1));
  const page = source.getPage(parsed.slugs, parsed.locale);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }));
}
