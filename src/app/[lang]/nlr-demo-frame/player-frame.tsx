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
  Pause,
  Player,
  type PlayerEventContext,
  Push,
  Reveal,
  Scene,
  Story,
  Texts,
  ThroughColor,
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
import demoWashImage from '@/assets/demo/demo-wash.webp';
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

/**
 * Where the tour returns to. Label names are scene-local, and every jump target is resolved when
 * the story is built, so a name that matches no label fails the build rather than the play head.
 */
const TOPICS = 'topics';
const TOPIC_TEXT = 'topic-text';
const TOPIC_SPRITE = 'topic-sprite';
const TOPIC_BACKGROUND = 'topic-background';
const TOPIC_CAMERA = 'topic-camera';
const TOPIC_FLOW = 'topic-flow';
/**
 * The menu of each topic, entered from the topic's own opening line. A demonstration returns here
 * rather than to the topic label, so the opening line plays once per visit and not once per
 * demonstration.
 */
const TEXT_MENU = 'text-menu';
const SPRITE_MENU = 'sprite-menu';
const BACKGROUND_MENU = 'background-menu';
const CAMERA_MENU = 'camera-menu';
const FLOW_MENU = 'flow-menu';

/** The sprite's own pixel height. An image keeps its natural size in stage units, so this is the
 *  height it is drawn at before `zoom`. */
const NARRA_HEIGHT = 1100;
const NARRA_ZOOM = 0.62;
/** `yalign` places the centre of the sprite, measured up from the floor of the stage. Half the
 *  drawn height therefore puts the cut edge of the half body on the floor itself. */
