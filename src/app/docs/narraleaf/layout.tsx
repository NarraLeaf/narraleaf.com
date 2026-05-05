import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { buildSectionPageTree } from '@/lib/docs-section-tree';
import { docsProductTabs } from '@/lib/docs-product-tabs';

export default function Layout({ children }: LayoutProps<'/docs/narraleaf'>) {
  const tree = buildSectionPageTree(source.getPageTree(), 'narraleaf');

  // tabMode defaults to "auto": product tabs render in the sidebar (desktop) and drawer (mobile).
  // "top" places tabs in the same grid cell as article content and they get covered — avoid it here.
  return (
    <DocsLayout tree={tree} {...baseOptions()} tabs={[...docsProductTabs]}>
      {children}
    </DocsLayout>
  );
}
