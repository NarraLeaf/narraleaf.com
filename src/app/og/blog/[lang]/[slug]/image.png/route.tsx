import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { i18n, isLocale } from '@/lib/i18n';
import { appName } from '@/lib/shared';
import { cardDescription } from '@/lib/seo';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/blog/[lang]/[slug]/image.png'>) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const post = getBlogPost(slug, lang);
  if (!post) notFound();

  return new ImageResponse(
    <DefaultImage
      title={post.data.title}
      description={cardDescription(post.data.description)}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) => getBlogPosts(lang).map(({ slug }) => ({ lang, slug })));
}
