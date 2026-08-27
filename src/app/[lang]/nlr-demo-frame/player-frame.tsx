'use client';

import { type MouseEvent, useEffect, useMemo, useState } from 'react';
import {
  b,
  c,
  Character,
  Control,
  Dialog,
  Dissolve,
  GameMenu,
  Game,
  GameProviders,
  Image as NarraImage,
  Item,
  Mask,
  Menu,
  Nametag,
  Player,
  type PlayerEventContext,
  Reveal,
  Scene,
  Story,
  Texts,
  Transform,
  useDialog,
  useDialogOverlay,
  useSuspendAdvance,
  Word,
  type WordRenderProps,
} from 'narraleaf-react';
import demoClassImage from '@/assets/demo/demo-class.webp';
import demoHallImage from '@/assets/demo/demo-hall.webp';
import demoNarraImage from '@/assets/demo/demo-narra.webp';
import demoRoomImage from '@/assets/demo/demo-room.webp';
import { type Locale } from '@/lib/i18n';

type GlossaryData = { term: string; body: string };

/** Authored units, like everything else the overlay is measured in. */
const POPUP_WIDTH = 420;
/** The stage the game is configured for, and the units every position in this file is written in. */
const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 720;

/**
 * A word in a line that opens its own definition.
 *
 * Three pieces do the work. `Word.custom` attaches this component to the word; `useDialogOverlay`
 * gives the popup somewhere to be drawn that the text box does not clip and the stage still scales;
 * and `useSuspendAdvance` holds the line while the popup is open, because otherwise the click that
 * dismisses it advances the line behind it.
 */
function GlossaryTerm({ children, revealed, data }: WordRenderProps<GlossaryData>) {
  const [open, setOpen] = useState(false);
  // The anchor is held in state rather than a ref: the popup is positioned from its box, and
  // that measurement happens while rendering.
  const [anchor, setAnchor] = useState<HTMLSpanElement | null>(null);
  const overlay = useDialogOverlay();
  const rect = open ? overlay.measure(anchor) : null;

  useSuspendAdvance(open);

  // The overlay covers the dialog box, and a line sits near the bottom of it, so a popup opened
  // below the word falls off the stage. Placed above the word instead, and kept inside the
  // overlay's own width — both read off the container, which is the box at its authored size.
  const overlayWidth = overlay.container?.clientWidth ?? 0;
  const left = rect ? Math.max(0, Math.min(rect.left, overlayWidth - POPUP_WIDTH)) : 0;

  // The portal renders outside the word in the DOM but inside it in the React tree, so a click on
  // the popup still reaches the word's own handler and toggles the popup straight back open.
  // Closing has to stop the click where it lands.
  const close = (event: MouseEvent) => {
    event.stopPropagation();
    setOpen(false);
  };

  return (
    <span
      ref={setAnchor}
      className="cursor-pointer underline decoration-cyan-200/80 decoration-dotted underline-offset-4"
      onClick={() => revealed && setOpen((value) => !value)}
    >
      {children}
      {rect && (
        <overlay.Portal>
          {/* Advancing is suspended while the popup is open, so a click that lands anywhere else
              has to close it, or the demo stops responding for anyone who clicks past the popup
              instead of on it. The portal is a zero-size box at the overlay's origin, and the
              overlay covers only the dialog, so the sheet is given the stage's own dimensions in
              every direction to reach the artwork above the text box as well. */}
          <div
            style={{
              position: 'absolute',
              left: -STAGE_WIDTH,
              top: -STAGE_HEIGHT,
              width: STAGE_WIDTH * 3,
              height: STAGE_HEIGHT * 3,
              pointerEvents: 'auto',
            }}
            onClick={close}
          />
          <div
            style={{
              position: 'absolute',
              left,
              top: rect.top - 12,
              transform: 'translateY(-100%)',
              width: POPUP_WIDTH,
              pointerEvents: 'auto',
            }}
            className="rounded-lg border border-cyan-200/70 bg-black/85 p-4 text-[22px] leading-snug text-cyan-50 shadow-2xl backdrop-blur-sm"
            onClick={close}
          >
            <div className="mb-1 text-[18px] font-semibold uppercase tracking-wide text-cyan-200/90">
              {data.term}
            </div>
            {data.body}
          </div>
        </overlay.Portal>
      )}
    </span>
  );
}

/** The sprite's own pixel height. An image keeps its natural size in stage units, so this is the
 *  height it is drawn at before `zoom`. */
const NARRA_HEIGHT = 1100;
const NARRA_ZOOM = 0.62;
/** `yalign` places the centre of the sprite, measured up from the floor of the stage. Half the
 *  drawn height therefore puts the cut edge of the half body on the floor itself. */
const NARRA_YALIGN = (NARRA_HEIGHT * NARRA_ZOOM) / 2 / STAGE_HEIGHT;

