import { type BlogPost, blogCopy, formatAuthors, formatPostDate } from '@/lib/blog';
import { type Locale } from '@/lib/i18n';

export function PostMeta(props: { post: BlogPost; locale: Locale }) {
  const { post, locale } = props;
  const { date, authors, draft } = post.data;

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fd-muted-foreground">
      <time dateTime={date.toISOString().slice(0, 10)}>{formatPostDate(date, locale)}</time>
      {authors.length > 0 ? (
        <>
          <span aria-hidden="true">·</span>
          <span>{formatAuthors(authors, locale)}</span>
        </>
      ) : null}
      {draft ? (
        <span className="rounded-md border border-dashed border-current px-1.5 py-px text-xs font-medium">
          {blogCopy[locale].draft}
        </span>
      ) : null}
    </p>
  );
}
