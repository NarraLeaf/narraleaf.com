'use client';

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react';

type LayeredDemoShowcaseProps = {
  code: ReactNode;
  demo: ReactNode;
  codeLabel: string;
  demoLabel: string;
};

type ActivePanel = 'code' | 'demo';

/**
 * The hover cross-fade, as a CSS transition rather than an animation library.
 *
 * Only two properties move here — `opacity` and `box-shadow` — between values
 * this component already computes on every render, and neither needs spring
 * physics, gesture handling, or layout animation. `motion` was the single
 * largest dependency in the home page's bundle at 132 KB, loaded on first paint
 * for exactly these two panels; the browser interpolates both properties
 * natively for nothing. Timing and easing below are the same numbers the
 * `motion` transition used, so the movement is unchanged.
 *
 * Transitions do not fire for the values an element first renders with, which
 * reproduces the `initial={false}` this component relied on to avoid animating
 * the panels in on mount.
 */
const panelTransition = 'opacity 240ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1)';

function panelOpacity(active: boolean, isLayeredLayout: boolean) {
  return !isLayeredLayout || active ? 1 : 0.72;
}

function panelShadow(active: boolean, isLayeredLayout: boolean) {
  if (!isLayeredLayout) return '0 0 0 rgba(0,0,0,0)';

  return active ? '0 30px 86px rgba(0,0,0,0.44)' : '0 16px 42px rgba(0,0,0,0.22)';
}

function panelStyle(active: boolean, isLayeredLayout: boolean): CSSProperties {
  return {
    opacity: panelOpacity(active, isLayeredLayout),
    boxShadow: panelShadow(active, isLayeredLayout),
    transition: panelTransition,
  };
}

export function LayeredDemoShowcase(props: LayeredDemoShowcaseProps) {
  const { code, demo, codeLabel, demoLabel } = props;
  const [activePanel, setActivePanel] = useState<ActivePanel>('demo');
  const [foregroundPanel, setForegroundPanel] = useState<ActivePanel>('demo');
  const [isLayeredLayout, setIsLayeredLayout] = useState(false);

  const codeIsActive = activePanel === 'code';
  const demoIsActive = activePanel === 'demo';
  const codeIsForeground = foregroundPanel === 'code';
  const demoIsForeground = foregroundPanel === 'demo';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateLayeredLayout = () => setIsLayeredLayout(mediaQuery.matches);

    updateLayeredLayout();
    mediaQuery.addEventListener('change', updateLayeredLayout);

    return () => {
      mediaQuery.removeEventListener('change', updateLayeredLayout);
    };
  }, []);

  useEffect(() => {
    const foregroundTimer = window.setTimeout(() => {
      setForegroundPanel(activePanel);
    }, 120);

    return () => {
      window.clearTimeout(foregroundTimer);
    };
  }, [activePanel]);

  return (
    <div className="mt-8">
      <div className="relative grid gap-6 lg:block lg:h-[432px]">
        <div
          role="group"
          tabIndex={0}
          aria-label={codeLabel}
          onFocus={() => setActivePanel('code')}
          onMouseEnter={() => setActivePanel('code')}
          style={panelStyle(codeIsActive, isLayeredLayout)}
          className={[
            // `min-w-0` keeps the code panel from widening the stacked layout: a grid item's
            // automatic minimum size is its content's min-content width, and the script preview
            // scrolls a `min-w-max` block, so without this the track grows to the longest line
            // and the whole page scrolls sideways on a phone.
            'relative w-full min-w-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none lg:absolute lg:top-0 lg:left-0 lg:w-[62%]',
            codeIsForeground ? 'lg:z-30' : 'lg:z-10',
          ].join(' ')}
        >
          {code}
        </div>

        <div
          role="group"
          tabIndex={0}
          aria-label={demoLabel}
          onFocus={() => setActivePanel('demo')}
          onMouseEnter={() => setActivePanel('demo')}
          style={panelStyle(demoIsActive, isLayeredLayout)}
          className={[
            'relative w-full min-w-0 rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none lg:absolute lg:top-10 lg:right-0 lg:w-[61%]',
            demoIsForeground ? 'lg:z-30' : 'lg:z-10',
          ].join(' ')}
        >
          {demo}
        </div>
      </div>
    </div>
  );
}
