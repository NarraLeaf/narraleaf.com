import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { appName, docsRoute, gitConfig, projectRoute, siteLogoPath } from '@/lib/shared';
import { isLocale, type Locale, localizedPath } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { UiEditorSlideshow } from './ui-editor-slideshow';
import { ProjectModelTabs, type ProjectModelTabCopy } from './project-model-tabs';
import { DesktopDemoShowcase } from './desktop-demo-showcase';
import {
  HighlightedName,
  ProductLogo,
  type ProjectLogoKind,
  type ProjectTone,
} from './project-identity';
import { NarraLeafReactDemo } from './narraleaf-react-demo';

type SolutionCard = {
  title: string;
  description: string;
  href: string;
  audience: string;
  cta: string;
  tone: ProjectTone;
  logo: ProjectLogoKind;
};

type SectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

type HeroCopy = SectionCopy & {
  primaryCta: string;
  secondaryCta: string;
  imageAlt: string;
};

/** One themed run of Studio screenshots. `slideAlts` is positional against `studioSlideGroups`. */
type EditorSlideGroupCopy = {
  id: StudioSlideGroupId;
  title: string;
  description: string;
  slideAlts: string[];
};

type EditorIntroCopy = SectionCopy & {
  cta: string;
  href: string;
  groups: EditorSlideGroupCopy[];
  slideControls: {
    previous: string;
    next: string;
    goToSlide: string;
    openPreview: string;
    closePreview: string;
  };
};

type DesktopIntroCopy = SectionCopy & {
  cta: string;
  href: string;
  codeImageAlt: string;
  demoSlideAlts: string[];
  slideControls: {
    previous: string;
    next: string;
    goToSlide: string;
  };
};

type EmbedDemoCopy = SectionCopy & {
  code: string[];
};

type FooterCopy = {
  navigationLabel: string;
  projectLabel: string;
  docsLabel: string;
  sourceLabel: string;
  copyright: string;
};

type HomePageCopy = {
  hero: HeroCopy;
  solutionIntro: SectionCopy;
  editorIntro: EditorIntroCopy;
  desktopIntro: DesktopIntroCopy;
  projectModelIntro: SectionCopy;
  projectModelTabs: ProjectModelTabCopy[];
  solutions: SolutionCard[];
  embedDemo: EmbedDemoCopy;
  bottomCta: Omit<SectionCopy, 'eyebrow'>;
  footer: FooterCopy;
};

