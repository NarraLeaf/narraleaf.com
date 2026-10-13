import type { Locale } from '@/lib/i18n';
import { VideoFrame, bilibiliEmbedUrl, youtubeEmbedUrl } from '@/components/video-frame';

/**
 * The Studio introduction video, as the home page shows it and as a blog post
 * can through MDX (`<StudioVideo lang="zh" />`).
 *
 * Each language shows its own cut. English and Japanese pages embed their
 * YouTube uploads; Chinese pages embed the Bilibili one, although a Chinese cut
 * is on YouTube too. StudioDownloads deliberately does not pick a source by page
 * language, but a download link has to say where it leads; a video is only
 * something to press play on, and YouTube does not load in mainland China, where
 * most readers of the Chinese pages are.
 */
const VIDEOS: Record<Locale, { src: string; title: string }> = {
  en: {
    src: youtubeEmbedUrl('pLx5T0AdRHA'),
    title: 'NarraLeaf Studio - All-in-One Visual Novel IDE',
  },
  ja: {
    src: youtubeEmbedUrl('aMsqRjDq42w'),
    title: 'NarraLeaf Studio - 本格的なビジュアルノベルエディタ',
  },
  zh: {
    src: bilibiliEmbedUrl('BV1uSYA6VEBq'),
    title: 'NarraLeaf Studio 介绍视频',
  },
};

export function StudioVideo({ lang = 'en', className }: { lang?: Locale; className?: string }) {
  const video = VIDEOS[lang];
  return <VideoFrame src={video.src} title={video.title} className={className} />;
}
