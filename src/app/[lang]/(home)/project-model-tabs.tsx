'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  HighlightedName,
  type ProjectLogoKind,
  type ProjectTone,
} from './project-identity';

export type ProjectModelTabCopy = {
  label: string;
  name: string;
  tone: ProjectTone;
  logo: ProjectLogoKind;
  title: string;
  description: string;
  points: string[];
};

type ProjectModelTabsProps = {
  tabs: ProjectModelTabCopy[];
};

export function ProjectModelTabs(props: ProjectModelTabsProps) {
  const { tabs } = props;
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  if (!activeTab) return null;

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="NarraLeaf project models"
        className="flex gap-2 overflow-x-auto border-b border-black/10 pb-3 dark:border-white/10"
      >
        {tabs.map((tab, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={tab.label}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`${baseId}-panel-${index}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'shrink-0 rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none',
                active
                  ? 'border-black/15 bg-fd-card text-fd-foreground dark:border-white/15'
                  : 'border-black/10 bg-fd-muted/35 text-fd-muted-foreground hover:bg-fd-muted/50 hover:text-fd-foreground dark:border-white/10',
              )}
            >
              <span className="block text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <section
        id={`${baseId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        className="rounded-xl border border-black/10 bg-fd-card p-6 dark:border-white/10 sm:p-8"
      >
        <div className="max-w-2xl space-y-4">
          <h3 className="text-2xl font-semibold tracking-tight text-balance">
            <HighlightedName text={activeTab.title} name={activeTab.name} tone={activeTab.tone} />
          </h3>
          <p className="text-base leading-7 text-fd-muted-foreground">{activeTab.description}</p>
        </div>

        <ul className="mt-8 space-y-3 text-sm leading-6 text-fd-muted-foreground">
          {activeTab.points.map((point) => (
            <li key={point} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-fd-muted-foreground/45"
              />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