const homeCopy = {
  en: {
    hero: {
      eyebrow: '',
      title: 'Visual novels, built like modern software.',
      description:
        'One project system for building, shipping, and embedding visual novels.',
      primaryCta: 'Explore the Project',
      secondaryCta: 'Browse the Docs',
      imageAlt: 'NarraLeaf Studio workspace with a visual novel project open',
    },
    solutionIntro: {
      eyebrow: 'Project paths',
      title: 'Choose the path that matches the work in front of you.',
      description:
        'Use Studio to create freely, NarraLeaf Desktop to scale quickly, or NarraLeaf-React to customize completely.',
    },
    editorIntro: {
      eyebrow: 'Studio',
      title: 'NarraLeaf Studio shapes the project where creators can see it.',
      description:
        'NarraLeaf Studio brings asset management, interface editing, immersive narrative work, and team collaboration into one editor built for visual novel production.',
      cta: 'Explore Studio',
      href: '/studio',
      groups: [
        {
          id: 'craft',
          title: 'Write the story',
          description:
            'A prose editor that stays keyboard-first, a stage you can watch as you type, and characters that move.',
          slideAlts: [
            'Story editor with dialogue lines and character differentials',
            'Story preview running the current scene beside the editor',
            'Motion editor timing a character move across the stage',
            'A Live2D character posed on the stage with its runtime installed',
            'Project dashboard counting scenes, words, assets and blueprint nodes',
          ],
        },
        {
          id: 'customize',
          title: 'Make it yours',
          description:
            'Every surface the player sees is editable — dialogue box, menus, logic and all — and none of it is locked behind a theme.',
          slideAlts: [
            'UI editor laying out a game interface from a layer tree',
            'Interface templates ready to drop into a project',
            'A dialogue box being restyled, with safe-area and aspect-ratio previews',
            'Blueprint graph beside the game configuration panel',
            'A plugin adding Steam achievements to the project',
          ],
        },
        {
          id: 'ship',
          title: 'Translate it, version it, ship it',
          description:
            'Localization with a review pass, versions you can submit and share, live debugging, and a production build at the end.',
          slideAlts: [
            'Localization panel with translations awaiting review and approval',
            'Version history beside the asset library and an audio waveform',
            'Dev Mode running the game with the story runtime inspector open',
            'Building the project for distribution',
          ],
        },
      ],
      slideControls: {
        previous: 'Previous Studio preview',
        next: 'Next Studio preview',
        goToSlide: 'Show Studio preview',
        openPreview: 'Open enlarged Studio preview',
        closePreview: 'Close enlarged Studio preview',
      },
    },
    desktopIntro: {
      eyebrow: 'Desktop',
      title: 'NarraLeaf Desktop connects code and preview seamlessly.',
      description:
        'Work in the desktop project where window lifecycle, saves, routes, menus, and packaging are wired into the same NarraLeaf runtime you preview and ship.',
      cta: 'Explore Desktop',
      href: '/narraleaf/library/main',
      codeImageAlt: 'VS Code window with a NarraLeaf Desktop project entry file open',
      demoSlideAlts: [
        'NarraLeaf Desktop visual novel demo with a dialogue UI open',
        'NarraLeaf Desktop visual novel demo showing the load game menu',
      ],
      slideControls: {
        previous: 'Previous Desktop demo preview',
        next: 'Next Desktop demo preview',
        goToSlide: 'Show Desktop demo preview',
      },
    },
    projectModelIntro: {
      eyebrow: 'Project architecture',
      title: 'A modern project shape, not a traditional editor box.',
      description:
        'NarraLeaf separates production work, desktop runtime, and embedded playback as first-class routes in the same project. Each route has its own job, but the story never has to become a disconnected export.',
    },
    projectModelTabs: [
      {
        label: 'Studio',
        name: 'NarraLeaf Studio',
        tone: 'studio',
        logo: 'narraleaf',
        title: 'NarraLeaf Studio handles production work.',
        description:
          'Studio is the editor where production stays together: assets, interface states, narrative flow, and collaboration context live in the same workspace.',
        points: [
          'Manage project assets where scenes and UI decisions are made.',
          'Edit interfaces beside the immersive story flow they belong to.',
          'Keep production context visible for teams instead of scattering work across separate tools.',
        ],
      },
      {
        label: 'NarraLeaf Desktop',
        name: 'NarraLeaf Desktop',
        tone: 'electron',
        logo: 'electron',
        title: 'NarraLeaf Desktop handles the shipped application.',
        description:
          'Desktop is where the visual novel becomes software players can open: window lifecycle, routes, saves, menus, packaging, and runtime behavior belong here.',
        points: [
          'Build the playable app beside the code that controls it.',
          'Keep Electron, renderer, and NarraLeaf runtime decisions in one place.',
          'Use it when the visual novel is the product, not a page inside another app.',
        ],
      },
      {
        label: 'NarraLeaf-React',
        name: 'NarraLeaf-React',
        tone: 'react',
        logo: 'react',
        title: 'NarraLeaf-React handles embedded playback.',
        description:
          'React is for bringing the story into a web product without making the surrounding app pretend to be a visual novel engine.',
        points: [
          'Mount the player inside an existing React surface.',
          'Let the host app keep layout, data, auth, and product UI.',
          'Use it when the story is a feature inside a larger experience.',
        ],
      },
    ],
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description:
          'A production editor for assets, interfaces, immersive storytelling, and collaboration.',
        audience: 'For teams that need one place to shape the visual novel before delivery work begins.',
        href: '/studio',
        cta: 'Explore Studio',
        tone: 'studio',
        logo: 'narraleaf',
      },
      {
        title: 'NarraLeaf Desktop',
        description: 'A desktop application path for runtime, renderer, saves, packaging, and release work.',
        audience: 'For projects that need to become a standalone visual novel application.',
        href: '/narraleaf/library/main',
        cta: 'Explore Desktop',
        tone: 'electron',
        logo: 'electron',
      },
      {
        title: 'NarraLeaf-React',
        description: 'A React player for placing visual novel scenes inside your own interface.',
        audience: 'For products where the story supports a larger web experience.',
        href: '/narraleaf-react',
        cta: 'Explore React Player',
        tone: 'react',
        logo: 'react',
      },
    ],
    embedDemo: {
      eyebrow: 'React player',
      title: 'NarraLeaf-React stays inside the page.',
      description:
        'The player can sit beside the rest of your React UI while the script controls backgrounds, characters, dialogue, and choices inside the frame.',
      code: [
        'introScene.background.char("/room.jpg", new FadeIn(600)),',
        '',
        'narraImage.show({ duration: 600 }),',
        'narraImage.transform(',
        '  Transform.create()',
        '    .position({ yoffset: -24 })',
        '    .commit({ duration: 260 })',
        '),',
        '',
        'narrator.say`The scene starts here, inside this page.`',
        '',
        'narra.say`The line can still carry ${c("color", "#7dd3fc")}.`,',
        '',
        'Menu.prompt("Where should the scene go?")',
        '  .choose("Change the room", [',
        '    narra.say`Give me a second to step aside.`,',
        '    narraImage.hide({ duration: 500 }),',
        '    introScene.jumpTo(featureScene, new Dissolve(500)),',
        '  ]),',
      ],
    },
    bottomCta: {
      title: 'A good place to start.',
      description:
        'The project overview gives you the shape of NarraLeaf. When you want the details, the docs are ready beside it.',
    },
    footer: {
      navigationLabel: 'Footer navigation',
      projectLabel: 'Project',
      docsLabel: 'Docs',
      sourceLabel: 'GitHub',
      copyright: 'NarraLeaf Project',
    },
  },
  zh: {
    hero: {
      eyebrow: 'NarraLeaf Project',
      title: '像现代软件一样构建视觉小说',
      description:
        '一套视觉小说的项目系统，可发布为独立应用，也可嵌入现有网页',
      primaryCta: '探索项目',
      secondaryCta: '浏览文档',
      imageAlt: '打开视觉小说项目的 NarraLeaf Studio 工作区',
    },
    solutionIntro: {
      eyebrow: '项目路径',
      title: '眼前的工作，要从哪条路开始？',
      description:
        '不同项目形态各有起点，专注创作从 Studio 开始，桌面应用交给 Desktop，嵌入现有 Web 产品使用 NarraLeaf-React',
    },
    editorIntro: {
      eyebrow: 'Studio',
      title: 'NarraLeaf Studio 把写作与呈现放在同一个窗口',
      description:
        '专为视觉小说设计的编辑器，从第一句对白到最终发行版本，全程无需更换工具',
      cta: '探索 Studio',
      href: '/studio',
      groups: [
        {
          id: 'craft',
          title: '写故事',
          description: '正文编辑器以键盘操作为主，写下的内容即时呈现在一旁舞台预览中',
          slideAlts: [
            '故事编辑器中的对白行与角色差分',
            '故事预览与编辑器并排，实时播放当前场景',
            '动作编辑器为角色的位移编排时间轴',
            '装好运行时后，舞台上摆位的 Live2D 角色',
            '项目仪表盘统计场景、字数、资产与蓝图节点',
          ],
        },
        {
          id: 'customize',
          title: '外观由你定义',
          description: '玩家看到的每一处界面都可重新设计，包括对话框自身的交互行为',
          slideAlts: [
            'UI 编辑器以图层树搭建游戏界面',
            '可直接取用的界面模板',
            '重新设计对话框，并预览安全区与画面比例',
            '蓝图图表与游戏配置面板并排',
            '插件为项目接入 Steam 成就',
          ],
        },
        {
          id: 'ship',
          title: '交付之前',
          description: '本地化审校与版本记录同样在 Studio 内完成，直至导出可发行版本',
          slideAlts: [
            '本地化面板中等待审校与通过的译文',
            '版本历史与资产库、音频波形并排',
            'Dev Mode 运行游戏，并打开故事运行时检查器',
            '将项目构建为可分发的产物',
          ],
        },
      ],
      slideControls: {
        previous: '上一张 Studio 预览',
        next: '下一张 Studio 预览',
        goToSlide: '显示 Studio 预览',
        openPreview: '放大 Studio 预览',
        closePreview: '关闭预览',
      },
    },
    desktopIntro: {
      eyebrow: 'Desktop',
      title: 'NarraLeaf Desktop 让代码与运行中的游戏并排',
      description:
        '玩家最终启动的就是 Desktop 构建的应用，其窗口、存档与打包行为都写在项目自身的代码里',
      cta: '探索 Desktop',
      href: '/narraleaf/library/main',
      codeImageAlt: '打开 NarraLeaf Desktop 项目入口文件的 VS Code 窗口',
      demoSlideAlts: [
        '打开对白界面的 NarraLeaf Desktop 视觉小说演示',
        '显示读取存档菜单的 NarraLeaf Desktop 视觉小说演示',
      ],
      slideControls: {
        previous: '上一张 Desktop 演示预览',
        next: '下一张 Desktop 演示预览',
        goToSlide: '显示 Desktop 演示预览',
      },
    },
    projectModelIntro: {
      eyebrow: '项目结构',
      title: '一部视觉小说不应散落为互不相干的文件',
      description:
        'NarraLeaf 将项目分为几条并行路径，各司其职，故事本身始终只有一份，不会因路径不同而重写',
    },
    projectModelTabs: [
      {
        label: 'Studio',
        name: 'NarraLeaf Studio',
        tone: 'studio',
        logo: 'narraleaf',
        title: 'NarraLeaf Studio 制作交给它',
        description:
          '制作阶段所需的一切集中在同一个工作区',
        points: [
          '在搭建场景与界面的地方，直接管理项目素材',
          '界面编辑与沉浸叙事同步推进',
          '让团队协作留在制作现场，不必在多个工具之间切换',
        ],
      },
      {
        label: 'NarraLeaf Desktop',
        name: 'NarraLeaf Desktop',
        tone: 'electron',
        logo: 'electron',
        title: 'NarraLeaf Desktop 发布交给它',
        description:
          'Desktop 是玩家真正启动的应用，窗口行为与打包流程都由其承担',
        points: [
          '可游玩的应用与其控制代码并排构建',
          'Electron、renderer 与 NarraLeaf 运行时决策集中一处管理',
          '视觉小说本身即产品时，选择 Desktop',
        ],
      },
      {
        label: 'NarraLeaf-React',
        name: 'NarraLeaf-React',
        tone: 'react',
        logo: 'react',
        title: 'NarraLeaf-React 嵌入式播放交给它',
        description:
          '将故事放入 Web 产品，而不是让产品变成一套视觉小说引擎',
        points: [
          '播放器可直接嵌入已有的 React 界面',
          '外层应用不受影响，仍负责布局、数据、账户与产品 UI',
          '故事只是产品的一部分时，选择 NarraLeaf-React',
        ],
      },
    ],
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description: '完成一部视觉小说所需的制作编辑器',
        audience: '适合希望将制作流程集中在一处的团队',
        href: '/studio',
        cta: '探索 Studio',
        tone: 'studio',
        logo: 'narraleaf',
      },
      {
        title: 'NarraLeaf Desktop',
        description: '将视觉小说发布为独立的桌面应用',
        audience: '适合以视觉小说本身作为产品的项目',
        href: '/narraleaf/library/main',
        cta: '探索 Desktop',
        tone: 'electron',
        logo: 'electron',
      },
      {
        title: 'NarraLeaf-React',
        description: '把故事嵌入既有的 React 界面',
        audience: '适合故事只占产品一部分的团队',
        href: '/narraleaf-react',
        cta: '探索 React 播放器',
        tone: 'react',
        logo: 'react',
      },
    ],
    embedDemo: {
      eyebrow: 'React 播放器',
      title: 'NarraLeaf-React 就运行在这个页面里',
      description:
        '它与你的 React 界面一同运行，画面完全由剧本驱动',
      code: [
        'introScene.background.char("/room.jpg", new FadeIn(600)),',
        '',
        'narraImage.show({ duration: 600 }),',
        'narraImage.transform(',
        '  Transform.create()',
        '    .position({ yoffset: -24 })',
        '    .commit({ duration: 260 })',
        '),',
        '',
        'narrator.say`这个场景就从页面里开始。`',
        '',
        'narra.say`台词仍然可以带上 ${c("颜色", "#7dd3fc")}。`,',
        '',
        'Menu.prompt("接下来去哪里？")',
        '  .choose("换到房间另一边", [',
        '    narra.say`等我先让出画面。`,',
        '    narraImage.hide({ duration: 500 }),',
        '    introScene.jumpTo(featureScene, new Dissolve(500)),',
        '  ]),',
      ],
    },
    bottomCta: {
      title: '建议从项目概览开始',
      description:
        '项目概览展示整体结构，需要细节时再进入文档',
    },
    footer: {
      navigationLabel: '页脚导航',
      projectLabel: '项目',
      docsLabel: '文档',
      sourceLabel: 'GitHub',
      copyright: 'NarraLeaf Project',
    },
  },
} satisfies Record<Locale, HomePageCopy>;

