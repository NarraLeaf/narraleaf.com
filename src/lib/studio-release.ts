/**
 * The one place that knows how a Studio release is shaped.
 *
 * Both the docs install table and the download page hang download links off
 * this, so a change in how releases are published (a new platform, a renamed
 * asset) is a change in one file rather than two that can drift apart.
 */

export const STUDIO_REPO = 'NarraLeaf/NarraLeaf-Studio';
export const STUDIO_RELEASES_PAGE = `https://github.com/${STUDIO_REPO}/releases`;

/**
 * Where the bytes come from.
 *
 * GitHub is unreachable or crawls from much of mainland China, and a proxy in
 * front of it did not help: the Cloudflare one this page used to offer has no
 * node there, so its requests landed in Los Angeles and installers arrived at
 * tens of kilobytes a second. Every release is now copied to GitCode, which
 * serves files from inside China (the Studio repository's
 * `.github/workflows/mirror-gitcode.yml`). The copy is the same files under the
 * same names, so the two sources cannot point at different builds.
 */
export type DownloadSourceId = 'github' | 'mirror';

const MIRROR_REPO = 'https://gitcode.com/NarraLeaf/NarraLeaf-Studio';
/** Where a mirror link goes while the copy of the current release is not up yet. */
export const MIRROR_RELEASES_PAGE = `${MIRROR_REPO}/releases`;

/**
 * The source offered first, in every language.
 *
 * GitHub is where the release actually lives, and a page that quietly hands a
 * visitor a third-party host instead cannot be read as offering the official
 * build — not by the visitor, and not by anyone the visitor forwards the link
 * to. The mirror is one click away for whoever needs it, and the docs table
 * spells out both by name.
 */
export const DEFAULT_DOWNLOAD_SOURCE: DownloadSourceId = 'github';

/**
 * Where a row's download link goes for the chosen source.
 *
 * The mirror link is GitCode's own address for the file, read from its release
 * rather than built from the GitHub one: the copy is uploaded after GitHub
 * publishes, and for those minutes a built address would be a 404. Until the
 * file is there, the link opens GitCode's release list instead.
 */
export function downloadHref(row: StudioDownload, source: DownloadSourceId): string {
  if (source === 'mirror') return row.mirrorUrl ?? MIRROR_RELEASES_PAGE;

  return row.url ?? STUDIO_RELEASES_PAGE;
}

/**
 * The release list, not `/releases/latest`.
 *
 * The newest release is not always the newest *downloadable* one: v0.5.0
 * published its blockmaps and its `latest.yml` but neither installer, and asking
 * only for the latest release turned every download button on the site into a
 * link to the releases page. Reading the list lets a publish like that fall
 * through to the last release that actually carries the files.
 */
const RELEASES_API = `https://api.github.com/repos/${STUDIO_REPO}/releases?per_page=20`;

