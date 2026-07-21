import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { appName, docsRoute, gitConfig, projectRoute, siteIconPath } from '@/lib/shared';
import { type Locale, localizedPath } from '@/lib/i18n';
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

type EditorIntroCopy = SectionCopy & {
  cta: string;
  href: string;
  slideAlts: string[];
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
      slideAlts: [
        'NarraLeaf Studio workspace overview',
        'NarraLeaf Studio editor preview 2',
        'NarraLeaf Studio editor preview 3',
        'NarraLeaf Studio editor preview 4',
        'NarraLeaf Studio editor preview 5',
        'NarraLeaf Studio editor preview 6',
        'NarraLeaf Studio editor preview 7',
        'NarraLeaf Studio editor preview 8',
        'NarraLeaf Studio editor preview 9',
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
      copyright: 'NarraLeaf Project.',
    },
  },
  zh: {
    hero: {
      eyebrow: 'NarraLeaf Project',
      title: '像现代软件一样构建视觉小说',
      description:
        '一套用于构建、发布和嵌入视觉小说的项目系统',
      primaryCta: '探索项目',
      secondaryCta: '浏览文档',
      imageAlt: '打开视觉小说项目的 NarraLeaf Studio 工作区',
    },
    solutionIntro: {
      eyebrow: '项目路径',
      title: '眼前的工作，要从哪条路开始？',
      description:
        '使用 Studio 自由创作，使用 NarraLeaf Desktop 快速扩展，或使用 NarraLeaf-React 完全自定义',
    },
    editorIntro: {
      eyebrow: 'Studio',
      title: 'NarraLeaf Studio —— 创作者看得见的工作台',
      description:
        '资产管理、界面编辑、沉浸叙事、团队协作：NarraLeaf Studio 把它们都装在了这个专为视觉小说而生的编辑器。',
      cta: '探索 Studio',
      href: '/studio',
      slideAlts: [
        'NarraLeaf Studio 工作区概览',
        'NarraLeaf Studio 编辑器预览 2',
        'NarraLeaf Studio 编辑器预览 3',
        'NarraLeaf Studio 编辑器预览 4',
        'NarraLeaf Studio 编辑器预览 5',
        'NarraLeaf Studio 编辑器预览 6',
        'NarraLeaf Studio 编辑器预览 7',
        'NarraLeaf Studio 编辑器预览 8',
        'NarraLeaf Studio 编辑器预览 9',
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
      title: 'NarraLeaf Desktop —— 让代码与预览无缝衔接',
      description:
        '窗口、存档、路由、菜单、打包：所有环节由 Desktop 一手把控，代码、预览与交付路径始终连在同一套 NarraLeaf 运行时里。',
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
      title: '告别传统编辑器，迎接现代项目结构',
      description:
        '制作、桌面运行、网页嵌入：NarraLeaf 将它们分成项目里的三条并行的路，各有分工，而故事不必被拆为互不相干的文件。',
    },
    projectModelTabs: [
      {
        label: 'Studio',
        name: 'NarraLeaf Studio',
        tone: 'studio',
        logo: 'narraleaf',
        title: 'NarraLeaf Studio 制作交给它',
        description:
          '素材、界面状态、叙事流程、协作上下文，一个工作区全都搞定。',
        points: [
          '在搭建场景和界面的地方，直接管理项目素材。',
          '界面编辑和沉浸叙事，在一起同步推进。',
          '让团队协作也留在制作现场，不必在多个工具之间来回跳。',
        ],
      },
      {
        label: 'NarraLeaf Desktop',
        name: 'NarraLeaf Desktop',
        tone: 'electron',
        logo: 'electron',
        title: 'NarraLeaf Desktop 发布交给它',
        description:
          'Desktop 是玩家真正打开的游戏的地方：窗口生命周期、路由、存档、菜单、打包和运行时行为都在这里。',
        points: [
          '可游玩的应用，和控制它的代码，并排构建。',
          'Electron、renderer 和 NarraLeaf 运行时决策集中一处管理。',
          '视觉小说本身就是产品？Desktop即可派上用场。',
        ],
      },
      {
        label: 'NarraLeaf-React',
        name: 'NarraLeaf-React',
        tone: 'react',
        logo: 'react',
        title: 'NarraLeaf-React 嵌入式播放交给它',
        description:
          '把故事放在你的 Web 产品里，而不是让它成为一套视觉小说引擎',
        points: [
          '播放器可以直接挂进已有的 React 界面。',
          '外层应用不受影响，依旧负责布局、数据、账号和产品 UI。',
          '故事只是其中一个功能？React 即可派上用场',
        ],
      },
    ],
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description: '面向资产、界面、沉浸叙事与团队协作的制作编辑器。',
        audience: '适合想在交付前，把视觉小说的制作推进集中在一处的团队。',
        href: '/studio',
        cta: '探索 Studio',
        tone: 'studio',
        logo: 'narraleaf',
      },
      {
        title: 'NarraLeaf Desktop',
        description: '面向运行时、renderer、存档、打包与发布工作的桌面应用路线。',
        audience: '适合打算将视觉小说发布为独立应用的项目。',
        href: '/narraleaf/library/main',
        cta: '探索 Desktop',
        tone: 'electron',
        logo: 'electron',
      },
      {
        title: 'NarraLeaf-React',
        description: '面向自有界面嵌入视觉小说场景的 React 播放器。',
        audience: '适合故事服务于更大 Web 体验的产品。',
        href: '/narraleaf-react',
        cta: '探索 React 播放器',
        tone: 'react',
        logo: 'react',
      },
    ],
    embedDemo: {
      eyebrow: 'React 播放器',
      title: 'NarraLeaf-React —— 就地呈现',
      description:
        '与 React 界面共同运行，背景、角色、对白，还有选项均由脚本掌控。',
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
      title: '不妨先从项目概览开始',
      description:
        '自项目概览了解 NarraLeaf 的整体结构；想继续深入？文档随时待命。',
    },
    footer: {
      navigationLabel: '页脚导航',
      projectLabel: '项目',
      docsLabel: '文档',
      sourceLabel: 'GitHub',
      copyright: 'NarraLeaf Project.',
    },
  },
} satisfies Record<Locale, HomePageCopy>;

const editorSlideImages = [
  '/static/img/ui-editor-slides/feature-1.png',
  '/static/img/ui-editor-slides/feature-2.png',
  '/static/img/ui-editor-slides/feature-3.png',
  '/static/img/ui-editor-slides/feature-4.png',
  '/static/img/ui-editor-slides/feature-5.png',
  '/static/img/ui-editor-slides/feature-6.png',
  '/static/img/ui-editor-slides/feature-7.png',
  '/static/img/ui-editor-slides/feature-8.png',
  '/static/img/ui-editor-slides/feature-9.png',
] as const;

const desktopCodeImage = '/static/img/home/desktop-code.png';

const desktopDemoSlideImages = [
  '/static/img/home/desktop-game-dialog.png',
  '/static/img/home/desktop-game-menu.png',
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
                      src="/static/img/home/studio-workspace.png"
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

          <div className="mx-auto mt-8 w-full max-w-[1000px] overflow-visible sm:mt-10">
            <UiEditorSlideshow
              slides={editorSlideImages.map((src, index) => ({
                src,
                alt: copy.editorIntro.slideAlts[index],
              }))}
              labels={copy.editorIntro.slideControls}
            />
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
                src={siteIconPath}
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
