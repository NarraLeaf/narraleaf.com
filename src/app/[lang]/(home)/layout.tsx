import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { type Locale } from '@/lib/i18n';

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return <HomeLayout {...baseOptions(lang as Locale)}>{children}</HomeLayout>;
}
