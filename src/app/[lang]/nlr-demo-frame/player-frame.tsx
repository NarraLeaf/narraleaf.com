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
  const t = <T,>(copy: Record<Locale, T>) => copy[locale];
  const story = new Story(
    t({ en: 'Embedded NarraLeaf-React demo', zh: '嵌入式 NarraLeaf-React 示例', ja: 'NarraLeaf-React 埋め込みデモ' }),
  );

  const hall = new Scene('hall', { background: demoHallImage.src });
  const room = new Scene('room', { background: demoRoomImage.src });
  const aside = new Scene('aside', { background: demoClassImage.src });

  const narrator = new Character(t({ en: 'Narrator', zh: '旁白', ja: 'ナレーター' }));
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
      .say`${t({ en: 'This player runs NarraLeaf-React inside the current page.', zh: '这个播放器在当前页面内运行 NarraLeaf-React。', ja: 'このプレイヤーは、このページの中で NarraLeaf-React を動かしている。' })}`
      .say`${t({ en: 'Every line below is a story action, and a released build runs the same script.', zh: '下面的每一行都是故事动作，与发布版本执行的是同一份脚本。', ja: '以下の一行一行がストーリーアクションで、公開版もこのスクリプトをそのまま実行する。' })}`,

    narra.say`${t({ en: 'The text box, the name tag and the option menu are React components the project supplies.', zh: '文本框、名牌和选项菜单由工程提供的 React 组件渲染。', ja: 'テキストボックス、名前タグ、選択肢メニューは、プロジェクトが用意した React コンポーネントだよ。' })}`,

    Control.label(TOPICS),
    narra.say`${t({ en: 'Five topics below, each one a group of demonstrations.', zh: '下面五个方向，每一个是一组演示。', ja: '下にある五つのテーマ、それぞれがひとまとまりのデモになっているよ。' })}`,

    Menu.prompt(t({ en: 'Choose a topic.', zh: '选择一个方向。', ja: 'テーマを選んでね。' }))
      .choose(t({ en: 'The text box', zh: '文本框', ja: 'テキストボックス' }), [Control.jump(TOPIC_TEXT)])
      .choose(t({ en: 'The character sprite', zh: '立绘', ja: '立ち絵' }), [Control.jump(TOPIC_SPRITE)])
      .choose(t({ en: 'Backgrounds and transitions', zh: '背景与转场', ja: '背景とトランジション' }), [Control.jump(TOPIC_BACKGROUND)])
      .choose(t({ en: 'The camera', zh: '相机', ja: 'カメラ' }), [Control.jump(TOPIC_CAMERA)])
      .choose(t({ en: 'Scene flow', zh: '场景流程', ja: 'シーンの流れ' }), [Control.jump(TOPIC_FLOW)]),

    Control.label(TOPIC_TEXT),
    narra.say`${t({ en: 'The text box is a React component, and each demonstration below is something a line can carry.', zh: '文本框是一个 React 组件，下面是一行文本能承载的东西。', ja: 'テキストボックスは一つの React コンポーネントで、下のデモは一行のテキストに載せられるものだよ。' })}`,

    Control.label(TEXT_MENU),

    Menu.prompt(t({ en: 'The text box.', zh: '文本框。', ja: 'テキストボックス。' }))
      .choose(t({ en: 'Inline styles', zh: '行内样式', ja: 'インライン装飾' }), [
        narra.say(
          t({
            en: [
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
            zh: [
              '一行文本可以同时包含',
              c('颜色', '#7dd3fc'),
              '、',
              b('粗体'),
              '、',
              Word.emphasis('着重号', { mark: 'sesame' }),
              '和',
              new Word('缩放的词', { fontScale: 1.3 }),
              '。',
            ],
            ja: [
              '一行の中に',
              c('色', '#7dd3fc'),
              'や',
              b('太字'),
              '、',
              Word.emphasis('傍点', { mark: 'sesame' }),
              '、',
              new Word('拡大した文字', { fontScale: 1.3 }),
              'を一度に入れられる。',
            ],
          }),
        ),
        narra.say`${t({ en: 'The styles belong to the words rather than to the box, and one box displays any of them.', zh: '样式写在词上而不是文本框上，同一个文本框显示其中任何一种。', ja: 'この装飾は文字自体に付くもので、ボックス側の設定じゃない。同じボックスがどれも表示するよ。' })}`,
        Control.jump(TEXT_MENU),
      ])
      .choose(t({ en: 'Pacing', zh: '停顿', ja: '間' }), [
        narra.say(
          t({
            en: ['A line can stop part of the way through', Pause.wait(700), ', then carry on.'],
            zh: ['一行可以在中途停下来', Pause.wait(700), '，再继续。'],
            ja: ['一行はセリフの途中で止まって', Pause.wait(700), '、それから続けられる。'],
          }),
        ),
        narra.say(
          t({
            en: ['It can also wait for a click', Pause, ', and finish afterwards.'],
            zh: ['也可以停下来等一次点击', Pause, '，然后说完。'],
            ja: ['クリックを待ってから', Pause, '、続きを言うこともできる。'],
          }),
        ),
        Control.jump(TEXT_MENU),
      ])
      .choose(t({ en: 'A word as a component', zh: '词条组件', ja: '用語コンポーネント' }), [
        narra.say(
          t({
            en: [
              'Any word can be rendered by a component. Click ',
              Word.custom('scene call', GlossaryTerm, {
                data: {
                  term: 'Scene call',
                  body: 'A jump made with returnable leaves the current scene suspended. When the target scene runs out of actions, the story resumes at the line after the jump.',
                },
              }),
              ' to read its definition.',
            ],
            zh: [
              '任意一个词都可以交给组件渲染。点击',
              Word.custom('场景调用', GlossaryTerm, {
                data: {
                  term: '场景调用',
                  body: '以 returnable 跳转到另一个场景时，当前场景保持挂起。目标场景的动作执行完毕后，故事回到跳转之后的一行。',
                },
              }),
              '查看它的定义。',
            ],
            ja: [
              'どの単語もコンポーネントで描画できる。',
              Word.custom('シーン呼び出し', GlossaryTerm, {
                data: {
                  term: 'シーン呼び出し',
                  body: 'returnable を付けてジャンプすると、今のシーンは一時停止したままになる。ジャンプ先のシーンの動作が終わると、物語はジャンプの次の行から再開する。',
                },
              }),
              'をクリックすると、その定義が読める。',
            ],
          }),
        ),
        Control.jump(TEXT_MENU),
      ])
      .choose(t({ en: 'Back to the topics', zh: '返回上一级', ja: 'テーマ一覧に戻る' }), [Control.jump(TOPICS)]),

    Control.label(TOPIC_SPRITE),
    narra.say`${t({ en: 'The sprite is one element, and each demonstration below changes a property of it.', zh: '立绘是一个元素，下面每一项都在改它的一个属性。', ja: '立ち絵は一つの要素で、下のデモはそれぞれ一つのプロパティを変えているよ。' })}`,

    Control.label(SPRITE_MENU),

    Menu.prompt(t({ en: 'The character sprite.', zh: '立绘。', ja: '立ち絵。' }))
      .choose(t({ en: 'Position and scale', zh: '位置与缩放', ja: '位置と拡大率' }), [
        narra.say`${t({ en: 'Position, scale and rotation are properties a transform can animate.', zh: '位置、缩放和旋转都是可以过渡的属性。', ja: '位置、拡大率、回転はどれもトランスフォームでアニメーションできるプロパティだよ。' })}`,
        narraImage.pos({ xalign: 0.3, yalign: NARRA_YALIGN }, 800, 'easeInOut'),
        narraImage.zoom(NARRA_ZOOM * 1.15, 600, 'easeInOut'),
        narraImage.rotate(-4, 400, 'easeInOut'),
        narra.say`${t({ en: 'An action names the state to reach, and the engine fills in the frames between.', zh: '一条动作只描述要到达的状态，中间的每一帧由引擎补出来。', ja: 'アクションは到達する状態を指定するだけで、間のフレームはエンジンが補ってくれる。' })}`,
        ...restSprite(),
        Control.jump(SPRITE_MENU),
      ])
      .choose(t({ en: 'Entering and leaving', zh: '进场与退场', ja: '登場と退場' }), [
        narra.say`${t({ en: 'The circular close, the circular reveal and the directional wipe are built in, each with its own options.', zh: '圆形收放和方向擦除都是内置的，各自带自己的参数。', ja: '円形の開閉とワイプは標準で用意されていて、それぞれ独自のオプションを持つ。' })}`,
        narraImage.circleClose({ duration: 700 }),
        narraImage.circleReveal({ duration: 700 }),
        narraImage.wipe({ direction: 'right', duration: 700 }),
        narra.say`${t({ en: 'They clip the sprite alone, and the background stays where it is throughout.', zh: '它们改的是立绘自己的裁剪，背景一直在。', ja: 'これらは立ち絵自体の切り抜きを変えるだけで、背景はそのまま残る。' })}`,
        Control.jump(SPRITE_MENU),
      ])
      .choose(t({ en: 'Filters', zh: '滤镜', ja: 'フィルター' }), [
        narraImage.filter('grayscale(1)', { duration: 600 }),
        narra.say`${t({ en: 'A filter applies to one sprite, and leaves the background alone.', zh: '滤镜作用于单个立绘，背景不受影响。', ja: 'フィルターは一つの立ち絵にだけかかり、背景には影響しない。' })}`,
        narraImage.filter('sepia(0.7) brightness(0.85)', { duration: 600 }),
        narra.say`${t({ en: 'Another set of values is another grade.', zh: '换一组参数就是另一种调子。', ja: '数値を変えれば、また違う色合いになる。' })}`,
        narraImage.clearFilter({ duration: 600 }),
        Control.jump(SPRITE_MENU),
      ])
      .choose(t({ en: 'A looping transform', zh: '持续动作', ja: 'ループするトランスフォーム' }), [
        narra.say`${t({ en: 'The sprite has been running a looping breath the whole time, and the story never waits for it.', zh: '立绘一直在做一个循环的呼吸，故事从不等它。', ja: '立ち絵はずっと呼吸のループを続けていて、物語はそれを待ったりしない。' })}`,
        narraImage.stopLoop(),
        narra.say`${t({ en: 'It is stopped now.', zh: '现在停了。', ja: '今、止めた。' })}`,
        narraImage.loop(breathe, { repeatType: 'mirror' }),
        narra.say`${t({ en: 'And running again.', zh: '又开始了。', ja: 'また動き出した。' })}`,
        Control.jump(SPRITE_MENU),
      ])
      .choose(t({ en: 'Back to the topics', zh: '返回上一级', ja: 'テーマ一覧に戻る' }), [Control.jump(TOPICS)]),

    // The background is changed through the scene's own background image rather than through
    // Scene.setBackground. In engine 0.39.2 setBackground hands back a chain instead of an action,
    // and a menu branch links its statements by hand, so a branch that carries one and then keeps
    // going ends up with an unlinked statement in the middle of it.
    Control.label(TOPIC_BACKGROUND),
    narra.say`${t({ en: 'The background belongs to the scene, and a transition decides how it is replaced.', zh: '背景属于场景，转场决定它怎么被替换。', ja: '背景はシーンに属していて、トランジションがどう切り替わるかを決める。' })}`,

    Control.label(BACKGROUND_MENU),

    Menu.prompt(t({ en: 'Backgrounds and transitions.', zh: '背景与转场。', ja: '背景とトランジション。' }))
      .choose(t({ en: 'Dissolve', zh: '溶解', ja: 'ディゾルブ' }), [
        hall.background.char(demoWashImage.src, new Dissolve({ duration: 800 })),
        narra.say`${t({ en: 'The background changes without the scene changing, and the sprite stays where it is.', zh: '换背景不换场景，立绘留在原处。', ja: 'シーンは変わらないまま背景だけが変わり、立ち絵はそのままの位置にいる。' })}`,
        hall.background.char(demoHallImage.src, new Dissolve({ duration: 800 })),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(t({ en: 'A masked reveal', zh: '遮罩', ja: 'マスク切り替え' }), [
        hall.background.char(
          demoWashImage.src,
          new Reveal({ duration: 900, pattern: Mask.blinds({ slats: 10 }) }),
        ),
        narra.say`${t({ en: 'Blinds, iris, clock, fan and dots are all built-in mask shapes.', zh: '百叶、光圈、时钟、扇形和圆点都是内置的遮罩形状。', ja: 'ブラインド、アイリス、時計、扇形、ドットはどれも標準のマスク形状だよ。' })}`,
        hall.background.char(demoHallImage.src, new Reveal({ duration: 900, pattern: Mask.clock() })),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(t({ en: 'Through a colour', zh: '透色', ja: 'カラー経由' }), [
        hall.background.char(
          demoWashImage.src,
          new ThroughColor({ duration: 1400, color: '#0b1a22', holdMs: 400 }),
        ),
        narra.say`${t({ en: 'The frame is covered by a colour, held there, and uncovered again.', zh: '画面先盖上一层颜色，停一会儿，再从颜色里出来。', ja: '画面はいったん色に覆われて少し止まり、そこからまた現れる。' })}`,
        hall.background.char(
          demoHallImage.src,
          new ThroughColor({ duration: 1400, color: '#0b1a22', holdMs: 400 }),
        ),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(t({ en: 'Push', zh: '推移', ja: 'プッシュ' }), [
        hall.background.char(demoWashImage.src, new Push({ duration: 800, direction: 'left' })),
        narra.say`${t({ en: 'One background slides out as the other slides in, as if the camera panned across.', zh: '两张背景一进一出，像镜头横摇过去。', ja: '一方の背景が出ていき、もう一方が入ってくる。カメラが横に振れたように見える。' })}`,
        hall.background.char(demoHallImage.src, new Push({ duration: 800, direction: 'right' })),
        Control.jump(BACKGROUND_MENU),
      ])
      .choose(t({ en: 'Back to the topics', zh: '返回上一级', ja: 'テーマ一覧に戻る' }), [Control.jump(TOPICS)]),

    Control.label(TOPIC_CAMERA),
    narra.say`${t({ en: 'The camera sits above the scene and applies to everything drawn in it.', zh: '相机在场景之上，作用于其中绘制的一切。', ja: 'カメラはシーンの上位にあって、その中に描かれるすべてに効果がおよぶ。' })}`,

    Control.label(CAMERA_MENU),

    Menu.prompt(t({ en: 'The camera.', zh: '相机。', ja: 'カメラ。' }))
      .choose(t({ en: 'Zoom and pan', zh: '缩放与平移', ja: 'ズームとパン' }), [
        narra.say`${t({ en: 'The camera acts on the whole stage, so the sprite and the background move together.', zh: '相机作用于整个舞台，立绘与背景一起移动。', ja: 'カメラはステージ全体に効くので、立ち絵と背景がいっしょに動く。' })}`,
        story.camera.zoom(1.22, 900, 'easeInOut'),
        story.camera.pan({ xalign: 0.42 }, 900, 'easeInOut'),
        story.camera.resetCamera(700),
        Control.jump(CAMERA_MENU),
      ])
      .choose(t({ en: 'Vignette and shutter', zh: '暗角与快门', ja: 'ビネットとシャッター' }), [
        story.camera.vignette(0.68, 500),
        narra.say`${t({ en: 'The vignette is fixed to the view, and the stage moves beneath it.', zh: '暗角固定在视野上，舞台在它下面移动。', ja: 'ビネットは画面側に固定されていて、ステージがその下で動く。' })}`,
        story.camera.shutter(1, 170, 'easeInOut'),
        story.camera.shutter(0, 240, 'easeInOut'),
        narra.say`${t({ en: 'The shutter closes and opens again in the length of a blink.', zh: '快门合上再打开，是一次眨眼的长度。', ja: 'シャッターが閉じてまた開く、瞬きほどの長さで。' })}`,
        story.camera.resetCamera(700),
        Control.jump(CAMERA_MENU),
      ])
      .choose(t({ en: 'Colour grading', zh: '调色', ja: 'カラーグレーディング' }), [
        story.camera.filter('saturate(0.35) brightness(0.8)', { duration: 700 }),
        narra.say`${t({ en: 'A filter can sit on the camera instead, where it applies to everything on screen.', zh: '滤镜也可以挂在相机上，这时它作用于全部画面。', ja: 'フィルターはカメラ側に掛けることもでき、その場合は画面全体に効果がおよぶ。' })}`,
        story.camera.resetCamera(700),
        Control.jump(CAMERA_MENU),
      ])
      .choose(t({ en: 'Back to the topics', zh: '返回上一级', ja: 'テーマ一覧に戻る' }), [Control.jump(TOPICS)]),

    Control.label(TOPIC_FLOW),
    narra.say`${t({ en: 'Scene flow is how the story moves between scenes, and inside one.', zh: '场景流程是故事在场景之间和场景内部的移动方式。', ja: 'シーンの流れとは、物語がシーン同士のあいだと、シーンの中をどう進むかということだよ。' })}`,

    Control.label(FLOW_MENU),

    Menu.prompt(t({ en: 'Scene flow.', zh: '场景流程。', ja: 'シーンの流れ。' }))
      .choose(t({ en: 'A transition between scenes', zh: '场景转场', ja: 'シーン間のトランジション' }), [
        narra.say`${t({ en: 'A transition plays across the whole stage, and the sprite, the background and the text box all take part.', zh: '转场作用于整个舞台，立绘、背景与文本框都参与其中。', ja: 'トランジションはステージ全体で再生され、立ち絵も背景もテキストボックスもそこに含まれる。' })}`,
        hall.jumpTo(room, {
          transition: new Reveal({ duration: 900, pattern: Mask.iris() }),
          returnable: true,
        }),
        narra.say`${t({ en: 'The corridor kept its state for as long as the other scene played.', zh: '另一个场景播放期间，走廊保持原有状态。', ja: '別のシーンが再生されているあいだ、廊下はそのままの状態を保っていた。' })}`,
        Control.jump(FLOW_MENU),
      ])
      .choose(t({ en: 'A scene call', zh: '场景调用', ja: 'シーン呼び出し' }), [
        narra.say`${t({ en: 'A jump made with returnable suspends this scene, and execution continues once the target scene ends.', zh: '以 returnable 跳转会挂起当前场景，目标场景结束后继续执行。', ja: 'returnable を付けたジャンプはこのシーンを一時停止させ、ジャンプ先のシーンが終わると実行が続く。' })}`,
        hall.jumpTo(aside, { transition: new Dissolve({ duration: 600 }), returnable: true }),
        narra.say`${t({ en: 'Execution resumed at the line after the jump.', zh: '执行从跳转之后的一行继续。', ja: '実行はジャンプの次の行から再開した。' })}`,
        Control.jump(FLOW_MENU),
      ])
      .choose(t({ en: 'Jumping to a label', zh: '标签跳转', ja: 'ラベルへのジャンプ' }), [
        narra.say`${t({ en: 'Every return in this tour is a jump to a label.', zh: '这份演示的每一次返回都是一个标签跳转。', ja: 'このツアーで戻るときは、いつもラベルへのジャンプを使っている。' })}`,
        narra.say`${t({ en: 'Labels are named inside a scene and resolved when the story is built, so a name that is wrong fails the build.', zh: '标签在场景内命名，目标在构建故事时解析，名字写错过不了构建。', ja: 'ラベルはシーンの中で名付けられ、行き先はストーリーのビルド時に解決される。名前を間違えるとビルドが通らない。' })}`,
        Control.jump(FLOW_MENU),
      ])
      .choose(t({ en: 'Back to the topics', zh: '返回上一级', ja: 'テーマ一覧に戻る' }), [Control.jump(TOPICS)]),
  ]);

  room.action([
    narrator.say`${t({ en: 'A different scene, running in the same player.', zh: '同一个播放器中的另一个场景。', ja: '同じプレイヤーの中で動く、別のシーン。' })}`,
    narrator.say`${t({ en: 'The corridor is suspended, and the story returns to it when this scene ends.', zh: '走廊处于挂起状态，本场景结束后故事回到那里。', ja: '廊下は一時停止していて、このシーンが終わると物語はそこへ戻る。' })}`,
  ]);

  aside.action([
    narrator.say`${t({ en: 'This scene contains no jump of its own.', zh: '这个场景本身不包含任何跳转。', ja: 'このシーン自体にはジャンプが一つもない。' })}`,
    narrator.say`${t({ en: 'The story returns as soon as its actions finish.', zh: '它的动作执行完毕，故事随即返回。', ja: '動作が終わり次第、物語はすぐに戻る。' })}`,
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
