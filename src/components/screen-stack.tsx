import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/cn';

/**
 * What a running Studio game has on screen at one moment, drawn as a stack of
 * bands with the top of the screen first.
 *
 * The Studio docs explain pages, Game UI and layers in prose, and prose is a
 * poor way to say "this one is drawn over that one, and this one is not drawn at
 * all right now". A stack of labelled bands says it at a glance, and a sequence
 * of them says how one action changes the screen.
 *
 * The page writes the bands as children, in its own language and in the order
 * they sit on screen:
 *
 * ```mdx
 * <ScreenStack lang="zh">
 *   <ScreenLayer kind="page">记录</ScreenLayer>
 *   <ScreenLayer kind="gameUi" state="faded">对话、快捷菜单</ScreenLayer>
 *   <ScreenLayer kind="stage">背景与角色</ScreenLayer>
 *   <ScreenLayer kind="page" state="hidden">标题</ScreenLayer>
 * </ScreenStack>
 * ```
 *
 * Only the small tags the component adds itself (the kind of each band, its
 * state, the two headings) are translated here. Hidden bands are gathered under
 * their own heading whatever order they are written in, because "not on screen"
 * is not a position in the stack.
 *
 * Rendered on the server as an ordered list, so a screen reader reads the stack
 * in the same order a sighted reader does and the text stays searchable. The
 * colour of a band repeats its kind tag and is never the only signal.
 */

type LayerKind = 'stage' | 'gameUi' | 'page' | 'layer';
type LayerState = 'shown' | 'faded' | 'hidden';

const COPY: Record<
  Locale,
  Record<LayerKind, string> & { faded: string; hidden: string; onScreen: string; offScreen: string }
> = {
  en: {
    stage: 'Stage',
    gameUi: 'Game UI',
    page: 'Page',
    layer: 'Layer',
    faded: 'Faded out',
    hidden: 'Hidden',
    onScreen: 'On screen, top first',
    offScreen: 'Not on screen',
  },
  zh: {
    stage: '游戏画面',
    gameUi: '游戏 UI',
    page: '页面',
    layer: '叠加页面',
    faded: '暂时淡出',
    hidden: '已隐藏',
    onScreen: '屏幕上，自上而下',
    offScreen: '不在屏幕上',
  },
  ja: {
    stage: '舞台',
    gameUi: 'ゲーム UI',
    page: 'ページ',
    layer: 'レイヤー',
    faded: '一時的に非表示',
    hidden: '非表示',
    onScreen: '画面上（上から順に）',
    offScreen: '画面にないもの',
  },
};

/** Bar, tag and band tint per kind. Every pair holds up on both themes. */
const KIND_STYLE: Record<LayerKind, { bar: string; tag: string; band: string }> = {
  stage: {
    bar: 'bg-fd-muted-foreground/50',
    tag: 'bg-fd-muted-foreground/10 text-fd-muted-foreground',
    band: 'bg-fd-muted',
  },
  gameUi: {
    bar: 'bg-amber-500',
    tag: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    band: 'bg-amber-500/5',
  },
  page: {
    bar: 'bg-fd-primary',
    tag: 'bg-fd-primary/10 text-sky-800 dark:text-fd-primary',
    band: 'bg-fd-primary/5',
  },
  layer: {
    bar: 'bg-violet-500',
    tag: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
    band: 'bg-violet-500/5',
  },
};

export interface ScreenLayerProps {
  kind: LayerKind;
  /** `faded`: drawn but stepped off for now. `hidden`: kept, and not drawn at all. */
  state?: LayerState;
  /** A second line under the label, for what the band does rather than what it is. */
  note?: string;
  /** The band's label, in the page's language. */
  children?: ReactNode;
}

/**
 * One band. It renders nothing on its own: `ScreenStack` reads its props, so the
 * stack can sort hidden bands out and put the translated tags beside each one.
 */
export function ScreenLayer(_props: ScreenLayerProps): ReactNode {
  return null;
}

export interface ScreenStackProps {
  lang?: Locale;
  /** Shown under the stack. */
  caption?: string;
  className?: string;
  children?: ReactNode;
}

export function ScreenStack({ lang = 'en', caption, className, children }: ScreenStackProps) {
  const copy = COPY[lang] ?? COPY.en;
  const layers = Children.toArray(children)
    .filter(
      (child): child is ReactElement<ScreenLayerProps> =>
        isValidElement(child) && typeof (child.props as Partial<ScreenLayerProps>).kind === 'string',
    )
    .map((child) => child.props);
  const onScreen = layers.filter((layer) => layer.state !== 'hidden');
  const offScreen = layers.filter((layer) => layer.state === 'hidden');

  return (
    <figure className={cn('not-prose my-6 max-w-md', className)}>
      <div className="flex flex-col gap-3 rounded-lg border border-fd-border bg-fd-card p-3">
        {onScreen.length > 0 ? (
          <Group heading={copy.onScreen} layers={onScreen} copy={copy} />
        ) : null}
        {offScreen.length > 0 ? (
          <Group heading={copy.offScreen} layers={offScreen} copy={copy} />
        ) : null}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm text-fd-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Group({
  heading,
  layers,
  copy,
}: {
  heading: string;
  layers: ScreenLayerProps[];
  copy: (typeof COPY)[Locale];
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <div className="text-xs text-fd-muted-foreground">{heading}</div>
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {layers.map((layer, index) => (
          <Band key={index} layer={layer} copy={copy} />
        ))}
      </ol>
    </section>
  );
}

function Band({ layer, copy }: { layer: ScreenLayerProps; copy: (typeof COPY)[Locale] }) {
  const style = KIND_STYLE[layer.kind];
  const state = layer.state ?? 'shown';
  const dimmed = state !== 'shown';

  return (
    <li
      className={cn(
        'flex items-stretch overflow-hidden rounded-md border text-sm',
        dimmed ? 'border-dashed border-fd-border bg-transparent' : cn('border-fd-border', style.band),
      )}
    >
      <span aria-hidden className={cn('w-1 shrink-0', style.bar, dimmed && 'opacity-40')} />
      {/* The tags drop to their own line when the label would otherwise have to break inside a
          word to make room for them, which a narrow column and a long Japanese label both do. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-2 gap-y-1 px-2.5 py-1.5">
        <div className={cn('min-w-0 flex-[1_1_8rem]', dimmed && 'text-fd-muted-foreground')}>
          <div className="font-medium">{layer.children}</div>
          {layer.note ? (
            <div className="text-xs text-fd-muted-foreground">{layer.note}</div>
          ) : null}
        </div>
        <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-1">
          {dimmed ? (
            <span className="rounded-sm border border-dashed border-fd-border px-1.5 py-0.5 text-xs text-fd-muted-foreground">
              {state === 'faded' ? copy.faded : copy.hidden}
            </span>
          ) : null}
          <span className={cn('rounded-sm px-1.5 py-0.5 text-xs font-medium', style.tag)}>
            {copy[layer.kind]}
          </span>
        </div>
      </div>
    </li>
  );
}
