import { cn } from '@/lib/cn';
import { DownloadPosterCard } from './download-poster-card';

/**
 * A tilted wall of Studio screenshots, drifting from the bottom left to the top
 * right.
 *
 * Decorative, and marked as such: the wall says "this is what you are about to
 * install" at a glance, but no single card is readable at this angle, so it is
 * hidden from assistive tech instead of narrating twelve alt texts nobody asked
 * for. The page's actual content is the column beside it.
 *
 * Neighbouring columns travel opposite ways. Running them all one way made the
 * wall one sliding sheet, and the eye reads a sheet as a single moving object it
 * can follow; counter-travel gives every column a neighbour going the other way,
 * so there is no shared direction to lock onto and the surface reads as depth
 * instead. Speeds still differ so the columns do not beat against each other.
 * Shots come from the same set as the home page's Studio run — 2956x1974 each,
 * cropped to 16:9 by the card.
 */
const COLUMNS = [
  {
    id: 'left',
    duration: '64s',
    direction: 'up',
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
    direction: 'down',
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
    direction: 'up',
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

function PosterColumn({
  images,
  duration,
  direction,
}: {
  images: readonly string[];
  duration: string;
  direction: 'up' | 'down';
}) {
  // Keys are index-based because the copies are the same files by design.
  const cards = Array.from({ length: COPIES }, () => images).flat();

  return (
    <div
      className="poster-wall-column flex h-fit w-[42%] shrink-0 flex-col will-change-transform"
      style={
        {
          '--poster-wall-duration': duration,
          // The keyframe divides by this to land exactly one copy along, which
          // it can only do while `100%` means the stack of cards. `h-fit` is
          // what makes it mean that: a flex item stretches to the row's height
          // by default, so the column measured the frame it overflows — 883px
          // against 2571px of cards — and every loop ended in a visible jump
          // roughly a card and a half long.
          '--poster-wall-copies': COPIES,
          // One keyframe, played backwards for the columns that fall. The loop
          // stays seamless either way: both ends of the travel are one copy
          // apart, and a copy of identical cards renders the same at both.
          '--poster-wall-direction': direction === 'down' ? 'reverse' : 'normal',
        } as React.CSSProperties
      }
    >
      {cards.map((src, index) => (
        <DownloadPosterCard
          key={`${src}-${index}`}
          src={src}
          // Three cards to a wall that covers a little under half the page.
          sizes="(min-width: 1024px) 22rem, 45vw"
        />
      ))}
    </div>
  );
}

export function DownloadPosterWall({ className }: { className?: string }) {
  return (
    /*
      Two nested masks rather than one: the horizontal feather rides on the
      outer box and the vertical one on the box inside it, which composes them
      without `mask-composite` — and, more to the point, keeps the vertical
      feather off the rotated layer, where a mask would arrive at 12 degrees.
    */
    <div
      aria-hidden
      className={cn(
        'poster-wall-feather-x pointer-events-none relative overflow-hidden select-none',
        className,
      )}
    >
      <div className="poster-wall-feather-y absolute inset-0">
        {/*
          Rotated clockwise, so the columns climb from the bottom left to the top
          right, and oversized so the corners the tilt opens up stay outside the
          clip. The three columns together are wider than the frame on purpose —
          cards running off both sides read as a surface continuing past the page,
          which columns fitted neatly inside do not.
        */}
        <div className="absolute inset-0 flex origin-center scale-[1.4] gap-4 rotate-[12deg]">
          {COLUMNS.map((column) => (
            <PosterColumn
              key={column.id}
              images={column.images}
              duration={column.duration}
              direction={column.direction}
            />
          ))}
        </div>

        {/*
          The wall goes soft on the same edges it goes transparent on, so it
          recedes instead of stopping. Two passes, the near one wide and light
          and the far one narrow and heavy: the second blurs what the first
          already blurred, so the focus falls away gradually rather than
          switching on halfway out.
        */}
        <div className="poster-wall-veil poster-wall-veil-near absolute inset-0" />
        <div className="poster-wall-veil poster-wall-veil-far absolute inset-0" />
      </div>
    </div>
  );
}
