import { projectSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type Locale } from '@/lib/i18n';
import { DocsTopLevelNav } from '@/components/docs-top-level-nav';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/project'>) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <>
      <DocsTopLevelNav locale={locale} active="project" />
      {/*
        Project is a single page, so the docs sidebar has nothing to list.
        Disabling it still leaves the mobile subnav's sidebar toggle, which would
        open an empty drawer — hide that leftover trigger. Scoped to this route
        because the layout only mounts on /project.
      */}
      <style>{`#nd-subnav button:has(svg.lucide-panel-left){display:none}`}</style>
      <DocsLayout
        tree={projectSource.getPageTree(locale)}
        sidebar={{ enabled: false }}
        {...baseOptions(locale)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
