import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Code2,
  GitBranch,
  Layers3,
  Package,
  PenTool,
  Rocket,
  TerminalSquare,
} from 'lucide-react';
import { docsRoute } from '@/lib/shared';
import { type Locale, localizedPath } from '@/lib/i18n';

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type TextCard = {
  title: string;
  description: string;
};

type SolutionCard = IconCard & {
  href: string;
  audience: string;
  cta: string;
  heroLabel: string;
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

type HomePageCopy = {
  hero: HeroCopy;
  principlesIntro: SectionCopy;
  principles: IconCard[];
  capabilitiesIntro: SectionCopy;
  capabilities: IconCard[];
  solutionsIntro: SectionCopy;
  solutions: SolutionCard[];
  workflowIntro: SectionCopy;
  workflowSteps: TextCard[];
  ecosystemIntro: SectionCopy;
  ecosystemProjects: IconCard[];
  ecosystemGithubCta: string;
  getStarted: SectionCopy;
};

// const heroPillars = [
//   'Native web tech.',
//   'TypeScript ecosystem.',
//   'Team-ready workflows.',
// ] as const;

const homeCopy = {
  en: {
    hero: {
      eyebrow: 'NarraLeaf Project',
      title: 'Visual novels, built like modern software.',
      description:
        'Choose a zero-code studio, a desktop toolchain, or a React player. NarraLeaf keeps visual novel work light, structured, and ready to scale.',
      primaryCta: 'Explore Solutions',
      secondaryCta: 'Read Docs',
      imageAlt: 'NarraLeaf Studio editor showing a visual novel project workspace',
    },
    principlesIntro: {
      eyebrow: 'Why NarraLeaf',
      title: 'A modern path for a genre that deserves better tooling.',
      description:
        'NarraLeaf is not locked to one workflow. It gives teams a lighter, simpler, and more professional way to build visual novels across different technical paths.',
    },
    principles: [
      {
        title: 'Lighter',
        description:
          'Build on native web technologies instead of carrying a heavyweight rendering stack everywhere.',
        icon: Layers3,
      },
      {
        title: 'Simpler',
        description:
          'A simple, approachable editor keeps the path from prototyping to polished publishing as short as possible.',
        icon: PenTool,
      },
      {
        title: 'More Professional',
        description:
          'Work with version control, linting, packaging, and team collaboration like a modern software project.',
        icon: GitBranch,
      },
    ],
    capabilitiesIntro: {
      eyebrow: 'Built For Modern Teams',
      title: 'Publish the story without complex, heavyweight project maintenance.',
      description:
        'NarraLeaf brings modern software expectations into visual novel development: structure, reuse, clear tooling boundaries, and collaboration that can survive scale.',
    },
    capabilities: [
      {
        title: 'Designed for TypeScript',
        description:
          "Gain access to TypeScript's broad and powerful language features, tooling, and package ecosystem.",
        icon: Code2,
      },
      {
        title: 'Narrative building blocks',
        description:
          'Compose scenes, interfaces, reusable components, and branching logic without losing structure.',
        icon: Boxes,
      },
      {
        title: 'Cross-platform thinking',
        description:
          'One codebase, three platforms. Iterate and distribute the application quickly.',
        icon: Rocket,
      },
      {
        title: 'Git-friendly collaboration',
        description:
          'Work in branches, review changes, and ship with the same workflows used across software teams.',
        icon: GitBranch,
      },
    ],
    solutionsIntro: {
      eyebrow: 'Choose Your Approach',
      title: 'Three solutions, one project philosophy.',
      description:
        'Pick the workflow that matches your team today without giving up the broader NarraLeaf ecosystem.',
    },
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description:
          'An all-in-one visual novel IDE for creators, bringing story writing, interface work, assets, and development into one workspace.',
        audience: 'No code required. Start writing the story immediately.',
        href: '/studio',
        cta: 'Start with Studio',
        heroLabel: 'Zero-code IDE',
        icon: PenTool,
      },
      {
        title: 'NarraLeaf',
        description:
          'Build cross-platform visual novel applications on Electron with a Node.js library and CLI.',
        audience:
          'Developers stay focused on higher-level application logic and interface work while the engine handles the game lifecycle.',
        href: '/narraleaf/library/main',
        cta: 'Build with NarraLeaf',
        heroLabel: 'Complete desktop solution',
        icon: Package,
      },
      {
        title: 'NarraLeaf-React',
        description:
          'A lightweight React player for customizing every part of the application as deeply as you need.',
        audience:
          'The player covers everything needed for presentation while leaving room for high-freedom customization.',
        href: '/narraleaf-react',
        cta: 'Embed with React',
        heroLabel: 'Lightweight React player',
        icon: Code2,
      },
    ],
    workflowIntro: {
      eyebrow: 'From Prototype To Production',
      title: 'One journey, more than one tool.',
      description:
        'The NarraLeaf advantage is continuity: move from experimentation to runtime implementation to delivery without switching philosophies.',
    },
    workflowSteps: [
      {
        title: 'Prototype',
        description:
          'Shape scenes, logic, and presentation quickly without committing too early to one workflow.',
      },
      {
        title: 'Build',
        description:
          'Move into runtime code, renderer details, or React embedding when the project needs it.',
      },
      {
        title: 'Organize',
        description:
          'Keep assets, interfaces, and narrative systems in a structure that can grow with the team.',
      },
      {
        title: 'Ship',
        description:
          'Package, document, and deliver with tooling that treats visual novels like real software products.',
      },
    ],
    ecosystemIntro: {
      eyebrow: 'Ecosystem',
      title: 'A broader toolkit is taking shape around the core project.',
      description:
        'NarraLeaf Project is growing focused tools for asset packaging, audio, UI composition, and scripting while keeping the main three solutions clear.',
    },
    ecosystemProjects: [
      {
        title: 'CharPack',
        description: 'Character variation packaging that removes repeated image parts for lighter delivery.',
        icon: Package,
      },
      {
        title: 'Sound',
        description: 'A compact HTML audio layer with channels, playback control, and web game-friendly APIs.',
        icon: TerminalSquare,
      },
      {
        title: 'NarraLang',
        description: 'An expressive scripting DSL for structured stories, dialogue, modifiers, and flow.',
        icon: BookOpen,
      },
      {
        title: 'NarraLang VSC',
        description: 'VS Code editor support for writing NarraLang scripts with a smoother authoring loop.',
        icon: Code2,
      },
    ],
    ecosystemGithubCta: 'Explore the GitHub organization',
    getStarted: {
      eyebrow: 'Get Started',
      title: 'Choose the NarraLeaf path that matches how your team wants to build.',
      description:
        'Start with a zero-code studio, build the full application stack, or embed a lightweight player into your React product. The project stays coherent either way.',
    },
  },
  zh: {
    hero: {
      eyebrow: 'NarraLeaf Project',
      title: '用现代软件方式构建视觉小说',
      description:
        '选择零代码 Studio、桌面工具链，或 React 播放器NarraLeaf 让视觉小说开发保持轻量、有结构，并且能够随项目规模成长',
      primaryCta: '探索方案',
      secondaryCta: '阅读文档',
      imageAlt: 'NarraLeaf Studio 编辑器中的视觉小说项目工作区',
    },
    principlesIntro: {
      eyebrow: '为什么选择 NarraLeaf',
      title: '值得拥有更现代的工具路径',
      description:
        'NarraLeaf 不锁进单一工作流它让团队可以沿着不同技术路径，以更轻量、更简单、更专业的方式构建视觉小说',
    },
    principles: [
      {
        title: '更轻量',
        description: '基于原生 Web 技术构建，而不是在每个项目里都背负沉重的渲染技术栈',
        icon: Layers3,
      },
      {
        title: '更简单',
        description: '简单易用的编辑器让原型设计到打磨发布的速度尽可能地缩减',
        icon: PenTool,
      },
      {
        title: '更专业',
        description: '像现代软件项目一样使用版本控制、Lint、打包和团队协作流程',
        icon: GitBranch,
      },
    ],
    capabilitiesIntro: {
      eyebrow: '为现代团队构建',
      title: '发布故事，无需复杂且笨重的项目维护',
      description:
        'NarraLeaf 把结构化、复用、清晰的工具边界和可扩展协作等现代软件预期带入视觉小说开发',
    },
    capabilities: [
      {
        title: 'TypeScript 设计',
        description: '获得属于 TypeScript 的庞大而强大的语言特性、工具链和包生态',
        icon: Code2,
      },
      {
        title: '叙事构建模块',
        description: '组合场景、界面、可复用组件和分支逻辑，同时保持项目结构清晰',
        icon: Boxes,
      },
      {
        title: '跨平台思路',
        description: '一份代码，三个平台。将应用快速迭代和分发',
        icon: Rocket,
      },
      {
        title: '适合 Git 协作',
        description: '使用分支、代码审查和发布流程，以软件团队熟悉的方式推进项目',
        icon: GitBranch,
      },
    ],
    solutionsIntro: {
      eyebrow: '选择你的路径',
      title: '三种方案，一套项目理念',
      description: '选择最适合当前团队的工作流，同时保留进入完整 NarraLeaf 生态的空间',
    },
    solutions: [
      {
        title: 'NarraLeaf Studio',
        description: '面向创作者的一体化视觉小说IDE，将故事、界面、资产和开发放进同一个工作区',
        audience: '无需代码，从编写故事立即开始',
        href: '/studio',
        cta: '从 Studio 开始',
        heroLabel: '零代码 IDE',
        icon: PenTool,
      },
      {
        title: 'NarraLeaf',
        description: '使用 Node.js 库与 CLI 开发基于Electron的跨平台视觉小说应用',
        audience: '开发者专注于更高级的应用逻辑和界面，引擎处理所有繁杂的游戏生命',
        href: '/narraleaf/library/main',
        cta: '使用 NarraLeaf 构建',
        heroLabel: '完整桌面解决方案',
        icon: Package,
      },
      {
        title: 'NarraLeaf-React',
        description: '轻量级 React 播放器，最大程度自定义应用的一切',
        audience: '播放器包揽表演所需要的一切，并提供高自由度的自定义方式',
        href: '/narraleaf-react',
        cta: '嵌入 React 项目',
        heroLabel: '轻量 React 播放器',
        icon: Code2,
      },
    ],
    workflowIntro: {
      eyebrow: '从原型到生产',
      title: '一段旅程，不止一种工具',
      description:
        'NarraLeaf 的优势在于连续性：从实验、运行时实现到最终交付，都可以沿着同一套理念推进',
    },
    workflowSteps: [
      {
        title: '原型',
        description: '快速塑造场景、逻辑和呈现方式，不必过早绑定到某一种工作流',
      },
      {
        title: '构建',
        description: '当项目需要时，进入运行时代码、渲染细节或 React 嵌入',
      },
      {
        title: '组织',
        description: '让素材、界面和叙事系统保持可以随团队成长的结构',
      },
      {
        title: '发布',
        description: '用把视觉小说当作真实软件产品的工具链来打包、编写文档并交付',
      },
    ],
    ecosystemIntro: {
      eyebrow: '生态系统',
      title: '围绕核心项目，更完整的工具集正在形成',
      description:
        'NarraLeaf Project 正在发展面向素材打包、音频、UI 组合和脚本编写的专用工具，同时让三条主要方案保持清晰',
    },
    ecosystemProjects: [
      {
        title: 'CharPack',
        description: '角色差分打包工具，通过移除重复图像部分来减小交付体积',
        icon: Package,
      },
      {
        title: 'Sound',
        description: '紧凑的 HTML 音频层，提供通道、播放控制和适合 Web 游戏的 API',
        icon: TerminalSquare,
      },
      {
        title: 'NarraLang',
        description: '富有表达力的脚本 DSL，用于结构化故事、对话、修饰符和流程',
        icon: BookOpen,
      },
      {
        title: 'NarraLang VSC',
        description: '面向 NarraLang 脚本的 VS Code 编辑器支持，让创作循环更顺畅',
        icon: Code2,
      },
    ],
    ecosystemGithubCta: '探索 GitHub 组织',
    getStarted: {
      eyebrow: '开始使用',
      title: '选择符合团队构建方式的 NarraLeaf 路径',
      description:
        '从零代码 Studio 开始，构建完整应用栈，或把轻量播放器嵌入 React 产品。无论哪条路径，项目理念都保持一致',
    },
  },
} satisfies Record<Locale, HomePageCopy>;

