import { getProjectPageImage, projectSource } from '@/lib/source';
import { stripLocaleFromSlugs } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/project/[...slug]'>) {
  const { slug } = await params;
  const parsed = stripLocaleFromSlugs(slug.slice(0, -1));
  const page = projectSource.getPage(parsed.slugs, parsed.locale);
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return projectSource.getPages().map((page) => ({
    slug: getProjectPageImage(page).segments,
  }));
}
