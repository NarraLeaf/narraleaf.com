import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getMDXComponents } from '@/components/mdx';
import { blogSource } from '@/lib/source';
import { blogCopy, blogPostImage, blogPostLocales, getBlogPost, getBlogPosts } from '@/lib/blog';
import { alternatesFor, keywordsFor, socialMetadataFor } from '@/lib/seo';
import { blogRoute } from '@/lib/shared';
import { i18n, isLocale, localizedPath } from '@/lib/i18n';
import { KeepHyphenated } from '../keep-hyphenated';
import { PostMeta } from '../post-meta';

export default async function BlogPostPage(props: PageProps<'/[lang]/blog/[slug]'>) {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();

  const post = getBlogPost(slug, lang);
  if (!post) notFound();

  const copy = blogCopy[lang];
  const MDX = post.data.body;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-20">
      <Link
        href={localizedPath(blogRoute, lang)}
        className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        <ArrowLeft className="size-4" />
        {copy.allPosts}
      </Link>

      <article className="mt-8">
        <header className="space-y-5">
          <PostMeta post={post} locale={lang} />
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            <KeepHyphenated text={post.data.title} />
          </h1>
          <p className="text-lg leading-8 text-fd-muted-foreground sm:text-xl">{post.data.description}</p>
        </header>

        {post.data.image ? (
          <div className="relative mt-10 aspect-[1200/630] overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <Image
              src={post.data.image}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}

        {post.data.toc.length > 0 ? (
          <InlineTOC items={post.data.toc} className="mt-10">
            {copy.toc}
          </InlineTOC>
        ) : null}

        <div className="prose mt-10 min-w-0">
          <MDX components={getMDXComponents({ a: createRelativeLink(blogSource, post) })} />
        </div>
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) => getBlogPosts(lang).map(({ slug }) => ({ lang, slug })));
}

export async function generateMetadata(props: PageProps<'/[lang]/blog/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();

  const post = getBlogPost(slug, lang);
  if (!post) notFound();

  const { title, description, date, authors } = post.data;
  const path = `${blogRoute}/${slug}`;
  const social = socialMetadataFor({
    locale: lang,
    path,
    title,
    description,
    image: blogPostImage(slug, lang, post),
    type: 'article',
  });

  return {
    title,
    description,
    keywords: keywordsFor(lang, [title]),
    authors: authors.map((name) => ({ name })),
    alternates: alternatesFor(path, lang, blogPostLocales(slug)),
    ...social,
    openGraph: { ...social.openGraph, publishedTime: date.toISOString(), authors },
  };
}
