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
import { gitConfig, projectRoute } from '@/lib/shared';
import { type Locale, i18n } from '@/lib/i18n';
import {
  alternatesFor,
  jsonLdScript,
  keywordsFor,
  landingMetadata,
  socialMetadataFor,
} from '@/lib/seo';
import { landingPageSeo } from '@/lib/landing-seo';
import { breadcrumbJsonLd, techArticleJsonLd } from '@/lib/structured-data';
import type { Metadata } from 'next';

type ProjectPageProps = PageProps<'/[lang]/project/[[...slug]]'>;

function projectSlugs(slug?: string[]): string[] | undefined {
  return slug?.length ? slug : undefined;
}

function projectPath(slug?: string[]): string {
  const slugs = projectSlugs(slug);
  return slugs ? `${projectRoute}/${slugs.join('/')}` : projectRoute;
}

/** The languages a project page is written in, so no dead alternate is published. */
function availableLocales(slug?: string[]): Locale[] {
  return i18n.languages.filter(
    (locale) => projectSource.getPage(projectSlugs(slug), locale) !== undefined,
  );
}

export default async function Page(props: ProjectPageProps) {
  const params = await props.params;
  const locale = params.lang as Locale;
  const page = projectSource.getPage(projectSlugs(params.slug), locale);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getProjectPageMarkdownUrl(page).url;

  const path = projectPath(params.slug);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          techArticleJsonLd({
            locale,
            path,
            title: page.data.title,
            description: page.data.description,
            image: getProjectPageImage(page).url,
          }),
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd(locale, [
            { name: 'NarraLeaf', path: '/' },
            { name: page.data.title, path },
          ]),
        )}
      />
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
  const locale = params.lang as Locale;
  const page = projectSource.getPage(projectSlugs(params.slug), locale);
  if (!page) notFound();

  // The section index is a landing page: it is what a search for the project
  // itself should reach, so it carries the written title and summary rather
  // than the frontmatter, and a card image of its own.
  if (!projectSlugs(params.slug)) {
    return landingMetadata('project', locale);
  }

  const path = projectPath(params.slug);
  const description = page.data.description ?? landingPageSeo('project', locale).description;

  return {
    title: page.data.title,
    description,
    keywords: keywordsFor(locale, [page.data.title]),
    alternates: alternatesFor(path, locale, availableLocales(params.slug)),
    ...socialMetadataFor({
      locale,
      path,
      title: page.data.title,
      description,
      image: getProjectPageImage(page).url,
      type: 'article',
    }),
  };
}
