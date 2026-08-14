import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * A tilted wall of Studio screenshots, drifting from the bottom left to the top
 * right.
 *
 * Decorative, and marked as such: the wall says "this is what you are about to
 * install" at a glance, but no single card is readable at this angle, so it is
 * hidden from assistive tech instead of narrating twelve alt texts nobody asked
 * for. The page's actual content is the column beside it.
 *
 * Both columns travel the same way, so the whole surface reads as one drift up
 * and to the right; only the speeds differ, which is what keeps the two from
 * locking into a pattern the eye can follow. Shots come from the same set as the
 * home page's Studio run — 2956x1974 each, cropped to 16:9 by the card.
 */
const COLUMNS = [
  {
    id: 'left',
    duration: '64s',
    images: [
      '/static/img/studio-slides/story-editor.webp',
      '/static/img/studio-slides/ui-editor.webp',
      '/static/img/studio-slides/dashboard.webp',
      '/static/img/studio-slides/translation.webp',
      '/static/img/studio-slides/build-for-production.webp',
    ],
  },
  {
    id: 'middle',
    duration: '82s',
    images: [
      '/static/img/studio-slides/story-live-preview.webp',
      '/static/img/studio-slides/ui-templates.webp',
      '/static/img/studio-slides/blueprint-game-config.webp',
      '/static/img/studio-slides/dev-mode.webp',
      '/static/img/studio-slides/version-control.webp',
    ],
  },
  {
    id: 'right',
    duration: '72s',
    images: [
      '/static/img/studio-slides/story-motion-editor.webp',
      '/static/img/studio-slides/live2d-puppet.webp',
      '/static/img/studio-slides/dialog-customization.webp',
      '/static/img/studio-slides/plugin-system.webp',
      // The set has fourteen shots and three even columns want fifteen. The
      // shortest column is the one that runs out of cards first, so it borrows
      // one rather than being left short.
      '/static/img/studio-slides/story-editor.webp',
    ],
  },
] as const;

/**
 * How many times a column repeats its cards.
 *
 * Three, not two. The loop only stays seamless while the cards still ahead of
 * the travel cover the visible strip, and with N copies that is (N-1) copies'
 * worth. The wall spans the full height of the page rather than a fixed 46rem,
 * so two copies left the columns running out before they came back around: a
 * band of empty page swept through, then the wall jumped back to the start.
 *
 * Same files every copy, so the extra cards cost markup and no bandwidth.
 */
const COPIES = 3;

function PosterColumn({ images, duration }: { images: readonly string[]; duration: string }) {
  // Keys are index-based because the copies are the same files by design.
  const cards = Array.from({ length: COPIES }, () => images).flat();

  return (
    <div
      className="poster-wall-column flex w-[42%] shrink-0 flex-col will-change-transform"
      style={
        {
          '--poster-wall-duration': duration,
          // The keyframe divides by this to land exactly one copy along.
          '--poster-wall-copies': COPIES,
        } as React.CSSProperties
      }
    >
      {cards.map((src, index) => (
        <Image
          key={`${src}-${index}`}
          src={src}
          alt=""
          width={2956}
          height={1974}
          // Three cards to a wall that covers a little under half the page.
          sizes="(min-width: 1024px) 22rem, 45vw"
          // The screenshots are 3:2; the card is 16:9 and takes the crop off the
          // bottom, where a Studio window has the least going on. No corners, no
          // border — at this angle any frame reads as a box drawn on the page.
          className="mb-4 aspect-video w-full object-cover object-top"
        />
      ))}
    </div>
  );
}

export function DownloadPosterWall({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none relative overflow-hidden select-none', className)}
    >
      {/*
        Rotated clockwise, so the columns climb from the bottom left to the top
        right, and oversized so the corners the tilt opens up stay outside the
        clip. The three columns together are wider than the frame on purpose —
        cards running off both sides read as a surface continuing past the page,
        which columns fitted neatly inside do not.
      */}
      <div className="absolute inset-0 flex origin-center scale-[1.4] gap-4 rotate-[12deg]">
        {COLUMNS.map((column) => (
          <PosterColumn key={column.id} images={column.images} duration={column.duration} />
        ))}
      </div>

      {/*
        Every edge that meets the page dissolves into it. Without this the wall
        stops at three straight lines and reads as a picture placed on the page
        rather than a surface running underneath it — the right edge needs
        nothing, since it runs off the viewport.
      */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-fd-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-fd-background to-transparent" />
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-fd-background to-transparent" />
    </div>
  );
}
