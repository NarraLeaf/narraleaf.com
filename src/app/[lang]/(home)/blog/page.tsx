import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { blogCopy, blogPostUrl, getBlogPosts } from '@/lib/blog';
import { isLocale } from '@/lib/i18n';
import { landingMetadata } from '@/lib/seo';
import { KeepHyphenated } from './keep-hyphenated';
import { PostMeta } from './post-meta';

export default async function BlogIndexPage(props: PageProps<'/[lang]/blog'>) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  const copy = blogCopy[lang];
  const posts = getBlogPosts(lang);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:py-20">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
        <p className="text-lg leading-8 text-fd-muted-foreground">{copy.description}</p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-fd-muted-foreground">{copy.empty}</p>
      ) : (
        <ol className="mt-12 flex flex-col gap-6">
          {posts.map(({ slug, post }) => (
            <li key={slug}>
              <article className="relative flex flex-col gap-6 rounded-xl border border-black/10 bg-fd-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/15 sm:flex-row sm:items-center dark:border-white/10 dark:hover:border-white/15">
                <div className="min-w-0 flex-1 space-y-3">
                  <PostMeta post={post} locale={lang} />
                  <h2 className="text-2xl font-semibold tracking-tight text-balance">
                    {/* Stretched over the whole card, so the title stays the one link. */}
                    <Link href={blogPostUrl(slug, lang)} className="after:absolute after:inset-0">
                      <KeepHyphenated text={post.data.title} />
                    </Link>
                  </h2>
                  <p className="text-base leading-7 text-fd-muted-foreground">{post.data.description}</p>
                </div>

                {post.data.image ? (
                  <div className="relative aspect-[1200/630] w-full shrink-0 overflow-hidden rounded-lg border border-black/10 sm:w-56 dark:border-white/10">
                    <Image
                      src={post.data.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 224px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

export async function generateMetadata(props: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  return landingMetadata('blog', lang);
}
