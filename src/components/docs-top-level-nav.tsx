import Link from 'next/link';
import { type Locale } from '@/lib/i18n';
import { type TopLevelNavKey, topLevelNavItems } from '@/lib/top-level-nav';

export function DocsTopLevelNav({
  locale,
  active,
}: {
  locale: Locale;
  active: TopLevelNavKey;
}) {
  const items = topLevelNavItems(locale);

  return (
    <nav
      data-docs-top-level-nav=""
      aria-label="Top-level documentation navigation"
      className="border-b bg-fd-background"
    >
      <div className="mx-auto -mb-px flex h-12 max-w-[var(--fd-layout-width,97rem)] items-end gap-6 overflow-x-auto px-4 md:px-6 xl:px-8">
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
    </nav>
  );
}
