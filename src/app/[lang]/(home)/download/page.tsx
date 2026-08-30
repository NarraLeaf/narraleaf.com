import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, ExternalLink, ShieldAlert } from 'lucide-react';
import { docsRoute } from '@/lib/shared';
import { isLocale, type Locale, localizedPath } from '@/lib/i18n';
import {
  DEFAULT_DOWNLOAD_SOURCE,
  STUDIO_RELEASES_PAGE,
  getStudioRelease,
} from '@/lib/studio-release';
import { jsonLdScript, landingMetadata } from '@/lib/seo';
import { studioApplicationJsonLd } from '@/lib/structured-data';
import { DownloadPanel, type DownloadPanelCopy } from './download-panel';
import { DownloadPosterWall } from './download-poster-wall';

type RequirementRow = {
  platform: string;
  version: string;
  architecture: string;
};

type DownloadPageCopy = {
  title: string;
  description: string;
  panel: DownloadPanelCopy;
  requirements: {
    title: string;
    columns: [string, string, string];
    rows: RequirementRow[];
  };
  firstLaunch: {
    title: string;
    body: string;
  };
  links: {
    installGuide: string;
    gettingStarted: string;
    allReleases: string;
  };
};

const copyByLocale = {
  en: {
    title: 'Start creating now.',
    description:
      'Download NarraLeaf Studio and make your visual novel the best way there is. A journey of a thousand miles begins with a single step.',
    panel: {
      detecting: 'Detecting your system…',
      pickPlatform: 'Choose a platform',
      downloadFor: 'Download for {platform}',
      unavailable: 'No build for this platform in the current release',
      allReleases: 'All releases',
      source: {
        label: 'Download source',
        options: {
          github: 'GitHub',
          mirror: 'Mirror',
        },
      },
    },
    requirements: {
      title: 'Requirements',
      columns: ['Platform', 'Minimum version', 'Architecture'],
      rows: [
        { platform: 'Windows', version: 'Windows 10', architecture: 'x64' },
        { platform: 'macOS', version: 'macOS 11', architecture: 'Apple Silicon' },
      ],
    },
    firstLaunch: {
      title: 'The first launch has to be allowed manually',
      body: 'Studio is not code-signed. On Windows, select More info → Run anyway. On macOS, select Open Anyway under System Settings → Privacy & Security.',
    },
    links: {
      installGuide: 'Installation guide',
      gettingStarted: 'Start a project',
      allReleases: 'All releases on GitHub',
    },
  },
  zh: {
    title: '创作从现在开始',
    description:
      '下载 NarraLeaf Studio，用最棒的方式做出属于你的视觉小说 千里之行，始于足下',
    panel: {
      detecting: '正在检测你的系统…',
      pickPlatform: '选择平台',
      downloadFor: '下载 {platform} 版',
      unavailable: '当前版本没有该平台的构建',
      allReleases: '全部版本',
      source: {
        label: '下载源',
        options: {
          github: 'GitHub',
          mirror: '镜像源',
        },
      },
    },
    requirements: {
      title: '系统要求',
      columns: ['平台', '最低版本', '架构'],
      rows: [
        { platform: 'Windows', version: 'Windows 10', architecture: 'x64' },
        { platform: 'macOS', version: 'macOS 11', architecture: 'Apple Silicon' },
      ],
    },
    firstLaunch: {
      title: '首次启动需要手动允许',
      body: 'Studio 未经代码签名。Windows 上选择「更多信息 → 仍要运行」；macOS 上在「系统设置 → 隐私与安全性」中选择「仍要打开」。',
    },
    links: {
      installGuide: '安装指南',
      gettingStarted: '开始一个项目',
      allReleases: '在 GitHub 查看全部版本',
    },
  },
} satisfies Record<Locale, DownloadPageCopy>;

/**
 * The title and summary a search result carries are written for the search
 * result, not lifted from the page's own headline: `Start creating now.` says
 * nothing about what is being downloaded, for which platform, or by whom.
 * See `landing-seo`.
 */
export async function generateMetadata(props: PageProps<'/[lang]/download'>): Promise<Metadata> {
  const { lang } = await props.params;
  return landingMetadata('download', isLocale(lang) ? (lang as Locale) : 'en');
}

export default async function DownloadPage(props: PageProps<'/[lang]/download'>) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const copy = copyByLocale[locale];
  const release = await getStudioRelease();
  const docsUrl = (path: string) => localizedPath(`${docsRoute}${path}`, locale);

  return (
    // No <main> of its own: the home layout already renders one around this
    // page, and a second landmark inside it is one more than a screen reader can
    // make sense of.
    <div className="relative flex flex-1 flex-col">
      {/*
        The software listing belongs on the page that offers the download: it
        names the platforms, the price and the version a visitor would get, and
        those are the fields a result for "download visual novel editor" is
        built from.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(studioApplicationJsonLd(locale, release.version))}
      />
      <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:py-20">
        {/*
          The content keeps the page's usual centred column; the wall is taken
          out of the flow and pinned to the right edge of the viewport, so it
          covers that whole side rather than stopping where the layout's max
          width does.
        */}
        <div className="flex max-w-[32rem] min-w-0 flex-col gap-10">
          <div className="space-y-5">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {copy.title}
            </h1>
            <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
              {copy.description}
            </p>
          </div>

          <DownloadPanel
            release={release}
            copy={copy.panel}
            defaultSource={DEFAULT_DOWNLOAD_SOURCE}
          />

          <section className="space-y-3">
            <h2 className="text-sm font-medium tracking-wide text-fd-muted-foreground uppercase">
              {copy.requirements.title}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-fd-card/60 text-left text-xs text-fd-muted-foreground">
                    {copy.requirements.columns.map((column) => (
                      <th key={column} className="px-4 py-2.5 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {copy.requirements.rows.map((row) => (
                    <tr
                      key={row.platform}
                      className="border-t border-black/10 dark:border-white/10"
                    >
                      <td className="px-4 py-2.5 font-medium">{row.platform}</td>
                      <td className="px-4 py-2.5 text-fd-muted-foreground">{row.version}</td>
                      <td className="px-4 py-2.5 text-fd-muted-foreground">
                        {row.architecture}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{copy.firstLaunch.title}</p>
              <p className="text-sm leading-6 text-fd-muted-foreground">
                {copy.firstLaunch.body}
              </p>
              <Link
                href={docsUrl('/studio/installation')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-primary hover:underline"
              >
                {copy.links.installGuide}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href={docsUrl('/studio/getting-started')}
              className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <BookOpen className="size-4" />
              {copy.links.gettingStarted}
            </Link>
            <a
              href={STUDIO_RELEASES_PAGE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <ExternalLink className="size-4" />
              {copy.links.allReleases}
            </a>
          </div>
        </div>
      </div>

      {/*
        In flow under the content on a phone, where there is no "right side" to
        fill; from `lg` up it leaves the flow and takes the full height of the
        page against the viewport's right edge.
      */}
      <DownloadPosterWall className="h-[22rem] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%]" />
    </div>
  );
}
