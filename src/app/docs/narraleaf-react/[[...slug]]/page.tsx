import {
  DocumentationEntryPage,
  documentationEntryMetadata,
  documentationGenerateStaticParams,
} from '../../documentation-entry';

export default async function Page(props: PageProps<'/docs/narraleaf-react/[[...slug]]'>) {
  const params = await props.params;
  return <DocumentationEntryPage segment="narraleaf-react" slug={params.slug} />;
}

export function generateStaticParams() {
  return documentationGenerateStaticParams('narraleaf-react');
}

export async function generateMetadata(props: PageProps<'/docs/narraleaf-react/[[...slug]]'>) {
  const params = await props.params;
  return documentationEntryMetadata({ segment: 'narraleaf-react', slug: params.slug });
}
