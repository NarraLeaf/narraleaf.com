import catalogue from '@/data/tutorials.json';
import { type BilibiliVideo, bilibiliPartEmbedUrl, youtubeEmbedUrl } from '@/components/video-frame';
import { tutorialsRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

/**
 * The video tutorials, as published.
 *
 * `src/data/tutorials.json` and the posters in `public/static/img/tutorials/` are
 * written by the tutorials project (`NarraLeaf-Promo/tutorials`, `node
 * tools/site.mjs <this checkout>`) after an episode is uploaded, from the same
 * title, summary and chapters the upload carries. Edit them there, not here.
 *
 * An episode is listed in a language once its video in that language is
 * published; there is no fallback to another language's cut, because the point of
 * the page is the list in the reader's own language.
 */
export type TutorialVideo = {
  youtube: string;
  /** When the video went up, as YouTube reports it. */
  published: string;
  title: string;
  /** "Episode 1", "第 1 集", "第 1 回". */
  label: string;
  summary: string;
  chapters: { t: number; text: string }[];
  /** Seconds. */
  length: number;
  poster: string;
};

export type TutorialEpisode = {
  slug: string;
  number: number;
  videos: Partial<Record<Locale, TutorialVideo>>;
};

export type TutorialSeries = {
  id: string;
  title: Record<Locale, string>;
  playlist: Record<Locale, string>;
  /**
   * The series on Bilibili: one video whose parts are the episodes, part `n` being
   * episode `n`. The Chinese pages play it and link it beside the YouTube playlist.
   */
  bilibili?: BilibiliVideo;
  episodes: TutorialEpisode[];
};

const series = catalogue.series as TutorialSeries[];

export const tutorialsCopy = {
  en: {
    title: 'Tutorials',
    description:
      'Video tutorials for NarraLeaf Studio. Each episode covers one task, from creating a project to building and publishing a game.',
    empty: 'No tutorials yet.',
    allTutorials: 'All tutorials',
    playlist: 'Playlist on YouTube',
    collection: 'Collection on Bilibili',
    watchOnYouTube: 'Watch on YouTube',
    watchOnBilibili: 'Watch on Bilibili',
    chapters: 'Chapters',
    previous: 'Previous',
    next: 'Next',
  },
  zh: {
    title: '教程',
    description: 'NarraLeaf Studio 的视频教程。每集讲解一项操作，从新建项目到构建并发布游戏。',
    empty: '还没有教程。',
    allTutorials: '全部教程',
    playlist: 'YouTube 播放列表',
    collection: '哔哩哔哩合集',
    watchOnYouTube: '在 YouTube 上观看',
    watchOnBilibili: '在哔哩哔哩观看',
    chapters: '章节',
    previous: '上一集',
    next: '下一集',
  },
  ja: {
    title: 'チュートリアル',
    description:
      'NarraLeaf Studio の動画チュートリアルです。1 回につき 1 つの作業を扱い、最初のプロジェクトの作成から、ゲームのビルドと公開までを解説します。',
    empty: 'チュートリアルはまだありません。',
    allTutorials: 'すべてのチュートリアル',
    playlist: 'YouTube の再生リスト',
    collection: 'bilibili のコレクション',
    watchOnYouTube: 'YouTube で見る',
    watchOnBilibili: 'bilibili で見る',
    chapters: 'チャプター',
    previous: '前の回',
    next: '次の回',
  },
} satisfies Record<Locale, Record<string, string>>;

export type ListedEpisode = { episode: TutorialEpisode; video: TutorialVideo };

/** Every series with the episodes published in `locale`, in order; a series with none is left out. */
export function tutorialSeries(locale: Locale): { series: TutorialSeries; episodes: ListedEpisode[] }[] {
  return series.flatMap((s) => {
    const episodes = s.episodes.flatMap((episode) => {
      const video = episode.videos[locale];
      return video ? [{ episode, video }] : [];
    });
    return episodes.length > 0 ? [{ series: s, episodes }] : [];
  });
}

/** The episode at `/tutorials/<slug>` in `locale`, with its neighbours in the same series. */
export function getTutorial(slug: string, locale: Locale) {
  for (const { series: s, episodes } of tutorialSeries(locale)) {
    const index = episodes.findIndex(({ episode }) => episode.slug === slug);
    if (index === -1) continue;
    return {
      series: s,
      ...episodes[index],
      previous: episodes[index - 1] as ListedEpisode | undefined,
      next: episodes[index + 1] as ListedEpisode | undefined,
    };
  }
}

/** The languages an episode is published in — what its alternates and sitemap entries may name. */
export function tutorialLocales(slug: string): Locale[] {
  const episode = series.flatMap((s) => s.episodes).find((e) => e.slug === slug);
  return episode ? i18n.languages.filter((locale) => episode.videos[locale] !== undefined) : [];
}

export function tutorialSlugs(): string[] {
  return series.flatMap((s) => s.episodes.map((e) => e.slug));
}

export function tutorialUrl(slug: string, locale: Locale): string {
  return localizedPath(`${tutorialsRoute}/${slug}`, locale);
}

/**
 * The player for an episode. A Chinese page plays the episode's part of the
 * series' Bilibili video, since YouTube does not load in mainland China;
 * otherwise YouTube.
 */
export function tutorialEmbedUrl(
  { series, episode, video }: { series: TutorialSeries; episode: TutorialEpisode; video: TutorialVideo },
  locale: Locale,
): string {
  return locale === 'zh' && series.bilibili
    ? bilibiliPartEmbedUrl(series.bilibili, episode.number)
    : youtubeEmbedUrl(video.youtube);
}

export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** One episode on Bilibili: the series' video, opened at that episode's part. */
export function bilibiliWatchUrl({ bvid }: BilibiliVideo, part: number): string {
  return `https://www.bilibili.com/video/${bvid}/?p=${part}`;
}

export function youtubePlaylistUrl(id: string): string {
  return `https://www.youtube.com/playlist?list=${id}`;
}

/** The series on Bilibili: the one video that holds every episode. */
export function bilibiliCollectionUrl({ bvid }: BilibiliVideo): string {
  return `https://www.bilibili.com/video/${bvid}/`;
}

/** `2:01`, as YouTube shows a length: whole seconds, rounded down. */
export function formatClock(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** ISO 8601, for the structured data: `PT2M1S`. */
export function isoDuration(seconds: number): string {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return `PT${minutes ? `${minutes}M` : ''}${whole % 60}S`;
}
