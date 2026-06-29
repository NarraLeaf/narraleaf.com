import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { docsRoute } from '@/lib/shared';
import { type Locale, localizedPath } from '@/lib/i18n';
import { UiEditorSlideshow } from './ui-editor-slideshow';
import { ProjectModelTabs, type ProjectModelTabCopy } from './project-model-tabs';
import {
  HighlightedName,
  ProductLogo,
  type ProjectLogoKind,
  type ProjectTone,
  projectToneStyle,
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

type EmbedDemoCopy = SectionCopy & {
  code: string[];
};

type HomePageCopy = {
  hero: HeroCopy;
  solutionIntro: SectionCopy;
  editorIntro: EditorIntroCopy;
  projectModelIntro: SectionCopy;
  projectModelTabs: ProjectModelTabCopy[];
  solutions: SolutionCard[];
  embedDemo: EmbedDemoCopy;
};

const homeCopy = {
  en: {
    hero: {
      eyebrow: 'NarraLeaf Project',
      title: 'Visual novels, built like modern software.',
      description:
        'NarraLeaf Project connects visual authoring, desktop application delivery, and React embedding in one ecosystem for story-driven experiences.',
      primaryCta: 'Explore Project',
      secondaryCta: 'Read Docs',
      imageAlt: 'NarraLeaf Studio editor showing a visual novel project workspace',
    },
    solutionIntro: {
      eyebrow: 'Project Paths',
      title: 'Start with where your story will live.',
      description:
        'Some stories need a visual workspace first. Some are the whole desktop app. Some live inside a React product. NarraLeaf Project keeps those choices connected by the same story model.',
    },
    editorIntro: {
      eyebrow: 'Studio Path',
      title: 'Explore the NarraLeaf Studio path.',
      description:
        'NarraLeaf Studio is one entry point in the project: a focused workspace for shaping scenes, interfaces, and assets visually before the work moves deeper into delivery.',
      cta: 'Explore Studio',
      href: '/studio',
      slideAlts: [
        'NarraLeaf Studio interface editor with a selected menu layout',
        'NarraLeaf Studio workspace showing the visual novel production editor',
        'NarraLeaf Studio dark editor workspace with project panels',
      ],
      slideControls: {
        previous: 'Previous interface editor feature',
        next: 'Next interface editor feature',
        goToSlide: 'Show interface editor feature',
        openPreview: 'Open enlarged interface editor feature',
        closePreview: 'Close enlarged interface editor feature',
      },
    },
    projectModelIntro: {
      eyebrow: 'Project Model',
      title: 'A project model for visual novels.',
      description:
        'NarraLeaf Project separates the authoring room, the desktop application, and the embedded player so each project can own the layer it is actually good at.',
    },
    projectModelTabs: [
      {
        label: 'Studio',
        name: 'NarraLeaf Studio',
        tone: 'studio',
        logo: 'narraleaf',
        title: 'NarraLeaf Studio is the authoring room.',
        description:
          'Studio is for the moment when the project is still being shaped: what scenes exist, how the interface behaves, which assets belong together, and what the production state looks like.',
        points: [
          'Map story flow before it turns into application code.',
          'Keep scene structure, interface states, and asset decisions visible together.',
          'Hand off naturally when the project needs runtime or delivery work.',
        ],
      },
      {
        label: 'NarraLeaf',
        name: 'NarraLeaf',
        tone: 'electron',
        logo: 'electron',
        title: 'NarraLeaf turns the story into an application.',
        description:
          'This path is for visual novels that need to behave like real desktop software: windows, saves, menus, routes, packaging, platform delivery, and a renderer that knows where the story lives.',
        points: [
          'Own the window, save system, menus, packaging, and renderer in one application path.',
          'Keep Electron app decisions next to NarraLeaf runtime decisions.',
          'Use it when the visual novel itself is the shipped product.',
        ],
      },
      {
        label: 'NarraLeaf-React',
        name: 'NarraLeaf-React',
        tone: 'react',
        logo: 'react',
        title: 'NarraLeaf-React lives inside your product.',
        description:
          'Use this path when the visual novel is part of a site, product page, campaign, documentation experience, or custom interface. The player owns story playback; React owns everything around it.',
        points: [
          'Mount the player inside an existing React route or product surface.',
          'Let NarraLeaf handle scene playback while your app keeps layout, data, and design system.',
          'Use it for sites, campaigns, docs, or products where the story is one part of the interface.',
        ],
      },
    ],
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description:
          'A visual workspace for writing story flow, building interfaces, and organizing assets.',
        audience: 'Best when creators need to start from content and production flow.',
        href: '/studio',
        cta: 'Run Studio',
        tone: 'studio',
        logo: 'narraleaf',
      },
      {
        title: 'NarraLeaf',
        description: 'A desktop application toolchain for runtime, renderer, CLI, and app delivery.',
        audience: 'Best when the story needs to ship as a complete cross-platform application.',
        href: '/narraleaf/library/main',
        cta: 'app.launch()',
        tone: 'electron',
        logo: 'electron',
      },
      {
        title: 'NarraLeaf-React',
        description: 'A React player for embedding visual novel playback in your own product UI.',
        audience: 'Best when NarraLeaf is one part of a larger web application.',
        href: '/narraleaf-react',
        cta: '<Player story={story} />',
        tone: 'react',
        logo: 'react',
      },
    ],
    embedDemo: {
      eyebrow: 'React Player',
      title: 'A closer look at NarraLeaf-React.',
      description:
        'Drop the player into an existing React page, then let the story script handle the scene, Narra, styled dialogue, and choices inside the same frame.',
      code: [
        'introScene.background.char("/room.jpg", new FadeIn(600)),',
        '',
        'narraImage.show({ duration: 600 }),',
        'narraImage.transform(Transform.create().position({ yoffset: -24 }).commit({ duration: 260 })),',
        '',
        'narrator.say`This player is mounted inside the page.`',
        '',
        'narra.say`Text can carry ${c("color", "#7dd3fc")}.`,',
        '',
        'Menu.prompt("What should happen next?")',
        '  .choose("Change the background", [',
        '    narra.say`Sure. Let me step out first.`,',
        '    narraImage.hide({ duration: 500 }),',
        '    introScene.jumpTo(featureScene, new Dissolve(500)),',
        '  ]),',
      ],
    },
  },
  zh: {
    hero: {
      eyebrow: 'NarraLeaf Project',
      title: '用现代软件方式构建视觉小说',
      description:
        'NarraLeaf Project 将可视化创作、桌面应用交付和 React 嵌入放在同一个生态里，用于构建以故事为核心的互动体验。',
      primaryCta: '探索项目',
      secondaryCta: '阅读文档',
      imageAlt: 'NarraLeaf Studio 编辑器中的视觉小说项目工作区',
    },
    solutionIntro: {
      eyebrow: '项目路径',
      title: '从故事最终要去的地方开始。',
      description:
        '有的项目先需要一个可视化制作空间，有的最终就是桌面应用，有的只是 React 产品中的一段体验。NarraLeaf Project 用同一套故事模型把这些选择连在一起。',
    },
    editorIntro: {
      eyebrow: 'Studio 路径',
      title: '探索 NarraLeaf Studio 路径',
      description:
        'NarraLeaf Studio 是 Project 的一个入口：用集中的工作区可视化组织场景、界面和素材，然后在需要时继续进入交付流程。',
      cta: 'Explore Studio',
      href: '/studio',
      slideAlts: [
        'NarraLeaf Studio 界面编辑器中选中菜单布局的画面',
        'NarraLeaf Studio 可视化制作工作区的画面',
        'NarraLeaf Studio 暗色编辑器工作区的画面',
      ],
      slideControls: {
        previous: '上一张界面编辑器特性',
        next: '下一张界面编辑器特性',
        goToSlide: '显示界面编辑器特性',
        openPreview: '放大界面编辑器特性',
        closePreview: '关闭放大的界面编辑器特性',
      },
    },
    projectModelIntro: {
      eyebrow: '项目模型',
      title: '为视觉小说而设计的项目模型。',
      description:
        'NarraLeaf Project 把创作空间、桌面应用和嵌入式播放器拆成各自清楚的层，让每个项目负责自己真正擅长的部分。',
    },
    projectModelTabs: [
      {
        label: 'Studio',
        name: 'NarraLeaf Studio',
        tone: 'studio',
        logo: 'narraleaf',
        title: 'NarraLeaf Studio 是创作现场。',
        description:
          'Studio 面向项目还在被塑形的阶段：有哪些场景，界面如何表现，素材如何归类，制作状态推进到哪里。这些决定应该先有一个可以看见的地方。',
        points: [
          '在进入应用代码前，先把故事流和制作状态铺开。',
          '场景结构、界面状态和素材判断可以放在同一张工作台上。',
          '当项目需要运行时或交付时，再自然进入后续路径。',
        ],
      },
      {
        label: 'NarraLeaf',
        name: 'NarraLeaf',
        tone: 'electron',
        logo: 'electron',
        title: 'NarraLeaf 把故事变成应用。',
        description:
          '这条路径面向需要像桌面软件一样工作的视觉小说：窗口、存档、菜单、路由、打包、平台交付，以及知道故事应该放在哪里的 renderer。',
        points: [
          '把窗口、存档、菜单、打包和 renderer 放进同一条应用路径。',
          '让 Electron 的应用决策和 NarraLeaf 的 runtime 决策靠在一起。',
          '适合视觉小说本身就是最终交付产品的项目。',
        ],
      },
      {
        label: 'NarraLeaf-React',
        name: 'NarraLeaf-React',
        tone: 'react',
        logo: 'react',
        title: 'NarraLeaf-React 放在你的产品里。',
        description:
          '当视觉小说是网站、产品页、活动页、文档体验或自定义界面的一部分时，使用这条路径。播放器负责故事播放，React 继续负责它周围的一切。',
        points: [
          '把播放器挂进现有 React 路由或产品界面里。',
          'NarraLeaf 负责场景播放，外层应用继续负责布局、数据和设计系统。',
          '适合网站、活动页、文档或产品中需要一段视觉小说体验的场景。',
        ],
      },
    ],
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description: '用于编写故事流程、制作界面和组织素材的可视化工作区。',
        audience: '适合需要从内容和制作流程开始的创作者。',
        href: '/studio',
        cta: 'Run Studio',
        tone: 'studio',
        logo: 'narraleaf',
      },
      {
        title: 'NarraLeaf',
        description: '用于 runtime、renderer、CLI 和应用交付的桌面应用工具链。',
        audience: '适合需要把故事交付成完整跨平台应用的项目。',
        href: '/narraleaf/library/main',
        cta: 'app.launch()',
        tone: 'electron',
        logo: 'electron',
      },
      {
        title: 'NarraLeaf-React',
        description: '用于把视觉小说播放嵌入自有产品 UI 的 React 播放器。',
        audience: '适合 NarraLeaf 只是更大 Web 应用一部分的项目。',
        href: '/narraleaf-react',
        cta: '<Player story={story} />',
        tone: 'react',
        logo: 'react',
      },
    ],
    embedDemo: {
      eyebrow: 'React 播放器',
      title: '进一步看看 NarraLeaf-React。',
      description:
        '把播放器放进现有 React 页面，再让故事脚本在同一个画面里处理场景、Narra 立绘、带样式的对白和选项。',
      code: [
        'introScene.background.char("/room.jpg", new FadeIn(600)),',
        '',
        'narraImage.show({ duration: 600 }),',
        'narraImage.transform(Transform.create().position({ yoffset: -24 }).commit({ duration: 260 })),',
        '',
        'narrator.say`播放器就嵌在这个页面里。`',
        '',
        'narra.say`文本里可以有 ${c("颜色", "#7dd3fc")}。`,',
        '',
        'Menu.prompt("接下来试哪一步？")',
        '  .choose("切换背景", [',
        '    narra.say`好，我先退场。`,',
        '    narraImage.hide({ duration: 500 }),',
        '    introScene.jumpTo(featureScene, new Dissolve(500)),',
        '  ]),',
      ],
    },
  },
} satisfies Record<Locale, HomePageCopy>;

