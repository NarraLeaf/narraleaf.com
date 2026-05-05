import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { buildSectionPageTree } from '@/lib/docs-section-tree';
import { docsProductTabs } from '@/lib/docs-product-tabs';

export default function Layout({ children }: LayoutProps<'/docs/narraleaf-project'>) {
  const tree = buildSectionPageTree(source.getPageTree(), 'narraleaf-project');

  return (
    <DocsLayout tree={tree} {...baseOptions()} tabs={[...docsProductTabs]}>
      {children}
    </DocsLayout>
  );
}
