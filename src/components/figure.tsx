import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { cn } from '@/lib/cn';

/**
 * Screenshots and screen recordings in the docs.
 *
 * Two components, one contract: pass `src` and the figure renders; leave it out
 * and the figure becomes a brief for whoever captures the shot. The brief is
 * written in the page's own language, so nothing here is translated — the only
 * chrome is a format badge and, for a recording, its length.
 *
 * A pending figure is **development-only**. `NODE_ENV` is `production` in
 * `next build`, so a page that still owes a recording ships without a hole in
 * it: the reader sees the prose, and the person running `next dev` sees exactly
 * what is missing and where. That is the whole reason the placeholder is a
 * component rather than an MDX comment — a comment cannot be seen while writing
 * the page, and a visible "coming soon" box cannot be unseen by a reader.
 */

interface PendingProps {
  /** What to capture or record, in the language of the page. */
  brief: string;
  /** Rough length of the recording, e.g. `6s`. Recordings only. */
  duration?: string;
  kind: 'IMG' | 'GIF';
}

function Pending({ brief, duration, kind }: PendingProps) {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      className="my-6 flex flex-col gap-2 rounded-lg border border-dashed border-fd-border bg-fd-muted/40 p-4 text-sm text-fd-muted-foreground"
      data-pending-figure={kind}
    >
      <div className="flex flex-row items-center gap-2">
        <span className="rounded-sm bg-fd-primary/10 px-1.5 py-0.5 font-mono text-xs font-medium text-fd-primary">
          {kind}
        </span>
        {duration ? <span className="font-mono text-xs">≈ {duration}</span> : null}
      </div>
      <p className="m-0">{brief}</p>
    </div>
  );
}

interface FrameProps {
  src: string;
  alt: string;
  caption?: string;
  /** Intrinsic pixel size, when known. Reserves the space before the file loads. */
  width?: number;
  height?: number;
  className?: string;
}

/**
 * A rendered figure. Plain `<img>` rather than `next/image`: these are captures
 * of a desktop application at device-pixel-ratio 2, already sized for the
 * column they sit in, and the optimizer's benefit does not pay for making every
 * MDX call site declare intrinsic dimensions.
 *
 * Click to zoom is not decoration here. A whole application window scaled into a
 * prose column puts its labels below reading size, and the labels are the point
 * of the screenshot.
 */
function Frame({ src, alt, caption, width, height, className }: FrameProps) {
  return (
    <figure className="my-6">
      <ImageZoom src={src} zoomInProps={{ alt }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- `next/image` wants
            intrinsic dimensions at every call site, which would put a width and a
            height in every MDX figure and break the moment a shot is retaken at a
            different window size. These are already-sized WebP captures. */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          // The captures carry the application window's own frame — rounded corners,
          // title bar, traffic lights — so a border here would be a second frame
          // around the first one.
          className={cn('w-full cursor-zoom-in rounded-lg', className)}
        />
      </ImageZoom>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export interface FigureProps {
  /** Path under `/static/img/…`. Omit while the screenshot is still owed. */
  src?: string;
  alt?: string;
  caption?: string;
  /** What the screenshot should show, when there is no `src` yet. */
  brief?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Figure({ src, alt, caption, brief, ...rest }: FigureProps) {
  if (!src) {
    return <Pending kind="IMG" brief={brief ?? alt ?? caption ?? ''} />;
  }

  return <Frame src={src} alt={alt ?? caption ?? ''} caption={caption} {...rest} />;
}

export interface GifProps {
  /** Path under `/static/img/…`. Omit while the recording is still owed. */
  src?: string;
  alt?: string;
  caption?: string;
  /** What the recording should show. Required — a recording without one cannot be made. */
  brief: string;
  /** Rough length, e.g. `6s`. */
  duration?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function Gif({ src, alt, caption, brief, duration, ...rest }: GifProps) {
  if (!src) {
    return <Pending kind="GIF" brief={brief} duration={duration} />;
  }

  return <Frame src={src} alt={alt ?? brief} caption={caption} {...rest} />;
}
