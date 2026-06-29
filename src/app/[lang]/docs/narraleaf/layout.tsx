import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { buildSectionPageTree } from '@/lib/docs-section-tree';
import { docsProductTabs } from '@/lib/docs-product-tabs';
import { type Locale } from '@/lib/i18n';
import { DocsTopLevelNav } from '@/components/docs-top-level-nav';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/docs/narraleaf'>) {
  const { lang } = await params;
  const locale = lang as Locale;
  const tree = buildSectionPageTree(source.getPageTree(locale), 'narraleaf', locale);

  // tabMode defaults to "auto": product tabs render in the sidebar (desktop) and drawer (mobile).
  // "top" places tabs in the same grid cell as article content and they get covered — avoid it here.
  return (
    <>
      <DocsTopLevelNav locale={locale} active="docs" />
      <DocsLayout tree={tree} {...baseOptions(locale)} tabs={[...docsProductTabs(locale)]}>
        {children}
      </DocsLayout>
    </>
  );
}
