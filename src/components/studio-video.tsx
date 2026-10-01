import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/cn';

/**
 * The Studio introduction video, as the home page shows it and as a blog post
 * can through MDX (`<StudioVideo lang="zh" />`).
 *
 * Chinese pages embed the Bilibili upload and every other language the YouTube
 * one. StudioDownloads deliberately does not pick a source by page language, but
 * a download link has to say where it leads; a video is only something to press
 * play on, and YouTube does not load in mainland China, where most readers of the
 * Chinese pages are.
 *
 * - YouTube goes through youtube-nocookie.com, the privacy-enhanced host, so the
 *   player stores nothing about a visitor who never presses play. `rel=0` keeps
 *   the suggestions at the end to this channel.
 * - Bilibili's player starts on its own and draws danmaku over the picture unless
 *   told otherwise, so `autoplay=0` and `danmaku=0` are spelled out.
 *
 * `loading="lazy"` keeps the player off the first load until the visitor scrolls
 * towards it. `strict-origin-when-cross-origin` is the policy YouTube's own embed
 * code carries: its player will not start for a page that sends it no referrer.
 */
const VIDEOS = {
  youtube: {
    src: 'https://www.youtube-nocookie.com/embed/pLx5T0AdRHA?rel=0',
    title: 'NarraLeaf Studio - All-in-One Visual Novel IDE',
  },
  bilibili: {
    src: 'https://player.bilibili.com/player.html?bvid=BV1uSYA6VEBq&p=1&autoplay=0&danmaku=0&high_quality=1',
    title: 'NarraLeaf Studio 介绍视频',
  },
} as const;

export function StudioVideo({ lang = 'en', className }: { lang?: Locale; className?: string }) {
  const video = lang === 'zh' ? VIDEOS.bilibili : VIDEOS.youtube;

  return (
    <div
      className={cn(
        'not-prose aspect-video overflow-hidden rounded-xl border border-black/10 bg-black shadow-sm dark:border-white/10',
        className,
      )}
    >
      <iframe
        src={video.src}
        title={video.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}
