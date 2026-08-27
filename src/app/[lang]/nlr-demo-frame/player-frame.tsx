'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  const anchorRef = useRef<HTMLSpanElement>(null);
  const overlay = useDialogOverlay();
  const rect = open ? overlay.measure(anchorRef.current) : null;

  useSuspendAdvance(open);

  // The overlay covers the dialog box, and a line sits near the bottom of it, so a popup opened
  // below the word falls off the stage. Placed above the word instead, and kept inside the
  // overlay's own width — both read off the container, which is the box at its authored size.
  const overlayWidth = overlay.container?.clientWidth ?? 0;
  const left = rect ? Math.max(0, Math.min(rect.left, overlayWidth - POPUP_WIDTH)) : 0;

  return (
    <span
      ref={anchorRef}
      className="cursor-pointer underline decoration-cyan-200/80 decoration-dotted underline-offset-4"
      onClick={() => revealed && setOpen((value) => !value)}
    >
      {children}
      {rect && (
        <overlay.Portal>
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
            onClick={() => setOpen(false)}
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
    position: { xalign: 0.66, yalign: 0.52 },
    zoom: 0.56,
  });

  // She keeps breathing while the story goes on: a property she carries, not an action it waits for.
  const breathe = Transform.create()
    .scaleY(1.014)
    .commit({ duration: 2100, ease: 'easeInOut' });

  hall.action([
    narraImage.show({ duration: 600 }),
    narraImage.loop(breathe, { repeatType: 'mirror' }),

    narrator
      .say`${isZh ? '这个播放器就嵌在当前页面里。' : 'This player is mounted inside the current page.'}`
      .say`${isZh ? '它执行的是可以直接放进应用里的故事动作，不是一段录屏。' : 'It runs story actions you can ship in an app, not a recording.'}`,

    narra.say`${isZh ? '外层是 React，流程仍然是视觉小说脚本。' : 'The shell is React, but the flow is still a visual novel script.'}`,

    narra.say(
      isZh
        ? [
            '一行字里可以有',
            c('颜色', '#7dd3fc'),
            '、',
            b('粗体'),
            '、',
            Word.emphasis('着重号', { mark: 'sesame' }),
            '，还有',
            new Word('放大的词', { fontScale: 1.3 }),
            '。',
          ]
        : [
            'A line can carry ',
            c('colour', '#7dd3fc'),
            ', ',
            b('bold'),
            ', ',
            Word.emphasis('emphasis marks', { mark: 'sesame' }),
            ', and ',
            new Word('a larger word', { fontScale: 1.3 }),
            '.',
          ],
    ),

    narra.say(
      isZh
        ? [
            '也可以放一个自己会说话的词，比如',
            Word.custom('场景调用', GlossaryTerm, {
              data: {
                term: '场景调用',
                body: '带 returnable 的跳转把当前场景挂起而不是卸载它。目标场景的动作跑完，故事就回到跳转后面那一行。',
              },
            }),
            '——点它试试。',
          ]
        : [
            'A word can open its own definition, like ',
            Word.custom('scene call', GlossaryTerm, {
              data: {
                term: 'scene call',
                body: 'A returnable jump suspends the current scene instead of unloading it. When the target scene runs out of actions, the story comes back to the line after the jump.',
              },
            }),
            ' — click it.',
          ],
    ),

    Control.whileLoop(() => true, [
      Menu.prompt(isZh ? '想看哪一样？' : 'What would you like to see?')
        .choose(isZh ? '让镜头动起来' : 'Move the camera', [
          narra.say`${isZh ? '整个舞台是一台相机，立绘和背景一起走。' : 'The whole stage is one camera: the sprite and the background move together.'}`,
          story.camera.zoom(1.22, 900, 'easeInOut'),
          story.camera.pan({ xalign: 0.42 }, 900, 'easeInOut'),
          story.camera.vignette(0.68, 500),
          narra.say`${isZh ? '暗角是盖在视野上的一块板，不跟着舞台一起动。' : 'The vignette is a plate over the view, so it holds still while the stage moves under it.'}`,
          story.camera.shutter(1, 170, 'easeInOut'),
          story.camera.shutter(0, 240, 'easeInOut'),
          narra.say`${isZh ? '快门是两片叶子，一合一开就是一次眨眼。' : 'The shutter is two blades: closed and opened again is a blink.'}`,
          story.camera.resetCamera(700),
        ])
        .choose(isZh ? '换个场景' : 'Change the scene', [
          narra.say`${isZh ? '转场铺满整个舞台，立绘和文字都参与其中。' : 'A transition plays across the whole stage, so sprites and text take part rather than only the background.'}`,
          hall.jumpTo(room, {
            transition: new Reveal({ duration: 900, pattern: Mask.iris() }),
            returnable: true,
          }),
          narra.say`${isZh ? '回来了。这个场景一直站在这里，没有被重建。' : 'And back. This scene stood here the whole time; nothing was rebuilt.'}`,
        ])
        .choose(isZh ? '去隔壁待一会儿' : 'Step next door', [
          hall.jumpTo(aside, { transition: new Dissolve({ duration: 600 }), returnable: true }),
          narra.say`${isZh ? '这就是刚才那个词说的事。' : 'That is the thing the word explained.'}`,
        ]),
    ]),
  ]);

  room.action([
    narrator.say`${isZh ? '新的场景，同一个 Player。' : 'A new scene, the same Player.'}`,
    narrator.say`${isZh ? '走廊没有被卸载——它被挂起了，还在后面站着。' : 'The hall was not unloaded. It is suspended, still standing behind this.'}`,
  ]);

  aside.action([
    narrator.say`${isZh ? '这里的动作跑完，故事自己就回去了。' : 'When the actions here run out, the story returns on its own.'}`,
    narrator.say`${isZh ? '没有一句话是写来跳回去的。' : 'Nothing here jumps back — there is no return statement to write.'}`,
  ]);

  story.entry(hall);
  return story;
}

function DemoDialog() {
  const { done } = useDialog();

  return (
    <Dialog className="relative mx-auto mb-4 h-[84%] w-[88%] rounded-lg border border-cyan-200/70 bg-black/58 p-5 shadow-2xl backdrop-blur-md">
      <div className="absolute left-6 -top-6">
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
