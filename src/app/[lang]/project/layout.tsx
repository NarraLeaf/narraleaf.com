import { projectSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type Locale } from '@/lib/i18n';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/project'>) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <DocsLayout tree={projectSource.getPageTree(locale)} {...baseOptions(locale)}>
      {children}
    </DocsLayout>
  );
}
