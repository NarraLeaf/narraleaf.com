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
    <div className="mb-4 aspect-video w-full overflow-hidden bg-fd-muted">
      <Image
        ref={settleIfAlreadyLoaded}
        src={src}
        alt=""
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        // The screenshots are 3:2; the card is 16:9 and takes the crop off the
        // bottom, where a Studio window has the least going on. No corners, no
        // border — at this angle any frame reads as a box drawn on the page.
        className={cn(
          'size-full object-cover object-top transition-opacity duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </div>
  );
}
