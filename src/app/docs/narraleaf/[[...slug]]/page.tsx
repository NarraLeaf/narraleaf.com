import {
  DocumentationEntryPage,
  documentationEntryMetadata,
  documentationGenerateStaticParams,
} from '../../documentation-entry';

export default async function Page(props: PageProps<'/docs/narraleaf/[[...slug]]'>) {
  const params = await props.params;
  return <DocumentationEntryPage segment="narraleaf" slug={params.slug} />;
}

export function generateStaticParams() {
  return documentationGenerateStaticParams('narraleaf');
}

export async function generateMetadata(props: PageProps<'/docs/narraleaf/[[...slug]]'>) {
  const params = await props.params;
  return documentationEntryMetadata({ segment: 'narraleaf', slug: params.slug });
}
