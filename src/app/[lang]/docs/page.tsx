import { redirect } from 'next/navigation';
import { docsRoute } from '@/lib/shared';
import { type Locale, localizedPath } from '@/lib/i18n';

/** Default docs hub lands on NarraLeaf Project overview (first documentation tab). */
export default async function DocsIndexPage(props: PageProps<'/[lang]/docs'>) {
  const { lang } = await props.params;
  redirect(localizedPath(`${docsRoute}/narraleaf-project`, lang as Locale));
}
