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
 * A multi-part video on Bilibili: the ids its player wants, and the `cid` of each
 * part, by part number. The player picks a part by its `cid`, not by `p`, so a
 * part cannot be addressed without it; the numbers come from
 * `api.bilibili.com/x/web-interface/view?bvid=<bvid>`, which lists them under
 * `data.pages`.
 */
export type BilibiliVideo = { aid: string; bvid: string; parts: Record<string, string> };

/**
 * One part of a multi-part Bilibili video, as Bilibili's own embed code addresses
 * it: `isOutside` for a player on another site, `aid` and `bvid` for the video,
 * `p` for the part, and that part's own `cid`, which is what actually loads it -
 * a `p` on its own leaves the player wherever the `cid` points, so the two travel
 * together. Null when the video has no such part.
 */
export function bilibiliPartEmbedUrl({ aid, bvid, parts }: BilibiliVideo, part: number): string | null {
  const cid = parts[String(part)];
  if (!cid) return null;
  return `https://player.bilibili.com/player.html?isOutside=true&aid=${aid}&bvid=${bvid}&cid=${cid}&p=${part}&autoplay=0&danmaku=0&high_quality=1`;
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
