import { cn } from '@/lib/cn';

/**
 * A YouTube video's player address.
 *
 * youtube-nocookie.com is the privacy-enhanced host, so the player stores nothing
 * about a visitor who never presses play. `rel=0` keeps the suggestions at the
 * end to this channel.
 */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
}

/**
 * A Bilibili video's player address. Bilibili's player starts on its own and
 * draws danmaku over the picture unless told otherwise, so `autoplay=0` and
 * `danmaku=0` are spelled out.
 */
export function bilibiliEmbedUrl(bvid: string): string {
  return `https://player.bilibili.com/player.html?bvid=${bvid}&p=1&autoplay=0&danmaku=0&high_quality=1`;
}

/**
 * A video player as a 16:9 frame.
 *
 * `loading="lazy"` keeps the player off the first load until the visitor scrolls
 * towards it. `strict-origin-when-cross-origin` is the policy YouTube's own embed
 * code carries: its player will not start for a page that sends it no referrer.
 */
export function VideoFrame({ src, title, className }: { src: string; title: string; className?: string }) {
  return (
    <div
      className={cn(
        'not-prose aspect-video overflow-hidden rounded-xl border border-black/10 bg-black shadow-sm dark:border-white/10',
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="size-full"
      />
    </div>
  );
}