const editorSlideImages = [
  '/static/img/ui-editor-slides/feature-1.png',
  '/static/img/ui-editor-slides/feature-2.png',
  '/static/img/ui-editor-slides/feature-3.png',
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

export default async function HomePage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params;
  const locale = lang as Locale;
  const copy = homeCopy[locale];
  const docsUrl = (path = '') => localizedPath(`${docsRoute}${path}`, locale);

  return (
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/project"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 py-3 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                {copy.hero.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={docsUrl()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 px-5 py-3 text-sm font-medium transition-colors duration-200 hover:bg-fd-card dark:border-white/10"
              >
                {copy.hero.secondaryCta}
                <BookOpen className="size-4" />
              </Link>
            </div>
          </div>

          <div className="group relative z-20 -mx-6 h-[330px] overflow-visible sm:h-[420px] lg:mx-0 lg:h-[560px] lg:min-w-0 lg:flex-1 xl:h-[620px]">
            <div className="absolute top-4 right-0 left-6 h-[92%] sm:left-10 lg:top-1/2 lg:right-0 lg:left-0 lg:h-[540px] lg:-translate-y-1/2 xl:h-[600px]">
              <div className="absolute top-0 left-1/2 h-full w-full -translate-x-1/2 transition-[width] duration-[350ms] ease-out group-hover:w-[96vw] sm:group-hover:w-[92vw] lg:group-hover:w-[965px] xl:group-hover:w-[1072px]">
                <div className="h-full origin-center rotate-[-1.5deg] transition-transform duration-[350ms] ease-out will-change-transform group-hover:rotate-0">
                  <div className="pointer-events-none absolute top-1/2 left-1/2 h-[115%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),rgba(34,211,238,0.08)_42%,transparent_70%)] blur-2xl transition-opacity duration-[350ms] group-hover:opacity-80" />
                  <div className="relative h-full overflow-hidden rounded-xl border border-cyan-400/30 bg-[#05090d] shadow-[0_22px_60px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
                    <Image
                      src="/static/img/app.png"
                      alt={copy.hero.imageAlt}
                      fill
                      priority
                      sizes="(min-width: 1280px) 1120px, (min-width: 1024px) 980px, 118vw"
                      className="object-cover object-left-top"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-fd-background/10" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#05090d]/65 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-cyan-300/25" />
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
                  style={projectToneStyle(solution.tone)}
                  className="flex h-full flex-col rounded-xl border border-black/10 bg-fd-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[color:var(--project-accent-border)] dark:border-white/10"
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
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div className="max-w-xl space-y-7">
            <div className="space-y-4">
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-transparent px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-fd-card dark:border-white/10"
            >
              {copy.editorIntro.cta}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <UiEditorSlideshow
            slides={editorSlideImages.map((src, index) => ({
              src,
              alt: copy.editorIntro.slideAlts[index],
            }))}
            labels={copy.editorIntro.slideControls}
          />
        </div>
      </section>

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

      <NarraLeafReactDemo copy={copy.embedDemo} locale={locale} />
    </main>
  );
}