function createDemoStory(locale: Locale) {
  const isZh = locale === 'zh';
  const story = new Story(isZh ? '嵌入式 NarraLeaf-React 示例' : 'Embedded NarraLeaf-React demo');

  const hall = new Scene('hall', { background: demoHallImage.src });
  const room = new Scene('room', { background: demoRoomImage.src });
  const aside = new Scene('aside', { background: demoClassImage.src });

  const narrator = new Character(isZh ? '旁白' : 'Narrator');
  const narra = new Character('Narra');
  const narraImage = new NarraImage<any>({
    src: demoNarraImage.src,
    position: { xalign: 0.68, yalign: NARRA_YALIGN },
    zoom: NARRA_ZOOM,
  });

  // A property the sprite carries for the rest of the scene, rather than an action the story waits
  // on: the loop runs while the lines below play.
  const breathe = Transform.create()
    .scaleY(1.012)
    .commit({ duration: 2400, ease: 'easeInOut' });

  hall.action([
    narraImage.show({ duration: 600 }),
    narraImage.loop(breathe, { repeatType: 'mirror' }),

    narrator
      .say`${isZh ? '这个播放器在当前页面内运行 NarraLeaf-React。' : 'This player runs NarraLeaf-React inside the current page.'}`
      .say`${isZh ? '下面的每一行都是故事动作，与发布版本执行的是同一份脚本。' : 'Every line below is a story action, and a released build runs the same script.'}`,

    narra.say`${isZh ? '文本框、名牌和选项菜单由工程提供的 React 组件渲染。' : 'The text box, the name tag and the option menu are React components the project supplies.'}`,

    narra.say(
      isZh
        ? [
            '一行文本可以同时包含',
            c('颜色', '#7dd3fc'),
            '、',
            b('粗体'),
            '、',
            Word.emphasis('着重号', { mark: 'sesame' }),
            '和',
            new Word('缩放的词', { fontScale: 1.3 }),
            '。',
          ]
        : [
            'A single line carries ',
            c('colour', '#7dd3fc'),
            ', ',
            b('bold'),
            ', ',
            Word.emphasis('emphasis marks', { mark: 'sesame' }),
            ' and ',
            new Word('a scaled word', { fontScale: 1.3 }),
            '.',
          ],
    ),

    narra.say(
      isZh
        ? [
            '任意一个词都可以交给组件渲染。点击',
            Word.custom('场景调用', GlossaryTerm, {
              data: {
                term: '场景调用',
                body: '以 returnable 跳转到另一个场景时，当前场景保持挂起。目标场景的动作执行完毕后，故事回到跳转之后的一行。',
              },
            }),
            '查看它的定义。',
          ]
        : [
            'Any word can be rendered by a component. Click ',
            Word.custom('scene call', GlossaryTerm, {
              data: {
                term: 'Scene call',
                body: 'A jump made with returnable leaves the current scene suspended. When the target scene runs out of actions, the story resumes at the line after the jump.',
              },
            }),
            ' to read its definition.',
          ],
    ),

    Control.whileLoop(() => true, [
      Menu.prompt(isZh ? '选择一项演示。' : 'Select a demonstration.')
        .choose(isZh ? '镜头运动' : 'Camera movement', [
          narra.say`${isZh ? '缩放、平移、暗角与快门都是相机属性，作用于整个舞台。' : 'Zoom, pan, vignette and shutter are camera properties applied to the whole stage.'}`,
          story.camera.zoom(1.22, 900, 'easeInOut'),
          story.camera.pan({ xalign: 0.42 }, 900, 'easeInOut'),
          story.camera.vignette(0.68, 500),
          narra.say`${isZh ? '暗角固定在视野上，舞台在它下面移动。' : 'The vignette is fixed to the view, and the stage moves beneath it.'}`,
          story.camera.shutter(1, 170, 'easeInOut'),
          story.camera.shutter(0, 240, 'easeInOut'),
          narra.say`${isZh ? '相机随后回到默认取景。' : 'The camera then returns to its default framing.'}`,
          story.camera.resetCamera(700),
        ])
        .choose(isZh ? '场景转场' : 'Scene transition', [
          narra.say`${isZh ? '转场作用于整个舞台，立绘、背景与文本框都参与其中。' : 'A transition plays across the whole stage, and the sprite, the background and the text box all take part.'}`,
          hall.jumpTo(room, {
            transition: new Reveal({ duration: 900, pattern: Mask.iris() }),
            returnable: true,
          }),
          narra.say`${isZh ? '另一个场景播放期间，走廊保持原有状态。' : 'The corridor kept its state for as long as the other scene played.'}`,
        ])
        .choose(isZh ? '场景调用' : 'Scene call', [
          narra.say`${isZh ? '以 returnable 跳转会挂起当前场景，目标场景结束后继续执行。' : 'A jump made with returnable suspends this scene, and execution continues once the target scene ends.'}`,
          hall.jumpTo(aside, { transition: new Dissolve({ duration: 600 }), returnable: true }),
          narra.say`${isZh ? '执行从跳转之后的一行继续。' : 'Execution resumed at the line after the jump.'}`,
        ]),
    ]),
  ]);

  room.action([
    narrator.say`${isZh ? '同一个播放器中的另一个场景。' : 'A different scene, running in the same player.'}`,
    narrator.say`${isZh ? '走廊处于挂起状态，本场景结束后故事回到那里。' : 'The corridor is suspended, and the story returns to it when this scene ends.'}`,
  ]);

  aside.action([
    narrator.say`${isZh ? '这个场景本身不包含任何跳转。' : 'This scene contains no jump of its own.'}`,
    narrator.say`${isZh ? '它的动作执行完毕，故事随即返回。' : 'The story returns as soon as its actions finish.'}`,
  ]);

  story.entry(hall);
  return story;
}

