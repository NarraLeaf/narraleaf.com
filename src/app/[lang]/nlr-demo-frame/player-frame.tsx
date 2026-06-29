'use client';

import { useEffect, useMemo } from 'react';
import {
  b,
  c,
  Character,
  Dialog,
  Dissolve,
  FadeIn,
  GameMenu,
  GameProviders,
  Image as NarraImage,
  Item,
  Menu,
  Nametag,
  Player,
  type PlayerEventContext,
  Scene,
  Story,
  Texts,
  Transform,
  useDialog,
  useGame,
} from 'narraleaf-react';
import { type Locale } from '@/lib/i18n';

function createDemoStory(locale: Locale) {
  const isZh = locale === 'zh';
  const story = new Story(isZh ? '嵌入式 NarraLeaf-React 示例' : 'Embedded NarraLeaf-React demo');
  const introScene = new Scene('intro_scene', {
    background: '#08151b',
  });
  const featureScene = new Scene('feature_scene', {
    background: '/static/img/demo-outside.jpg',
  });
  const loopScene = new Scene('loop_scene', {
    background: '/static/img/demo-outside.jpg',
  });

  const narrator = new Character(isZh ? '旁白' : 'Narrator');
  const narra = new Character('Narra');
  const narraImage = new NarraImage<any>({
    src: '/static/img/demo-narra.png',
    position: {
      xalign: 0.64,
      yalign: 0.48,
    },
    zoom: 0.56,
  });

  introScene.action([
    introScene.background.char('/static/img/demo-room.jpg', new FadeIn(600)),
    narraImage.show({ duration: 600 }),
    narraImage.transform(
      Transform.create()
        .position({ yoffset: -24 })
        .commit({ duration: 260, ease: 'easeInOut' })
        .position({ yoffset: 0 })
        .commit({ duration: 260, ease: 'easeInOut' }),
    ),
    narrator
      .say`${isZh ? '这个播放器就嵌在当前页面里。' : 'This player is mounted inside the current page.'}`
      .say`${isZh ? '它执行的是可以放进应用里的故事动作，不是截图。' : 'It is running story actions you can ship in an app, not a screenshot.'}`,
    narra
      .say`${isZh ? '外层是 React，流程仍然是视觉小说脚本。' : 'The shell is React, but the flow is still a visual novel.'}`
      .say`${isZh ? `文本里可以有${c('颜色', '#7dd3fc')}。` : `Text can carry ${c('color', '#7dd3fc')}.`}`
      .say`${isZh ? `需要的时候也可以${b('强调')}。` : `Use ${b('emphasis')} when the line needs it.`}`,
    Menu.prompt(isZh ? '接下来试哪一步？' : 'What should happen next?')
      .choose(isZh ? '切换背景' : 'Change the background', [
        narra.say`${isZh ? '好，我先退场。' : 'Sure. Let me step out first.'}`,
        narraImage.hide({ duration: 500 }),
        introScene.jumpTo(featureScene, new Dissolve(500)),
      ])
      .choose(isZh ? '继续对白' : 'Keep talking', [
        narra.say`${isZh ? '那我们就留在这个场景里继续说。' : 'Then we can keep the same scene and continue.'}`,
      ]),
  ]);

  featureScene.action([
    narraImage.show({ duration: 600 }),
    narra.say`${isZh ? '背景已经切过去了。这里还是同一个 Player，只是执行了新的 Scene。' : 'The background changed. Same Player, new Scene.'}`,
    narraImage.transform(
      Transform.create()
        .position({ xoffset: -80 })
        .commit({ duration: 260, ease: 'easeInOut' })
        .position({ xoffset: 0 })
        .commit({ duration: 260, ease: 'easeInOut' }),
    ),
    narra.say`${isZh ? '继续往下，可以接分支、音频、存档，也可以接外层页面自己的 UI。' : 'From here, you can add branches, audio, saves, or the surrounding UI your page needs.'}`,
    Menu.prompt(isZh ? '接下来呢？' : 'Next?')
      .choose(isZh ? '回到开头' : 'Back to the start', [
        narraImage.hide({ duration: 500 }),
        featureScene.jumpTo(introScene, new Dissolve(500)),
      ])
      .choose(isZh ? '继续停在这里' : 'Stay here', [
        narra.say`${isZh ? '可以。播放器会像页面里的其他 React 部分一样留在这里。' : 'That works. The player can stay here like any other part of the page.'}`,
        featureScene.jumpTo(loopScene),
      ]),
  ]);

  loopScene.action([
    narra.say`${isZh ? '示例会保持可交互状态，你可以继续点击选项。' : 'The example stays interactive, so you can keep clicking through it.'}`,
    loopScene.jumpTo(featureScene),
  ]);

  story.entry(introScene);
  return story;
}

function DemoDialog() {
  const { done } = useDialog();

  return (
    <Dialog className="relative mx-auto mb-4 h-[84%] w-[88%] rounded-lg border border-cyan-200/70 bg-black/58 p-5 shadow-2xl backdrop-blur-md">
      <div className="absolute left-6 -top-6">
        <Nametag className="flex min-h-[44px] min-w-[150px] items-center justify-center rounded-lg border border-cyan-200/70 bg-black/62 px-4 py-2 text-[22px] font-semibold text-cyan-50 shadow-lg backdrop-blur-sm" />
      </div>
      <div className="flex h-full items-center gap-3 pt-1 text-[30px] leading-[1.45] text-white">
        <Texts className="max-w-full" />
        <div className="flex shrink-0 flex-col items-center">
          <div
            className={[
              'h-0 w-0 border-x-[7px] border-t-[11px] border-x-transparent border-t-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-opacity',
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
  const game = useGame();
  const story = useMemo(() => createDemoStory(locale), [locale]);

  useEffect(() => {
    game.configure({
      width: 1280,
      height: 720,
      aspectRatio: 16 / 9,
      ratioUpdateInterval: 0,
      dialog: DemoDialog,
      menu: DemoMenu,
      defaultTextColor: 'white',
      defaultNametagColor: '#e6fbff',
      minHeight: 50,
      minWidth: 50,
    });

    game.preference.setPreference('cps', 72);
  }, [game]);

  function handleReady({ liveGame }: PlayerEventContext) {
    liveGame.newGame();
  }

  return <Player story={story} width="100%" height="100%" onReady={handleReady} />;
}

export function NarraLeafReactPlayerFrame(props: { locale: Locale }) {
  const { locale } = props;

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#eef8fb]">
      <GameProviders>
        <DemoPlayer locale={locale} />
      </GameProviders>
    </main>
  );
}
