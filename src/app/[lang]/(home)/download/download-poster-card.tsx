'use client';

import { useCallback, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { cn } from '@/lib/cn';

/**
 * One screenshot in the poster wall, holding its place before it arrives.
 *
 * The card's frame is drawn first and the screenshot fades in over it, so the
 * wall reads as a wall from the first paint rather than assembling itself card
 * by card as the network delivers them. Nothing moves when an image lands — the
 * frame already occupies exactly the space the image will — so the fade is the
 * only thing that changes, which is what keeps it from reading as a jolt.
 *
 * That placeholder is a layer of its own rather than a fill on the card,
 * because the screenshots are not rectangles: each one is a Studio window with
 * a soft drop shadow around it, and about a fifth of every file is transparent
 * or part-transparent. A fill on the card sits behind that shadow for as long
 * as the card exists, which turns the whole margin into a flat grey block and
 * squares the window off — the alpha reads as lost. As a layer it can go to
 * zero the moment the image lands, and the wall gets windows floating over the
 * page instead of tiles butted against each other.
 */
export function DownloadPosterCard({ src, sizes }: { src: StaticImageData; sizes: string }) {
  const [loaded, setLoaded] = useState(false);

  /*
    `onLoad` alone misses the images the browser already has, which after a
    first visit is most of them: React attaches the handler while hydrating, and
    a cached image finished decoding well before that — the card would sit at
    zero opacity holding an image that had already arrived. The ref runs against
    the same element and asks it outright.
  */
  const settleIfAlreadyLoaded = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete) setLoaded(true);
  }, []);

  return (
    <div className="relative mb-4 aspect-[2956/1974] w-full">
      <div
        aria-hidden
        className={cn(
          'absolute inset-0 bg-fd-muted transition-opacity duration-700 ease-out',
          loaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <Image
        ref={settleIfAlreadyLoaded}
        src={src}
        alt=""
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        // Eager, against the default, because the browser's lazy heuristic is
        // built for scrolling: it starts a fetch once an image is close to the
        // viewport, on the assumption that a scroll got it there and the same
        // scroll will keep it out a moment longer. Nothing scrolls here — the
        // columns drift in on an animation, so a card is already on screen by
        // the time the fetch is allowed to start, and it spends the download
        // sitting there as a grey rectangle. Loading up front costs the
        // fourteen files the wall is built from, not the forty-five cards:
        // every copy of a column points at the same URLs.
        loading="eager"
        // Low, though: the wall is decorative and the page is a download page.
        // It can wait behind everything a visitor actually came for.
        fetchPriority="low"
        // The card carries the screenshots' own 2956x1974, so nothing is
        // cropped. Cropping the overflow off the bottom is what a rectangular
        // screenshot wants, but these are windows: the crop landed on the
        // window's lower edge and the shadow under it, and every poster came
        // out sliced flat along the bottom. No corners and no border either —
        // at this angle any frame reads as a box drawn on the page, and the
        // shadow the file already carries is the only edge the wall needs.
        className={cn(
          'relative size-full object-contain transition-opacity duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
