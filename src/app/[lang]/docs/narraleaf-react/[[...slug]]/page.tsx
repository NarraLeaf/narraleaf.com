import {
  DocumentationEntryPage,
  documentationEntryMetadata,
  documentationGenerateStaticParams,
} from '../../documentation-entry';
import { type Locale } from '@/lib/i18n';

export default async function Page(props: PageProps<'/[lang]/docs/narraleaf-react/[[...slug]]'>) {
  const params = await props.params;
  return (
    <DocumentationEntryPage
      segment="narraleaf-react"
      locale={params.lang as Locale}
      slug={params.slug}
    />
  );
}

export function generateStaticParams() {
  return documentationGenerateStaticParams('narraleaf-react');
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/narraleaf-react/[[...slug]]'>,
) {
  const params = await props.params;
  return documentationEntryMetadata({
    segment: 'narraleaf-react',
    locale: params.lang as Locale,
    slug: params.slug,
  });
}
