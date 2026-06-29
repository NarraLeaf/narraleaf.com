import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, topLevelNavLinks } from '@/lib/layout.shared';
import { type Locale } from '@/lib/i18n';

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <HomeLayout {...baseOptions(locale)} links={topLevelNavLinks(locale)}>
      {children}
    </HomeLayout>
  );
}