function SectionIntro(props: { eyebrow: string; title: string; description: string }) {
  const { eyebrow, title, description } = props;

  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-sm font-medium tracking-[0.18em] text-fd-muted-foreground uppercase">
        {eyebrow}
      </p>
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
      <section className="relative border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_48%,rgba(34,211,238,0.18),transparent_56%)] dark:bg-[radial-gradient(ellipse_at_78%_48%,rgba(34,211,238,0.16),transparent_58%)]" />
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
                href="#solutions"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-5 py-3 text-sm font-medium text-fd-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
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

            {/* <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fd-muted-foreground">
              {heroPillars.map((pillar) => (
                <span key={pillar}>{pillar}</span>
              ))}
            </div> */}
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

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            eyebrow={copy.principlesIntro.eyebrow}
            title={copy.principlesIntro.title}
            description={copy.principlesIntro.description}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {copy.principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article
                  key={principle.title}
                  className="border-t border-black/10 pt-5 transition-colors duration-200 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
                >
                  <Icon className="size-5 text-fd-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{principle.title}</h3>
                  <p className="mt-3 text-base leading-7 text-fd-muted-foreground">
                    {principle.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionIntro
            eyebrow={copy.capabilitiesIntro.eyebrow}
            title={copy.capabilitiesIntro.title}
            description={copy.capabilitiesIntro.description}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {copy.capabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article key={capability.title} className="space-y-3">
                  <Icon className="size-5 text-fd-muted-foreground" />
                  <h3 className="text-lg font-semibold tracking-tight">{capability.title}</h3>
                  <p className="text-sm leading-6 text-fd-muted-foreground">{capability.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="solutions" className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            eyebrow={copy.solutionsIntro.eyebrow}
            title={copy.solutionsIntro.title}
            description={copy.solutionsIntro.description}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {copy.solutions.map((solution) => {
              const Icon = solution.icon;

              return (
                <article
                  key={solution.title}
                  className="flex h-full flex-col rounded-xl border border-black/10 bg-fd-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-fd-background">
                      <Icon className="size-5 text-fd-muted-foreground" />
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight">{solution.title}</h3>
                  </div>
                  <p className="mt-6 text-base leading-7 text-fd-muted-foreground">
                    {solution.description}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">{solution.audience}</p>
                  <div className="mt-auto pt-8">
                    <Link
                      href={docsUrl(solution.href)}
                      className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-fd-muted-foreground"
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
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            eyebrow={copy.workflowIntro.eyebrow}
            title={copy.workflowIntro.title}
            description={copy.workflowIntro.description}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {copy.workflowSteps.map((step, index) => {
              return (
                <article
                  key={step.title}
                  className="relative rounded-xl border border-black/10 bg-fd-background/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-fd-card dark:border-white/10"
                >
                  <p className="text-sm text-fd-muted-foreground">0{index + 1}</p>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-fd-muted-foreground">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionIntro
            eyebrow={copy.ecosystemIntro.eyebrow}
            title={copy.ecosystemIntro.title}
            description={copy.ecosystemIntro.description}
          />

          <div className="space-y-4">
            {copy.ecosystemProjects.map((project) => {
              const Icon = project.icon;

              return (
                <article
                  key={project.title}
                  className="flex items-start gap-4 rounded-lg border border-black/10 bg-fd-card/70 p-4 transition-colors duration-200 hover:bg-fd-card dark:border-white/10"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-fd-background">
                    <Icon className="size-5 text-fd-muted-foreground" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{project.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </article>
              );
            })}

            <Link
              href="https://github.com/NarraLeaf"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-fd-muted-foreground"
            >
              {copy.ecosystemGithubCta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="rounded-2xl border border-black/10 bg-fd-card px-6 py-10 shadow-sm dark:border-white/10 sm:px-10 sm:py-12">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium tracking-[0.18em] text-fd-muted-foreground uppercase">
                {copy.getStarted.eyebrow}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {copy.getStarted.title}
              </h2>
              <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
                {copy.getStarted.description}
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 lg:flex-row">
              {copy.solutions.map((solution) => (
                <Link
                  key={solution.title}
                  href={docsUrl(solution.href)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-fd-background dark:border-white/10"
                >
                  {solution.cta}
                  <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
