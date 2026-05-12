import {
  DocumentationEntryPage,
  documentationEntryMetadata,
  documentationGenerateStaticParams,
} from '../../documentation-entry';
import { type Locale } from '@/lib/i18n';

export default async function Page(props: PageProps<'/[lang]/docs/studio/[[...slug]]'>) {
  const params = await props.params;
  return <DocumentationEntryPage segment="studio" locale={params.lang as Locale} slug={params.slug} />;
}

export function generateStaticParams() {
  return documentationGenerateStaticParams('studio');
}

export async function generateMetadata(props: PageProps<'/[lang]/docs/studio/[[...slug]]'>) {
  const params = await props.params;
  return documentationEntryMetadata({
    segment: 'studio',
    locale: params.lang as Locale,
    slug: params.slug,
  });
}
