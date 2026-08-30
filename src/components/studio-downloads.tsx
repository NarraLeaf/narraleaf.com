import type { Locale } from '@/lib/i18n';
import { STUDIO_RELEASES_PAGE, getStudioRelease, withDownloadSource } from '@/lib/studio-release';

const TEXT = {
  en: {
    download: 'Download',
    mirror: 'Mirror',
    unavailable: 'All releases',
    allReleases: 'All releases',
  },
  zh: {
    download: '下载',
    mirror: '镜像源下载',
    unavailable: '全部版本',
    allReleases: '全部版本',
  },
  ja: {
    download: 'ダウンロード',
    mirror: 'ミラーからダウンロード',
    unavailable: 'すべてのリリース',
    allReleases: 'すべてのリリース',
  },
} satisfies Record<Locale, Record<string, string>>;

/**
 * The install table in the Studio docs.
 *
 * Shares `studio-release` with the download page, so a new platform or a
 * renamed asset lands in both. Both sources are spelled out per row rather than
 * one being picked by page language: a link whose destination depends on which
 * translation you are reading is a link nobody can describe, and the mirror is
 * the whole reason a reader in mainland China is on this page.
 */
export async function StudioDownloads({ lang = 'en' }: { lang?: Locale }) {
  const release = await getStudioRelease();
  const text = TEXT[lang];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border">
      <div className="flex items-center justify-between gap-4 border-b border-fd-border bg-fd-muted/50 px-4 py-2.5 text-sm">
        <span className="font-medium text-fd-foreground">
          NarraLeaf Studio {release.version ?? ''}
        </span>
        <a
          href={STUDIO_RELEASES_PAGE}
          className="text-fd-muted-foreground underline underline-offset-4 hover:text-fd-foreground"
          target="_blank"
          rel="noreferrer"
        >
          {text.allReleases}
        </a>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {release.downloads.map((row) => (
            <tr key={row.id} className="border-b border-fd-border last:border-b-0">
              <td className="px-4 py-3 align-middle">
                <div className="font-medium text-fd-foreground">{row.platform}</div>
                <div className="text-xs text-fd-muted-foreground">{row.detail}</div>
              </td>
              <td className="px-4 py-3 text-right align-middle">
                {row.url ? (
                  // The same file twice, from two hosts. The size hangs off the
                  // pair rather than each link, since it is the same download.
                  <div className="flex flex-wrap items-baseline justify-end gap-x-4 gap-y-1">
                    <a
                      href={row.url}
                      className="font-medium text-fd-primary underline underline-offset-4"
                    >
                      {text.download}
                    </a>
                    <a
                      href={withDownloadSource(row.url, 'mirror')}
                      className="font-medium text-fd-primary underline underline-offset-4"
                    >
                      {text.mirror}
                    </a>
                    <span className="text-xs font-normal text-fd-muted-foreground">{row.size}</span>
                  </div>
                ) : (
                  <a
                    href={STUDIO_RELEASES_PAGE}
                    className="font-medium text-fd-primary underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text.unavailable}
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