const NARRA_YALIGN = (NARRA_HEIGHT * NARRA_ZOOM) / 2 / STAGE_HEIGHT;
/** Where the sprite stands when no demonstration has moved it. */
const NARRA_HOME = { xalign: 0.68, yalign: NARRA_YALIGN };

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
    position: NARRA_HOME,
    zoom: NARRA_ZOOM,
  });

  // A property the sprite carries for the rest of the scene, rather than an action the story waits
  // on: the loop runs while the lines below play.
  const breathe = Transform.create()
    .scaleY(1.012)
    .commit({ duration: 2400, ease: 'easeInOut' });

  // Returns the sprite to where the rest of the tour expects to find it, so a demonstration that
  // moves it does not leave the next one starting from somewhere else.
  const restSprite = () => [
    narraImage.clearFilter({ duration: 400 }),
    narraImage.transform(
      Transform.create()
        .position(NARRA_HOME)
        .zoom(NARRA_ZOOM)
        .rotation(0)
        .opacity(1)
        .commit({ duration: 500, ease: 'easeInOut' }),
    ),
  ];

  hall.action([
    narraImage.show({ duration: 600 }),
    narraImage.loop(breathe, { repeatType: 'mirror' }),

    narrator
      .say`${isZh ? '这个播放器在当前页面内运行 NarraLeaf-React。' : 'This player runs NarraLeaf-React inside the current page.'}`
      .say`${isZh ? '下面的每一行都是故事动作，与发布版本执行的是同一份脚本。' : 'Every line below is a story action, and a released build runs the same script.'}`,

    narra.say`${isZh ? '文本框、名牌和选项菜单由工程提供的 React 组件渲染。' : 'The text box, the name tag and the option menu are React components the project supplies.'}`,

    Control.label(TOPICS),
    narra.say`${isZh ? '下面五个方向，每一个是一组演示。' : 'Five topics below, each one a group of demonstrations.'}`,

    Menu.prompt(isZh ? '选择一个方向。' : 'Choose a topic.')
      .choose(isZh ? '文本框' : 'The text box', [Control.jump(TOPIC_TEXT)])
      .choose(isZh ? '立绘' : 'The character sprite', [Control.jump(TOPIC_SPRITE)])
      .choose(isZh ? '背景与转场' : 'Backgrounds and transitions', [Control.jump(TOPIC_BACKGROUND)])
      .choose(isZh ? '相机' : 'The camera', [Control.jump(TOPIC_CAMERA)])
      .choose(isZh ? '场景流程' : 'Scene flow', [Control.jump(TOPIC_FLOW)]),

    Control.label(TOPIC_TEXT),
    narra.say`${isZh ? '文本框是一个 React 组件，下面是一行文本能承载的东西。' : 'The text box is a React component, and each demonstration below is something a line can carry.'}`,

    Control.label(TEXT_MENU),

    Menu.prompt(isZh ? '文本框。' : 'The text box.')
      .choose(isZh ? '行内样式' : 'Inline styles', [
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
        narra.say`${isZh ? '样式写在词上而不是文本框上，同一个文本框显示其中任何一种。' : 'The styles belong to the words rather than to the box, and one box displays any of them.'}`,
        Control.jump(TEXT_MENU),
      ])
      .choose(isZh ? '停顿' : 'Pacing', [
        narra.say(
          isZh
            ? ['一行可以在中途停下来', Pause.wait(700), '，再继续。']
            : ['A line can stop part of the way through', Pause.wait(700), ', then carry on.'],
        ),
        narra.say(
          isZh
            ? ['也可以停下来等一次点击', Pause, '，然后说完。']
            : ['It can also wait for a click', Pause, ', and finish afterwards.'],
        ),
        Control.jump(TEXT_MENU),
      ])
      .choose(isZh ? '词条组件' : 'A word as a component', [
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
        Control.jump(TEXT_MENU),
      ])
      .choose(isZh ? '返回上一级' : 'Back to the topics', [Control.jump(TOPICS)]),

    Control.label(TOPIC_SPRITE),
    narra.say`${isZh ? '立绘是一个元素，下面每一项都在改它的一个属性。' : 'The sprite is one element, and each demonstration below changes a property of it.'}`,

    Control.label(SPRITE_MENU),

    Menu.prompt(isZh ? '立绘。' : 'The character sprite.')
      .choose(isZh ? '位置与缩放' : 'Position and scale', [
        narra.say`${isZh ? '位置、缩放和旋转都是可以过渡的属性。' : 'Position, scale and rotation are properties a transform can animate.'}`,
        narraImage.pos({ xalign: 0.3, yalign: NARRA_YALIGN }, 800, 'easeInOut'),
        narraImage.zoom(NARRA_ZOOM * 1.15, 600, 'easeInOut'),
        narraImage.rotate(-4, 400, 'easeInOut'),
        narra.say`${isZh ? '一条动作只描述要到达的状态，中间的每一帧由引擎补出来。' : 'An action names the state to reach, and the engine fills in the frames between.'}`,
        ...restSprite(),
        Control.jump(SPRITE_MENU),
      ])
      .choose(isZh ? '进场与退场' : 'Entering and leaving', [
        narra.say`${isZh ? '圆形收放和方向擦除都是内置的，各自带自己的参数。' : 'The circular close, the circular reveal and the directional wipe are built in, each with its own options.'}`,
        narraImage.circleClose({ duration: 700 }),
        narraImage.circleReveal({ duration: 700 }),
        narraImage.wipe({ direction: 'right', duration: 700 }),
        narra.say`${isZh ? '它们改的是立绘自己的裁剪，背景一直在。' : 'They clip the sprite alone, and the background stays where it is throughout.'}`,
        Control.jump(SPRITE_MENU),
      ])
      .choose(isZh ? '滤镜' : 'Filters', [
        narraImage.filter('grayscale(1)', { duration: 600 }),
        narra.say`${isZh ? '滤镜作用于单个立绘，背景不受影响。' : 'A filter applies to one sprite, and leaves the background alone.'}`,
        narraImage.filter('sepia(0.7) brightness(0.85)', { duration: 600 }),
        narra.say`${isZh ? '换一组参数就是另一种调子。' : 'Another set of values is another grade.'}`,
        narraImage.clearFilter({ duration: 600 }),
        Control.jump(SPRITE_MENU),
      ])
      .choose(isZh ? '持续动作' : 'A looping transform', [
        narra.say`${isZh ? '立绘一直在做一个循环的呼吸，故事从不等它。' : 'The sprite has been running a looping breath the whole time, and the story never waits for it.'}`,
        narraImage.stopLoop(),
        narra.say`${isZh ? '现在停了。' : 'It is stopped now.'}`,
        narraImage.loop(breathe, { repeatType: 'mirror' }),
        narra.say`${isZh ? '又开始了。' : 'And running again.'}`,
        Control.jump(SPRITE_MENU),
      ])
      .choose(isZh ? '返回上一级' : 'Back to the topics', [Control.jump(TOPICS)]),

    // The background is changed through the scene's own background image rather than through
    // Scene.setBackground. In engine 0.39.2 setBackground hands back a chain instead of an action,
    // and a menu branch links its statements by hand, so a branch that carries one and then keeps
    // going ends up with an unlinked statement in the middle of it.
    Control.label(TOPIC_BACKGROUND),
    narra.say`${isZh ? '背景属于场景，转场决定它怎么被替换。' : 'The background belongs to the scene, and a transition decides how it is replaced.'}`,

    Control.label(BACKGROUND_MENU),

    Menu.prompt(isZh ? '背景与转场。' : 'Backgrounds and transitions.')
      .choose(isZh ? '溶解' : 'Dissolve', [
        hall.background.char(demoWashImage.src, new Dissolve({ duration: 800 })),
        narra.say`${isZh ? '换背景不换场景，立绘留在原处。' : 'The background changes without the scene changing, and the sprite stays where it is.'}`,
        hall.background.char(demoHallImage.src, new Dissolve({ duration: 800 })),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(isZh ? '遮罩' : 'A masked reveal', [
        hall.background.char(
          demoWashImage.src,
          new Reveal({ duration: 900, pattern: Mask.blinds({ slats: 10 }) }),
        ),
        narra.say`${isZh ? '百叶、光圈、时钟、扇形和圆点都是内置的遮罩形状。' : 'Blinds, iris, clock, fan and dots are all built-in mask shapes.'}`,
        hall.background.char(demoHallImage.src, new Reveal({ duration: 900, pattern: Mask.clock() })),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(isZh ? '透色' : 'Through a colour', [
        hall.background.char(
          demoWashImage.src,
          new ThroughColor({ duration: 1400, color: '#0b1a22', holdMs: 400 }),
        ),
        narra.say`${isZh ? '画面先盖上一层颜色，停一会儿，再从颜色里出来。' : 'The frame is covered by a colour, held there, and uncovered again.'}`,
        hall.background.char(
          demoHallImage.src,
          new ThroughColor({ duration: 1400, color: '#0b1a22', holdMs: 400 }),
        ),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(isZh ? '推移' : 'Push', [
        hall.background.char(demoWashImage.src, new Push({ duration: 800, direction: 'left' })),
        narra.say`${isZh ? '两张背景一进一出，像镜头横摇过去。' : 'One background slides out as the other slides in, as if the camera panned across.'}`,
        hall.background.char(demoHallImage.src, new Push({ duration: 800, direction: 'right' })),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(isZh ? '返回上一级' : 'Back to the topics', [Control.jump(TOPICS)]),

    Control.label(TOPIC_CAMERA),
    narra.say`${isZh ? '相机在场景之上，作用于其中绘制的一切。' : 'The camera sits above the scene and applies to everything drawn in it.'}`,

    Control.label(CAMERA_MENU),

    Menu.prompt(isZh ? '相机。' : 'The camera.')
      .choose(isZh ? '缩放与平移' : 'Zoom and pan', [
        narra.say`${isZh ? '相机作用于整个舞台，立绘与背景一起移动。' : 'The camera acts on the whole stage, so the sprite and the background move together.'}`,
        story.camera.zoom(1.22, 900, 'easeInOut'),
        story.camera.pan({ xalign: 0.42 }, 900, 'easeInOut'),
        story.camera.resetCamera(700),
        Control.jump(CAMERA_MENU),
      ])
      .choose(isZh ? '暗角与快门' : 'Vignette and shutter', [
        story.camera.vignette(0.68, 500),
        narra.say`${isZh ? '暗角固定在视野上，舞台在它下面移动。' : 'The vignette is fixed to the view, and the stage moves beneath it.'}`,
        story.camera.shutter(1, 170, 'easeInOut'),
        story.camera.shutter(0, 240, 'easeInOut'),
        narra.say`${isZh ? '快门合上再打开，是一次眨眼的长度。' : 'The shutter closes and opens again in the length of a blink.'}`,
        story.camera.resetCamera(700),
        Control.jump(CAMERA_MENU),
      ])
      .choose(isZh ? '调色' : 'Colour grading', [
        story.camera.filter('saturate(0.35) brightness(0.8)', { duration: 700 }),
        narra.say`${isZh ? '滤镜也可以挂在相机上，这时它作用于全部画面。' : 'A filter can sit on the camera instead, where it applies to everything on screen.'}`,
        story.camera.resetCamera(700),
        Control.jump(CAMERA_MENU),
      ])
      .choose(isZh ? '返回上一级' : 'Back to the topics', [Control.jump(TOPICS)]),

    Control.label(TOPIC_FLOW),
    narra.say`${isZh ? '场景流程是故事在场景之间和场景内部的移动方式。' : 'Scene flow is how the story moves between scenes, and inside one.'}`,

    Control.label(FLOW_MENU),

    Menu.prompt(isZh ? '场景流程。' : 'Scene flow.')
      .choose(isZh ? '场景转场' : 'A transition between scenes', [
        narra.say`${isZh ? '转场作用于整个舞台，立绘、背景与文本框都参与其中。' : 'A transition plays across the whole stage, and the sprite, the background and the text box all take part.'}`,
        hall.jumpTo(room, {
          transition: new Reveal({ duration: 900, pattern: Mask.iris() }),
          returnable: true,
        }),
        narra.say`${isZh ? '另一个场景播放期间，走廊保持原有状态。' : 'The corridor kept its state for as long as the other scene played.'}`,
        Control.jump(FLOW_MENU),
      ])
      .choose(isZh ? '场景调用' : 'A scene call', [
        narra.say`${isZh ? '以 returnable 跳转会挂起当前场景，目标场景结束后继续执行。' : 'A jump made with returnable suspends this scene, and execution continues once the target scene ends.'}`,
        hall.jumpTo(aside, { transition: new Dissolve({ duration: 600 }), returnable: true }),
        narra.say`${isZh ? '执行从跳转之后的一行继续。' : 'Execution resumed at the line after the jump.'}`,
        Control.jump(FLOW_MENU),
      ])
      .choose(isZh ? '标签跳转' : 'Jumping to a label', [
        narra.say`${isZh ? '这份演示的每一次返回都是一个标签跳转。' : 'Every return in this tour is a jump to a label.'}`,
        narra.say`${isZh ? '标签在场景内命名，目标在构建故事时解析，名字写错过不了构建。' : 'Labels are named inside a scene and resolved when the story is built, so a name that is wrong fails the build.'}`,
        Control.jump(FLOW_MENU),
      ])
      .choose(isZh ? '返回上一级' : 'Back to the topics', [Control.jump(TOPICS)]),
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
