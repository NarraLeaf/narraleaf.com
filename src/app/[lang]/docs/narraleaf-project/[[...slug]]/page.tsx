import { redirect } from 'next/navigation';
import { projectRoute } from '@/lib/shared';
import { type Locale, localizedPath } from '@/lib/i18n';

export default async function Page(props: PageProps<'/[lang]/docs/narraleaf-project/[[...slug]]'>) {
  const params = await props.params;
  const suffix = params.slug?.length ? `/${params.slug.join('/')}` : '';
  redirect(localizedPath(`${projectRoute}${suffix}`, params.lang as Locale));
}
