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
        aria-label="NarraLeaf project routes"
        className="grid gap-3 lg:grid-cols-3"
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
                'group min-h-28 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none',
                active
                  ? 'border-black/20 bg-fd-card text-fd-foreground shadow-sm dark:border-white/20'
                  : 'border-black/10 bg-fd-card/65 text-fd-muted-foreground hover:-translate-y-0.5 hover:bg-fd-card hover:text-fd-foreground dark:border-white/10',
              )}
            >
              <span className="block min-w-0 space-y-2">
                <span className="block text-[11px] font-medium tracking-[0.16em] text-fd-muted-foreground uppercase">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block text-base font-semibold tracking-tight">{tab.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <section
        id={`${baseId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        className="rounded-xl border border-black/10 bg-fd-card p-6 shadow-sm dark:border-white/10 dark:bg-fd-card/85 sm:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight text-balance">
              <HighlightedName text={activeTab.title} name={activeTab.name} tone={activeTab.tone} />
            </h3>
            <p className="text-base leading-7 text-fd-muted-foreground">{activeTab.description}</p>
          </div>

          <ol className="divide-y divide-black/10 border-y border-black/10 text-sm leading-6 text-fd-muted-foreground dark:divide-white/10 dark:border-white/10">
            {activeTab.points.map((point, index) => (
              <li key={point} className="grid gap-3 py-4 sm:grid-cols-[56px_1fr]">
                <span className="font-mono text-xs font-medium tracking-[0.16em] text-fd-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
