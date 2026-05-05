import {
  DocumentationEntryPage,
  documentationEntryMetadata,
  documentationGenerateStaticParams,
} from '../../documentation-entry';

export default async function Page(props: PageProps<'/docs/studio/[[...slug]]'>) {
  const params = await props.params;
  return <DocumentationEntryPage segment="studio" slug={params.slug} />;
}

export function generateStaticParams() {
  return documentationGenerateStaticParams('studio');
}

export async function generateMetadata(props: PageProps<'/docs/studio/[[...slug]]'>) {
  const params = await props.params;
  return documentationEntryMetadata({ segment: 'studio', slug: params.slug });
}
