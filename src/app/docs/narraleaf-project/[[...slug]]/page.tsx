import {
  DocumentationEntryPage,
  documentationEntryMetadata,
  documentationGenerateStaticParams,
} from '../../documentation-entry';

export default async function Page(props: PageProps<'/docs/narraleaf-project/[[...slug]]'>) {
  const params = await props.params;
  return <DocumentationEntryPage segment="narraleaf-project" slug={params.slug} />;
}

export function generateStaticParams() {
  return documentationGenerateStaticParams('narraleaf-project');
}

export async function generateMetadata(props: PageProps<'/docs/narraleaf-project/[[...slug]]'>) {
  const params = await props.params;
  return documentationEntryMetadata({ segment: 'narraleaf-project', slug: params.slug });
}
