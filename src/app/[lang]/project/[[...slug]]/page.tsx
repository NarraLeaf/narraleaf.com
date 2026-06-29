import {
  getLLMText,
  getProjectPageImage,
  getProjectPageMarkdownUrl,
  projectSource,
} from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import { type Locale, i18n } from '@/lib/i18n';
import type { Metadata } from 'next';

type ProjectPageProps = PageProps<'/[lang]/project/[[...slug]]'>;

function projectSlugs(slug?: string[]): string[] | undefined {
  return slug?.length ? slug : undefined;
}

export default async function Page(props: ProjectPageProps) {
  const params = await props.params;
  const locale = params.lang as Locale;
  const page = projectSource.getPage(projectSlugs(params.slug), locale);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getProjectPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/project/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(projectSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  const seen = new Set<string>();
  const result: { lang: Locale; slug?: string[] }[] = [];

  for (const item of projectSource.generateParams()) {
    const lang = item.lang as Locale;
    if (!i18n.languages.includes(lang)) continue;

    const slug = item.slug?.length ? item.slug : undefined;
    const key = `${lang}:${slug ? JSON.stringify(slug) : '__index__'}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(slug ? { lang, slug } : { lang });
  }

  return result;
}

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = projectSource.getPage(projectSlugs(params.slug), params.lang as Locale);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getProjectPageImage(page).url,
    },
  };
}
