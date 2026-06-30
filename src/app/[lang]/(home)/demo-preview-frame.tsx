'use client';

import { useEffect, useId, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

type DemoPreviewFrameProps = {
  src: string;
  title: string;
  expandLabel: string;
  collapseLabel: string;
};

function DemoIframe(props: { src: string; title: string }) {
  const { src, title } = props;

  return (
    <iframe
      data-demo-preview-iframe
      src={src}
      title={title}
      width={1280}
      height={720}
      className="absolute inset-0 block h-full w-full bg-[#08151b]"
      loading="eager"
      scrolling="no"
      style={{ border: 0, display: 'block', height: '100%', width: '100%' }}
    />
  );
}

export function DemoPreviewFrame(props: DemoPreviewFrameProps) {
  const { src, title, expandLabel, collapseLabel } = props;
  const [expanded, setExpanded] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!expanded) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expanded]);

  return (
    <div
      data-demo-preview-frame
      className="relative w-full overflow-hidden rounded-xl bg-[#08151b]"
      style={{ aspectRatio: '16 / 9' }}
    >
      <div
        role={expanded ? 'dialog' : undefined}
        aria-modal={expanded ? true : undefined}
        aria-labelledby={expanded ? titleId : undefined}
        className={
          expanded
            ? 'fixed inset-0 z-50 flex items-center justify-center bg-[#05090d]/96 backdrop-blur-sm'
            : 'absolute inset-0 h-full w-full'
        }
      >
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        <div
          data-demo-preview-surface
          className={[
            'relative overflow-hidden bg-[#08151b]',
            expanded
              ? 'rounded-none shadow-2xl'
              : 'h-full w-full rounded-xl shadow-[0_18px_46px_rgba(0,0,0,0.28)]',
          ].join(' ')}
          style={
            expanded
              ? { aspectRatio: '16 / 9', width: 'min(100vw, 177.7778dvh)' }
              : { height: '100%', width: '100%' }
          }
        >
          <DemoIframe src={src} title={title} />
          <button
            type="button"
            aria-label={expanded ? collapseLabel : expandLabel}
            onClick={() => setExpanded((current) => !current)}
            className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-lg border border-white/18 bg-black/55 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none"
          >
            {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
