import { blogSource, translatedLocales } from './source';
import { blogImageRoute, blogRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

export type BlogPost = NonNullable<ReturnType<typeof blogSource.getPage>>;

export const blogCopy = {
  en: {
    title: 'Blog',
    description: 'Releases and news from the NarraLeaf Project.',
    empty: 'No posts yet.',
    allPosts: 'All posts',
    toc: 'On this page',
    draft: 'Draft',
  },
  zh: {
    title: '博客',
    description: 'NarraLeaf Project 的版本发布与动态。',
    empty: '还没有文章。',
    allPosts: '全部文章',
    toc: '本页目录',
    draft: '草稿',
  },
  ja: {
    title: 'ブログ',
    description: 'NarraLeaf Project のリリース情報とお知らせ。',
    empty: '記事はまだありません。',
    allPosts: 'すべての記事',
    toc: 'このページの目次',
    draft: '下書き',
  },
} satisfies Record<Locale, Record<string, string>>;

const showDrafts = process.env.NODE_ENV !== 'production';

function isPublished(post: BlogPost): boolean {
  return showDrafts || !post.data.draft;
}

/**
 * The post at `/blog/<slug>` in `locale`, or undefined when there is nothing
 * to show there.
 *
 * A translation still marked draft falls back to the published English post,
 * so an English post can go out before its translations are finished without
 * turning into a 404 for everyone else.
 */
export function getBlogPost(slug: string, locale: Locale): BlogPost | undefined {
  const post = blogSource.getPage([slug], locale);
  if (post && isPublished(post)) return post;

  if (locale === i18n.defaultLanguage) return;
  const fallback = blogSource.getPage([slug], i18n.defaultLanguage);
  if (fallback && isPublished(fallback)) return fallback;
}

/** Every post readable in `locale`, newest first. */
export function getBlogPosts(locale: Locale): { slug: string; post: BlogPost }[] {
  const slugs = new Set(blogSource.getPages().map((page) => page.slugs[0]));

  return [...slugs]
    .flatMap((slug) => {
      const post = getBlogPost(slug, locale);
      return post ? [{ slug, post }] : [];
    })
    .sort((a, b) => b.post.data.date.getTime() - a.post.data.date.getTime());
}

/**
 * The languages a post is written and published in — what its `hreflang`
 * alternates and sitemap entries may name. The fallbacks `getBlogPost` serves
 * are not among them.
 */
export function blogPostLocales(slug: string): Locale[] {
  return translatedLocales(blogSource, [slug]).filter((locale) => {
    const post = blogSource.getPage([slug], locale);
    return post !== undefined && isPublished(post);
  });
}

/** Every post published in at least one language. */
export function publishedBlogSlugs(): string[] {
  const slugs = new Set(blogSource.getPages().map((page) => page.slugs[0]));
  return [...slugs].filter((slug) => blogPostLocales(slug).length > 0);
}

/**
 * Built from the slug rather than read off the page, because the page may be
 * the English fallback — and a reader should stay under their own prefix.
 */
export function blogPostUrl(slug: string, locale: Locale): string {
  return localizedPath(`${blogRoute}/${slug}`, locale);
}

/** The link-preview image: the post's own cover, or one generated from its title. */
export function blogPostImage(slug: string, locale: Locale, post: BlogPost): string {
  return post.data.image ?? `${blogImageRoute}/${locale}/${slug}/image.png`;
}

export function formatPostDate(date: Date, locale: Locale): string {
  // Frontmatter dates are calendar days parsed as UTC midnight. Formatting them
  // in the reader's zone would show the day before anywhere west of Greenwich.
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export function formatAuthors(authors: string[], locale: Locale): string {
  return new Intl.ListFormat(locale, { type: 'conjunction' }).format(authors);
}