function DemoDialog() {
  const { done, isNarrator } = useDialog();

  return (
    <Dialog className="relative mx-auto mb-4 h-[84%] w-[88%] rounded-lg border border-cyan-200/70 bg-black/58 p-5 shadow-2xl backdrop-blur-md">
      {/* A menu prompt has no speaker, and an empty name tag is an empty box floating over the
          artwork. */}
      <div className={['absolute left-6 -top-6', isNarrator ? 'hidden' : ''].join(' ')}>
        <Nametag
          color="#e6fbff"
          className="flex min-h-[44px] min-w-[150px] items-center justify-center rounded-lg border border-cyan-200/70 bg-black/62 px-4 py-2 text-[22px] font-semibold text-cyan-50 shadow-lg backdrop-blur-sm"
        />
      </div>
      <div className="flex h-full items-center gap-3 pt-1 text-[30px] leading-[1.45] text-white">
        {/* autoFit sets a long line down until it fits rather than letting it overflow the box. */}
        <Texts className="max-w-full" defaultColor="white" autoFit autoFitMinFontSize={18} />
        <div className="flex shrink-0 flex-col items-center">
          <div
            className={[
              'demo-line-cue-arrow h-0 w-0 border-x-[7px] border-t-[11px] border-x-transparent border-t-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-opacity',
              done ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          />
          <div className="mt-1 h-0.5 w-4 bg-white/85" />
        </div>
      </div>
    </Dialog>
  );
}

function DemoMenu(props: { items: number[] }) {
  const { items } = props;

  return (
    <GameMenu className="absolute flex h-full w-full min-w-full flex-col items-center justify-center">
      {items.map((index) => (
        <Item
          key={index}
          className="mt-2 w-[58%] rounded-lg border border-cyan-200/70 bg-black/58 p-2 text-[26px] text-white shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-black/75 active:bg-black/90"
        />
      ))}
    </GameMenu>
  );
}

function DemoPlayer(props: { locale: Locale }) {
  const { locale } = props;
  const story = useMemo(() => createDemoStory(locale), [locale]);

  function handleReady({ liveGame }: PlayerEventContext) {
    liveGame.newGame();
  }

  return <Player story={story} width="100%" height="100%" onReady={handleReady} />;
}

export function NarraLeafReactPlayer(props: { locale: Locale }) {
  const { locale } = props;
  const [game] = useState(() => {
    const configuredGame = new Game({
      width: 1280,
      height: 720,
      aspectRatio: 16 / 9,
      ratioUpdateInterval: 0,
      dialog: DemoDialog,
      menu: DemoMenu,
      minWidth: 320,
      minHeight: 180,
    });

    configuredGame.preference.setPreference('cps', 72);

    return configuredGame;
  });

  return (
    <GameProviders game={game}>
      <DemoPlayer locale={locale} />
    </GameProviders>
  );
}

export function NarraLeafReactPlayerFrame(props: { locale: Locale }) {
  const { locale } = props;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlStyle = html.getAttribute('style');
    const previousBodyStyle = body.getAttribute('style');

    html.style.margin = '0';
    html.style.padding = '0';
    html.style.width = '100%';
    html.style.height = '100%';
    html.style.minWidth = '100%';
    html.style.minHeight = '100%';
    html.style.overflow = 'hidden';
    html.style.background = '#08151b';
    html.style.setProperty('scrollbar-gutter', 'auto');
    body.style.margin = '0';
    body.style.padding = '0';
    body.style.display = 'block';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.minWidth = '100%';
    body.style.minHeight = '100%';
    body.style.overflow = 'hidden';
    body.style.background = '#08151b';

    return () => {
      if (previousHtmlStyle === null) {
        html.removeAttribute('style');
      } else {
        html.setAttribute('style', previousHtmlStyle);
      }

      if (previousBodyStyle === null) {
        body.removeAttribute('style');
      } else {
        body.setAttribute('style', previousBodyStyle);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        html:has(body [data-nlr-demo-frame-root]) {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          min-width: 100% !important;
          min-height: 100% !important;
          overflow: hidden !important;
          scrollbar-gutter: auto !important;
          background: #08151b !important;
        }

        body:has([data-nlr-demo-frame-root]) {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          width: 100vw !important;
          height: 100vh !important;
          min-width: 100vw !important;
          min-height: 100vh !important;
          overflow: hidden !important;
          background: #08151b !important;
        }
      `}</style>
      <main
        data-nlr-demo-frame-root
        className="fixed inset-0 m-0 block h-[100vh] w-[100vw] overflow-hidden bg-[#08151b]"
      >
        <NarraLeafReactPlayer locale={locale} />
      </main>
    </>
  );
}
