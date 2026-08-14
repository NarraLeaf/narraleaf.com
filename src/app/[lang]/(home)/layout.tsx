import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, topLevelNavLinks } from '@/lib/layout.shared';
import { type Locale } from '@/lib/i18n';

export default async function Layout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    // `githubUrl` is cleared because `topLevelNavLinks` already carries the
    // GitHub icon: the shortcut appends it after every other link, which would
    // both duplicate it and put it on the wrong side of the download button.
    <HomeLayout {...baseOptions(locale)} githubUrl={undefined} links={topLevelNavLinks(locale)}>
      {children}
    </HomeLayout>
  );
}