/**
 * Studio screenshots, in three themed runs rather than one long carousel.
 *
 * The grouping is the point: fourteen shots in a row read as a slideshow nobody watches to the end,
 * while three short runs each make one claim — you write in it, you shape how it looks, you ship
 * and translate it with other people. Order within a group is deliberate; the first slide is the
 * one that has to land, since a visitor may only ever see that one.
 *
 * Every file is 2956x1974 to match the aspect ratio the slideshow hard-codes.
 */
const studioSlideGroups = {
  craft: [
    '/static/img/studio-slides/story-editor.webp',
    '/static/img/studio-slides/story-live-preview.webp',
    '/static/img/studio-slides/story-motion-editor.webp',
    '/static/img/studio-slides/live2d-puppet.webp',
    '/static/img/studio-slides/dashboard.webp',
  ],
  customize: [
    '/static/img/studio-slides/ui-editor.webp',
    '/static/img/studio-slides/ui-templates.webp',
    '/static/img/studio-slides/dialog-customization.webp',
    '/static/img/studio-slides/blueprint-game-config.webp',
    '/static/img/studio-slides/plugin-system.webp',
  ],
  ship: [
    '/static/img/studio-slides/translation.webp',
    '/static/img/studio-slides/version-control.webp',
    '/static/img/studio-slides/dev-mode.webp',
    '/static/img/studio-slides/build-for-production.webp',
  ],
} as const satisfies Record<string, readonly string[]>;

