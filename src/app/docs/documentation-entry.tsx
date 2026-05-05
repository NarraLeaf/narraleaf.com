import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound, redirect } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { docsRoute, gitConfig } from '@/lib/shared';
import type { Metadata } from 'next';

export type DocsProductSegment = 'narraleaf-project' | 'narraleaf' | 'studio' | 'narraleaf-react';

function fullSlug(segment: DocsProductSegment, slugSuffix?: string[]): string[] {
  if (!slugSuffix?.length) return [segment];
  return [segment, ...slugSuffix];
}

/** Default landing for the NarraLeaf engine segment when visiting `/docs/narraleaf` with no subpath. */
const narraleafEngineDefaultPath = `${docsRoute}/narraleaf/library`;

export async function DocumentationEntryPage(props: {
  segment: DocsProductSegment;
  slug?: string[];
}) {
  const { segment, slug } = props;

  if (segment === 'narraleaf' && !slug?.length) {
    redirect(narraleafEngineDefaultPath);
  }

  const slugs = fullSlug(segment, slug);
  const page = source.getPage(slugs);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function documentationEntryMetadata(props: {
  segment: DocsProductSegment;
  slug?: string[];
}): Promise<Metadata> {
  const { segment, slug } = props;
  let slugs = fullSlug(segment, slug);
  if (segment === 'narraleaf' && !slug?.length) {
    slugs = ['narraleaf', 'library'];
  }
  if (segment === 'narraleaf-project' && !slug?.length) {
    slugs = ['narraleaf-project'];
  }
  const page = source.getPage(slugs);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

export function documentationGenerateStaticParams(segment: DocsProductSegment) {
  const seen = new Set<string>();
  const result: { slug?: string[] }[] = [];

  for (const item of source.generateParams()) {
    const slug = item.slug;
    if (!slug?.length || slug[0] !== segment) continue;
    const rest = slug.slice(1);
    if (segment === 'narraleaf' && rest.length === 0) continue;

    const key = rest.length === 0 ? '__index__' : JSON.stringify(rest);
    if (seen.has(key)) continue;
    seen.add(key);

    if (rest.length === 0) {
      result.push({});
    } else {
      result.push({ slug: rest });
    }
  }

  return result;
}
