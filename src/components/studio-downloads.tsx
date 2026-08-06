import type { Locale } from '@/lib/i18n';

const REPO = 'NarraLeaf/NarraLeaf-Studio';
const LATEST_API = `https://api.github.com/repos/${REPO}/releases/latest`;
const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  tag_name: string;
  assets: ReleaseAsset[];
}

/**
 * Asset names carry the version (`NarraLeaf.Studio.Setup.0.4.0.exe`), so GitHub's
 * fixed `/releases/latest/download/<name>` URLs cannot be used — the name changes
 * every release. Resolve the real asset from the API instead.
 */
const TARGETS = [
  {
    id: 'windows',
    platform: 'Windows',
    detail: 'x64 · Windows 10+',
    match: (name: string) => name.endsWith('.exe'),
  },
  {
    id: 'mac-arm64',
    platform: 'macOS',
    detail: 'Apple Silicon · macOS 11+',
    match: (name: string) => name.endsWith('-arm64.dmg'),
  },
  {
    id: 'mac-x64',
    platform: 'macOS',
    detail: 'Intel · macOS 11+',
    match: (name: string) => name.endsWith('.dmg') && !name.includes('arm64'),
  },
] as const;

const TEXT = {
  en: {
    platform: 'Platform',
    file: 'File',
    download: 'Download',
    unavailable: 'All releases',
    allReleases: 'All releases',
  },
  zh: {
    platform: '平台',
    file: '文件',
    download: '下载',
    unavailable: '全部版本',
    allReleases: '全部版本',
  },
} satisfies Record<Locale, Record<string, string>>;

async function fetchLatestRelease(): Promise<Release | null> {
  try {
    const response = await fetch(LATEST_API, {
      headers: { Accept: 'application/vnd.github+json' },
      // Unauthenticated GitHub API allows 60 requests/hour per IP, so this must
      // not be fetched per request.
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return (await response.json()) as Release;
  } catch {
    // A failed lookup degrades to the releases page rather than breaking the page.
    return null;
  }
}

function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

export async function StudioDownloads({ lang = 'en' }: { lang?: Locale }) {
  const release = await fetchLatestRelease();
  const text = TEXT[lang];

  const rows = TARGETS.map((target) => ({
    ...target,
    asset: release?.assets.find((asset) => target.match(asset.name)) ?? null,
  }));

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-fd-border">
      <div className="flex items-center justify-between gap-4 border-b border-fd-border bg-fd-muted/50 px-4 py-2.5 text-sm">
        <span className="font-medium text-fd-foreground">
          NarraLeaf Studio {release?.tag_name ?? ''}
        </span>
        <a
          href={RELEASES_PAGE}
          className="text-fd-muted-foreground underline underline-offset-4 hover:text-fd-foreground"
          target="_blank"
          rel="noreferrer"
        >
          {text.allReleases}
        </a>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-fd-border last:border-b-0"
            >
              <td className="px-4 py-3 align-middle">
                <div className="font-medium text-fd-foreground">
                  {row.platform}
                </div>
                <div className="text-xs text-fd-muted-foreground">
                  {row.detail}
                </div>
              </td>
              <td className="px-4 py-3 text-right align-middle">
                {row.asset ? (
                  <a
                    href={row.asset.browser_download_url}
                    className="font-medium text-fd-primary underline underline-offset-4"
                  >
                    {text.download}
                    <span className="ml-2 font-normal text-xs text-fd-muted-foreground">
                      {formatSize(row.asset.size)}
                    </span>
                  </a>
                ) : (
                  <a
                    href={RELEASES_PAGE}
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