/** GitCode's API answers this without a token. */
const mirrorReleaseApi = (tag: string) =>
  `https://api.gitcode.com/api/v5/repos/${STUDIO_REPO}/releases/tags/${encodeURIComponent(tag)}`;

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface Release {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

/** Which build a visitor is offered, and how the client-side guess names it. */
export type StudioPlatformId = 'windows' | 'mac-arm64';

export type StudioTarget = {
  id: StudioPlatformId;
  platform: string;
  detail: string;
  match: (name: string) => boolean;
};

/**
 * Asset names carry the version (`NarraLeaf.Studio.Setup.0.4.0.exe`), so GitHub's
 * fixed `/releases/latest/download/<name>` URLs cannot be used — the name changes
 * every release. Resolve the real asset from the API instead.
 */
export const STUDIO_TARGETS = [
  {
    id: 'windows',
    platform: 'Windows',
    detail: 'x64 · Windows 10+',
    // `.exe.blockmap` sits beside the installer in every release; `endsWith`
    // keeps it out.
    match: (name: string) => name.endsWith('.exe'),
  },
  {
    id: 'mac-arm64',
    platform: 'macOS',
    detail: 'Apple Silicon · macOS 11+',
    // Studio does not run on an Intel Mac, so there is deliberately no Intel
    // row — even though the releases do carry a plain `NarraLeaf.Studio-*.dmg`
    // beside the arm64 one. An Intel entry would have to be claimed by
    // `.dmg && !arm64`; do not add it. It would hand Intel visitors a build
    // that is not supported, and the docs say so:
    // /docs/studio/installation.
    match: (name: string) => name.endsWith('-arm64.dmg'),
  },
] as const satisfies readonly StudioTarget[];

/** A target with the asset of the current release attached, if it published one. */
export type StudioDownload = {
  id: StudioPlatformId;
  platform: string;
  detail: string;
  url: string | null;
  /** The same file on GitCode, once the copy of this release has it. */
  mirrorUrl: string | null;
  size: string | null;
};

export type StudioReleaseInfo = {
  /** `null` when the lookup failed; the UI degrades to the releases page. */
  version: string | null;
  downloads: StudioDownload[];
};

async function fetchReleases(): Promise<Release[]> {
  try {
    const response = await fetch(RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
      // Unauthenticated GitHub API allows 60 requests/hour per IP, so this must
      // not be fetched per request.
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const releases = (await response.json()) as Release[];

    // Newest first, as GitHub returns them. Drafts are invisible to visitors
    // anyway, and `nightly` is a prerelease that is re-cut constantly — neither
    // is what someone landing on the download page is asking for.
    return releases.filter((release) => !release.draft && !release.prerelease);
  } catch {
    // A failed lookup degrades to the releases page rather than breaking the page.
    return [];
  }
}

/**
 * The files GitCode holds for a release, by name. Empty when it holds none yet
 * or cannot be reached; the mirror links then open its release list.
 */
async function fetchMirrorFiles(tag: string): Promise<Map<string, string>> {
  try {
    const response = await fetch(mirrorReleaseApi(tag), {
      // Shorter than GitHub's hour: the copy lands minutes after a release, and
      // until this is read again the mirror links point at the release list.
      next: { revalidate: 600 },
    });

    if (!response.ok) return new Map();

    const release = (await response.json()) as {
      assets?: { name?: string; browser_download_url?: string; type?: string }[];
    };

    return new Map(
      (release.assets ?? [])
        // `source` entries are the archives GitCode attaches to every release.
        .filter((asset) => asset.type !== 'source' && asset.name && asset.browser_download_url)
        .map((asset) => [asset.name as string, asset.browser_download_url as string]),
    );
  } catch {
    return new Map();
  }
}

function formatSize(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

/**
 * Resolve the current release into plain, serialisable rows.
 *
 * Plain data on purpose: the download page hands this straight to a client
 * component, and the `match` predicates on `STUDIO_TARGETS` cannot cross that
 * boundary.
 */
export async function getStudioRelease(): Promise<StudioReleaseInfo> {
  const releases = await fetchReleases();

  // One release for every row, rather than the newest asset per platform: a page
  // offering a 0.5.0 Windows build beside a 0.4.0 macOS build under a single
  // version number would be lying about what the visitor is downloading.
  const release =
    releases.find((candidate) =>
      candidate.assets.some((asset) => STUDIO_TARGETS.some((target) => target.match(asset.name))),
    ) ?? null;

  const mirror = release ? await fetchMirrorFiles(release.tag_name) : new Map<string, string>();

  return {
    version: release?.tag_name ?? null,
    downloads: STUDIO_TARGETS.map((target) => {
      const asset = release?.assets.find((candidate) => target.match(candidate.name)) ?? null;

      return {
        id: target.id,
        platform: target.platform,
        detail: target.detail,
        url: asset?.browser_download_url ?? null,
        mirrorUrl: asset ? (mirror.get(asset.name) ?? null) : null,
        size: asset ? formatSize(asset.size) : null,
      };
    }),
  };
}
