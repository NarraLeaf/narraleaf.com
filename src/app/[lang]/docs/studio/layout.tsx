import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { buildSectionPageTree } from '@/lib/docs-section-tree';
import { docsProductTabs } from '@/lib/docs-product-tabs';
import { type Locale } from '@/lib/i18n';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/docs/studio'>) {
  const { lang } = await params;
  const locale = lang as Locale;
  const tree = buildSectionPageTree(source.getPageTree(locale), 'studio', locale);

  return (
    <DocsLayout tree={tree} {...baseOptions(locale)} tabs={[...docsProductTabs(locale)]}>
      {children}
    </DocsLayout>
  );
}