type StudioSlideGroupId = keyof typeof studioSlideGroups;

const desktopCodeImage = '/static/img/home/desktop-code.webp';

const desktopDemoSlideImages = [
  '/static/img/home/desktop-game-dialog.webp',
  '/static/img/home/desktop-game-menu.webp',
] as const;

function SectionIntro(props: { title: string; description: string }) {
  const { title, description } = props;

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}

function CtaLinks(props: {
  projectUrl: string;
  docsUrl: string;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  const { projectUrl, docsUrl, primaryLabel, secondaryLabel } = props;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href={projectUrl}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 py-3 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
      >
        {primaryLabel}
        <ArrowRight className="size-4" />
      </Link>
      <Link
        href={docsUrl}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 px-5 py-3 text-sm font-medium transition-colors duration-200 hover:bg-fd-card dark:border-white/10"
      >
        {secondaryLabel}
        <BookOpen className="size-4" />
      </Link>
    </div>
  );
}

export default async function HomePage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params;
  // The proxy skips i18n rewriting for paths containing a dot, so requests for
  // static-looking files (/favicon.ico, /robots.txt) reach this catch-all route
  // with `lang` set to the filename. The layout already calls notFound() for
  // those, but layout and page render concurrently — without this guard the
  // page throws on `homeCopy[locale]` before the 404 wins.
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const copy = homeCopy[locale];
  const projectUrl = localizedPath(projectRoute, locale);
  const docsUrl = (path = '') => localizedPath(`${docsRoute}${path}`, locale);
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <>
      <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b border-black/10 dark:border-white/10 lg:overflow-visible">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-20 sm:py-24 lg:min-h-[760px] lg:flex-row lg:items-center lg:gap-10 lg:py-24 xl:gap-16">
          <div className="relative z-10 max-w-2xl space-y-8 lg:w-[40%] lg:shrink-0">
            <div className="space-y-5">
              <p className="text-sm font-medium tracking-[0.18em] text-fd-muted-foreground uppercase">
                {copy.hero.eyebrow}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {copy.hero.title}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-fd-muted-foreground sm:text-xl">
                {copy.hero.description}
              </p>
            </div>

            <CtaLinks
              projectUrl={projectUrl}
              docsUrl={docsUrl()}
              primaryLabel={copy.hero.primaryCta}
              secondaryLabel={copy.hero.secondaryCta}
            />
          </div>

          <div className="group relative z-20 -mx-6 h-[330px] overflow-visible sm:h-[420px] lg:mx-0 lg:h-[560px] lg:min-w-0 lg:flex-1 xl:h-[620px]">
            <div className="absolute top-4 right-0 left-6 h-[92%] sm:left-10 lg:top-1/2 lg:right-0 lg:left-0 lg:h-[540px] lg:-translate-y-1/2 xl:h-[600px]">
              <div className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 transition-[width] duration-[350ms] ease-out group-hover:w-[96vw] sm:group-hover:w-[92vw] lg:group-hover:w-[1121px] xl:group-hover:w-[1246px]">
                <div className="h-full origin-center rotate-[-1.5deg] transition-transform duration-[350ms] ease-out will-change-transform group-hover:rotate-0">
                  <div className="relative h-full overflow-hidden">
                    <Image
                      src="/static/img/home/studio-workspace.webp"
                      alt={copy.hero.imageAlt}
                      fill
                      priority
                      sizes="(min-width: 1280px) 1246px, (min-width: 1024px) 1121px, 118vw"
                      className="object-cover object-left-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            title={copy.solutionIntro.title}
            description={copy.solutionIntro.description}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {copy.solutions.map((solution) => {
              return (
                <article
                  key={solution.title}
                  className="flex h-full flex-col rounded-xl border border-black/10 bg-fd-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/15 dark:border-white/10 dark:hover:border-white/15"
                >
                  <div className="flex items-center gap-3">
                    <ProductLogo logo={solution.logo} className="size-10" />
                    <h3 className="text-xl font-semibold tracking-tight">
                      <HighlightedName
                        text={solution.title}
                        name={solution.title}
                        tone={solution.tone}
                      />
                    </h3>
                  </div>
                  <p className="mt-6 text-base leading-7 text-fd-muted-foreground">
                    {solution.description}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">{solution.audience}</p>
                  <div className="mt-auto pt-8">
                    <Link
                      href={docsUrl(solution.href)}
                      className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 font-mono text-sm font-medium transition-colors duration-200 hover:bg-fd-background dark:border-white/10"
                    >
                      {solution.cta}
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:pt-20 sm:pb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                <HighlightedName
                  text={copy.editorIntro.title}
                  name="NarraLeaf Studio"
                  tone="studio"
                />
              </h2>
              <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
                {copy.editorIntro.description}
              </p>
            </div>

            <Link
              href={docsUrl(copy.editorIntro.href)}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-black/10 px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-fd-card dark:border-white/10"
            >
              {copy.editorIntro.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-14 sm:mt-12 sm:gap-20">
            {copy.editorIntro.groups.map((group) => (
              <div key={group.id} className="mx-auto w-full max-w-[1000px]">
                <div className="max-w-2xl space-y-2">
                  <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                    {group.title}
                  </h3>
                  <p className="text-sm leading-6 text-fd-muted-foreground sm:text-base">
                    {group.description}
                  </p>
                </div>

                <div className="mt-5 w-full overflow-visible sm:mt-6">
                  <UiEditorSlideshow
                    slides={studioSlideGroups[group.id].map((src, index) => ({
                      src,
                      alt: group.slideAlts[index],
                    }))}
                    labels={copy.editorIntro.slideControls}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:pt-20 sm:pb-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                <HighlightedName
                  text={copy.desktopIntro.title}
                  name="NarraLeaf Desktop"
                  tone="electron"
                />
              </h2>
              <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
                {copy.desktopIntro.description}
              </p>
            </div>

            <Link
              href={docsUrl(copy.desktopIntro.href)}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-black/10 px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-fd-card dark:border-white/10"
            >
              {copy.desktopIntro.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <DesktopDemoShowcase
            codeImage={{
              src: desktopCodeImage,
              alt: copy.desktopIntro.codeImageAlt,
            }}
            slides={desktopDemoSlideImages.map((src, index) => ({
              src,
              alt: copy.desktopIntro.demoSlideAlts[index],
            }))}
            labels={copy.desktopIntro.slideControls}
          />
        </div>
      </section>

        <NarraLeafReactDemo copy={copy.embedDemo} locale={locale} />

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            title={copy.projectModelIntro.title}
            description={copy.projectModelIntro.description}
          />

          <div className="mt-10">
            <ProjectModelTabs tabs={copy.projectModelTabs} />
          </div>
        </div>
      </section>

        <section className="border-t border-b border-black/10 bg-fd-card/45 dark:border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {copy.bottomCta.title}
              </h2>
              <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
                {copy.bottomCta.description}
              </p>
            </div>

            <CtaLinks
              projectUrl={projectUrl}
              docsUrl={docsUrl()}
              primaryLabel={copy.hero.primaryCta}
              secondaryLabel={copy.hero.secondaryCta}
            />
          </div>
        </section>
      </main>

      <footer className="bg-fd-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:py-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md space-y-4">
            <Link href={localizedPath('/', locale)} className="inline-flex items-center gap-3 font-semibold">
              <Image
                src={siteLogoPath}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-sm"
                unoptimized
              />
              <span>{appName}</span>
            </Link>
          </div>

          <nav
            aria-label={copy.footer.navigationLabel}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium"
          >
            <Link href={projectUrl} className="text-fd-muted-foreground transition-colors hover:text-fd-foreground">
              {copy.footer.projectLabel}
            </Link>
            <Link href={docsUrl()} className="text-fd-muted-foreground transition-colors hover:text-fd-foreground">
              {copy.footer.docsLabel}
            </Link>
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <ExternalLink className="size-4" />
              {copy.footer.sourceLabel}
            </a>
          </nav>
        </div>
        <div className="border-t border-black/10 dark:border-white/10">
          <div className="mx-auto w-full max-w-6xl px-6 py-5 text-xs text-fd-muted-foreground">
            &copy; {copy.footer.copyright}
          </div>
        </div>
      </footer>
    </>
  );
}
