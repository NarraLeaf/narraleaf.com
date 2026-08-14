'use client';

import { useState, useSyncExternalStore } from 'react';
import { ChevronDown, Download, ExternalLink, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { cn } from '@/lib/cn';
import { AppleLogo, WindowsLogo } from '@/components/brand-icons';
import {
  STUDIO_RELEASES_PAGE,
  type DownloadSourceId,
  type StudioDownload,
  type StudioPlatformId,
  type StudioReleaseInfo,
  withDownloadSource,
} from '@/lib/studio-release';

export type DownloadPanelCopy = {
  detecting: string;
  pickPlatform: string;
  /** `{platform}` is replaced with the platform name. */
  downloadFor: string;
  unavailable: string;
  allReleases: string;
  source: {
    label: string;
    /** The name of each source; the button itself says what it does. */
    options: Record<DownloadSourceId, string>;
  };
};

const SOURCE_ORDER = ['github', 'mirror'] as const satisfies readonly DownloadSourceId[];

/**
 * Guess which build the visitor came for.
 *
 * Only ever a guess: a browser will not say which CPU a Mac has, and Chrome
 * reports "Intel Mac OS X" on Apple Silicon too. So the guess picks the platform
 * and never the architecture — which is enough, because macOS is published for
 * Apple Silicon only — and every other build stays one click away in the
 * dropdown, so a wrong guess costs the visitor a click, not a download.
 */
function detectPlatform(): StudioPlatformId | null {
  if (typeof navigator === 'undefined') return null;

  const client = navigator as Navigator & { userAgentData?: { platform?: string } };
  const haystack = `${client.userAgentData?.platform ?? ''} ${navigator.platform ?? ''} ${navigator.userAgent ?? ''}`;

  // macOS first: "Darwin" would otherwise be claimed by the Windows test.
  if (/mac|iphone|ipad|ipod/i.test(haystack)) return 'mac-arm64';
  if (/win/i.test(haystack)) return 'windows';

  return null;
}

function subscribeToNothing(): () => void {
  return () => {};
}

function getServerSnapshot(): undefined {
  return undefined;
}

function PlatformIcon({ id, className }: { id: StudioPlatformId; className?: string }) {
  return id === 'windows' ? (
    <WindowsLogo className={className} />
  ) : (
    <AppleLogo className={className} />
  );
}

/**
 * The left half of the split control: the action itself.
 *
 * Left-aligned rather than centred, because the label changes length with the
 * platform and the version — a centred label would shift sideways under the
 * visitor as the guess resolves, while the dropdown beside it stays put.
 */
function PrimaryAction({
  href,
  icon,
  label,
  detail,
  disabled,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  detail?: string;
  disabled?: boolean;
}) {
  const content = (
    <>
      {icon}
      <span className="flex min-w-0 flex-col items-start leading-tight">
        <span className="truncate">{label}</span>
        {detail ? (
          <span className="truncate text-xs font-normal text-white/75">{detail}</span>
        ) : null}
      </span>
    </>
  );

  const className =
    'flex min-w-0 flex-1 items-center justify-start gap-3 rounded-l-xl bg-fd-primary px-5 py-4 text-left text-base font-medium text-white transition-colors duration-200 [&_svg]:size-5 [&_svg]:shrink-0';

  if (disabled || !href) {
    return (
      <div className={`${className} cursor-default opacity-70`} aria-disabled>
        {content}
      </div>
    );
  }

  return (
    <a href={href} className={`${className} hover:bg-fd-primary/90`}>
      {content}
    </a>
  );
}

/**
 * Pick where the bytes come from.
 *
 * A segmented control rather than a dropdown: there are two options, both matter
 * to whoever is looking for them, and the one in use has to stay readable while
 * the download runs.
 */
function SourceSelector({
  value,
  onChange,
  copy,
}: {
  value: DownloadSourceId;
  onChange: (source: DownloadSourceId) => void;
  copy: DownloadPanelCopy;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
      <p className="text-sm font-medium">{copy.source.label}</p>
      <div
        role="radiogroup"
        aria-label={copy.source.label}
        className="flex shrink-0 gap-1 rounded-lg bg-fd-muted p-1"
      >
        {SOURCE_ORDER.map((id) => {
          const selected = id === value;

          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                selected
                  ? 'bg-fd-background text-fd-foreground shadow-sm'
                  : 'text-fd-muted-foreground hover:text-fd-foreground',
              )}
            >
              {copy.source.options[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DownloadPanel({
  release,
  copy,
  defaultSource,
}: {
  release: StudioReleaseInfo;
  copy: DownloadPanelCopy;
  /** Chosen by page language: a Chinese reader is offered the mirror first. */
  defaultSource: DownloadSourceId;
}) {
  const [source, setSource] = useState<DownloadSourceId>(defaultSource);

  // The user agent is an external value React cannot render on the server, so it
  // is read through a store rather than an effect: the server snapshot is
  // `undefined` ("the guess has not run yet") and the client snapshot replaces
  // it once hydrated. `undefined` is deliberately distinct from `null` ("ran,
  // matched nothing") — the two render different things, and starting at `null`
  // would flash the Linux-visitor layout at everyone for a frame.
  //
  // The subscribe callback is a no-op: nothing about the visitor's platform
  // changes while the page is open.
  const detected = useSyncExternalStore<StudioPlatformId | null | undefined>(
    subscribeToNothing,
    detectPlatform,
    getServerSnapshot,
  );

  const primary =
    detected == null ? null : (release.downloads.find((row) => row.id === detected) ?? null);

  return (
    // No card around any of this: the button carries its own shape, and a frame
    // behind it only draws a second one.
    <div>
      {/*
        One control, two targets: the action on the left and the platform list on
        the right. The hairline between them is the dropdown's own left border,
        so the two halves stay visually a single button.
      */}
      <div className="flex items-stretch">
        {detected === undefined ? (
          <PrimaryAction
            icon={<Loader2 className="animate-spin" />}
            label={copy.detecting}
            disabled
          />
        ) : primary?.url ? (
          <PrimaryAction
            href={withDownloadSource(primary.url, source)}
            icon={<Download />}
            label={copy.downloadFor.replace('{platform}', primary.platform)}
            detail={[primary.detail, primary.size].filter(Boolean).join(' · ')}
          />
        ) : (
          // Either the guess matched nothing, or it matched a platform this
          // release published no asset for. Both end at the releases page.
          <PrimaryAction
            href={STUDIO_RELEASES_PAGE}
            icon={<Download />}
            label={copy.allReleases}
            detail={primary ? copy.unavailable : copy.pickPlatform}
          />
        )}

        <Popover>
          <PopoverTrigger
            aria-label={copy.pickPlatform}
            className="group flex shrink-0 items-center justify-center rounded-r-xl border-l border-white/25 bg-fd-primary px-3.5 text-white transition-colors duration-200 hover:bg-fd-primary/90 data-[state=open]:bg-fd-primary/90"
          >
            <ChevronDown className="size-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </PopoverTrigger>
          <PopoverContent align="end" className="min-w-[19rem] p-1.5">
            <p className="px-2.5 py-1.5 text-xs font-medium tracking-wide text-fd-muted-foreground uppercase">
              {copy.pickPlatform}
            </p>
            {release.downloads.map((row) => (
              <PlatformRow key={row.id} row={row} copy={copy} source={source} />
            ))}
            <div className="my-1.5 border-t border-fd-border" />
            <a
              href={STUDIO_RELEASES_PAGE}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <ExternalLink className="size-4 shrink-0 text-fd-muted-foreground" />
              {copy.allReleases}
            </a>
          </PopoverContent>
        </Popover>
      </div>

      <SourceSelector value={source} onChange={setSource} copy={copy} />
    </div>
  );
}

function PlatformRow({
  row,
  copy,
  source,
}: {
  row: StudioDownload;
  copy: DownloadPanelCopy;
  source: DownloadSourceId;
}) {
  return (
    <a
      href={row.url ? withDownloadSource(row.url, source) : STUDIO_RELEASES_PAGE}
      target={row.url ? undefined : '_blank'}
      rel={row.url ? undefined : 'noreferrer'}
      className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
    >
      <PlatformIcon id={row.id} className="size-4 shrink-0 text-fd-muted-foreground" />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-sm font-medium">{row.platform}</span>
        <span className="truncate text-xs text-fd-muted-foreground">{row.detail}</span>
      </span>
      <span className="ml-auto shrink-0 pl-2 text-xs text-fd-muted-foreground">
        {row.url ? row.size : copy.allReleases}
      </span>
    </a>
  );
}
