import Link from 'next/link';
import Image from 'next/image';
import { type Locale, localizedPath } from '@/lib/i18n';
import { navBrandName, siteIconPath } from '@/lib/shared';
import { type TopLevelNavKey, topLevelNavItems } from '@/lib/top-level-nav';

export function DocsTopLevelNav({
  locale,
  active,
  showBrand = false,
}: {
  locale: Locale;
  active: TopLevelNavKey;
  /**
   * Render the site brand on the left of the bar. Enable it on routes without a
   * sidebar (e.g. Project), where the logo would otherwise be missing on desktop.
   * Hidden below `md` because the mobile docs subnav already shows the brand.
   */
  showBrand?: boolean;
}) {
  const items = topLevelNavItems(locale);

  return (
    <nav
      data-docs-top-level-nav=""
      aria-label="Top-level documentation navigation"
      className="border-b bg-fd-background"
    >
      <div className="mx-auto flex h-12 max-w-[var(--fd-layout-width,97rem)] items-stretch gap-6 overflow-x-auto px-4 md:px-6 xl:px-8">
        {showBrand ? (
          <Link
            href={localizedPath('/', locale)}
            aria-label={navBrandName}
            className="hidden shrink-0 items-center gap-2 font-semibold md:inline-flex"
          >
            <Image
              src={siteIconPath}
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0 rounded-sm"
              priority
              unoptimized
            />
            <span>{navBrandName}</span>
          </Link>
        ) : null}

        <div className="-mb-px flex items-end gap-6">
          {items.map((item) => {
            const isActive = item.key === active;

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'inline-flex text-nowrap border-b-2 px-0.5 pb-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-fd-primary text-fd-primary'
                    : 'border-transparent text-fd-muted-foreground hover:text-fd-accent-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
