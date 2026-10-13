import Link from 'next/link';
import { Download } from 'lucide-react';
import { cn } from '@/lib/cn';
import { downloadRoute } from '@/lib/shared';
import { type Locale, localizedPath } from '@/lib/i18n';

const LABEL = {
  en: 'Download Studio',
  zh: '下载 Studio',
  ja: 'Studio をダウンロード',
} satisfies Record<Locale, string>;

/**
 * The label from `lg` to `xl`, where the home nav's single row is too narrow
 * for the full one (see the note in global.css). Below `lg` the button sits in
 * the nav's menu, which has room for the full label.
 */
const SHORT_LABEL = {
  en: 'Download',
  zh: '下载',
  ja: 'ダウンロード',
} satisfies Record<Locale, string>;

/**
 * The home nav's call to action.
 *
 * Deliberately not in the docs top-level bar: the docs bar stays navigation
 * between the site's sections, and the install page carries its own download
 * table.
 */
export function DownloadStudioButton({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <Link
      href={localizedPath(downloadRoute, locale)}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90',
        className,
      )}
    >
      <Download className="size-4" />
      <span className="lg:max-xl:hidden">{LABEL[locale]}</span>
      <span className="hidden lg:max-xl:inline">{SHORT_LABEL[locale]}</span>
    </Link>
  );
}
