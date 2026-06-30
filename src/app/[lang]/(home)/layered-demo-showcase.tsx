'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { motion } from 'motion/react';

type LayeredDemoShowcaseProps = {
  code: ReactNode;
  demo: ReactNode;
  codeLabel: string;
  demoLabel: string;
};

type ActivePanel = 'code' | 'demo';

const panelTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

function panelOpacity(active: boolean, isLayeredLayout: boolean) {
  return !isLayeredLayout || active ? 1 : 0.72;
}

function panelShadow(active: boolean, isLayeredLayout: boolean) {
  if (!isLayeredLayout) return '0 0 0 rgba(0,0,0,0)';

  return active ? '0 30px 86px rgba(0,0,0,0.44)' : '0 16px 42px rgba(0,0,0,0.22)';
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
        <motion.div
          role="group"
          tabIndex={0}
          aria-label={codeLabel}
          onFocus={() => setActivePanel('code')}
          onMouseEnter={() => setActivePanel('code')}
          initial={false}
          animate={{
            opacity: panelOpacity(codeIsActive, isLayeredLayout),
            boxShadow: panelShadow(codeIsActive, isLayeredLayout),
          }}
          transition={panelTransition}
          className={[
            'relative w-full rounded-2xl focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none lg:absolute lg:top-0 lg:left-0 lg:w-[62%]',
            codeIsForeground ? 'lg:z-30' : 'lg:z-10',
          ].join(' ')}
        >
          {code}
        </motion.div>

        <motion.div
          role="group"
          tabIndex={0}
          aria-label={demoLabel}
          onFocus={() => setActivePanel('demo')}
          onMouseEnter={() => setActivePanel('demo')}
          initial={false}
          animate={{
            opacity: panelOpacity(demoIsActive, isLayeredLayout),
            boxShadow: panelShadow(demoIsActive, isLayeredLayout),
          }}
          transition={panelTransition}
          className={[
            'relative w-full rounded-xl focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none lg:absolute lg:top-10 lg:right-0 lg:w-[61%]',
            demoIsForeground ? 'lg:z-30' : 'lg:z-10',
          ].join(' ')}
        >
          {demo}
        </motion.div>
      </div>
    </div>
  );
}
