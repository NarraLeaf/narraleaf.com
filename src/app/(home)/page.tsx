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
import { appDescription, docsRoute } from '@/lib/shared';

type IconCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type SolutionCard = IconCard & {
  href: string;
  audience: string;
  cta: string;
  heroLabel: string;
};

const heroPillars = [
  'Native web tech.',
  'TypeScript ecosystem.',
  'Team-ready workflows.',
] as const;

const principles: IconCard[] = [
  {
    title: 'Lighter',
    description:
      'Build on native web technologies instead of carrying a heavyweight rendering stack everywhere.',
    icon: Layers3,
  },
  {
    title: 'Simpler',
    description:
      'Start from zero-code workflows or drop into code when your project needs deeper control.',
    icon: PenTool,
  },
  {
    title: 'More Professional',
    description:
      'Work with version control, linting, packaging, and team collaboration like a modern software project.',
    icon: GitBranch,
  },
];

const solutions: SolutionCard[] = [
  {
    title: 'NarraLeaf Studio',
    description:
      'A zero-code visual novel IDE for creators who want a guided workflow from drafting to editing.',
    audience: 'For creators and narrative teams who want to move fast before touching code.',
    href: `${docsRoute}/studio`,
    cta: 'Start with Studio',
    heroLabel: 'Zero-code IDE',
    icon: PenTool,
  },
  {
    title: 'NarraLeaf',
    description:
      'A complete desktop solution for developers who want control over runtime, tooling, and delivery.',
    audience: 'For product-minded developers building full visual novel applications.',
    href: `${docsRoute}/narraleaf/library/main`,
    cta: 'Build with NarraLeaf',
    heroLabel: 'Complete desktop solution',
    icon: Package,
  },
  {
    title: 'NarraLeaf-React',
    description:
      'A lightweight React player for embedding visual novel experiences into existing web products.',
    audience: 'For web teams who want visual novel interfaces without leaving the React ecosystem.',
    href: `${docsRoute}/narraleaf-react`,
    cta: 'Embed with React',
    heroLabel: 'Lightweight React player',
    icon: Code2,
  },
];

const capabilities: IconCard[] = [
  {
    title: 'TypeScript-native',
    description: 'Use the same language, tooling, and package ecosystem you already trust on modern teams.',
    icon: Code2,
  },
  {
    title: 'Narrative building blocks',
    description: 'Compose scenes, interfaces, reusable components, and branching logic without losing structure.',
    icon: Boxes,
  },
  {
    title: 'Cross-platform thinking',
    description: 'Move between web and desktop paths without rewriting your entire project philosophy.',
    icon: Rocket,
  },
  {
    title: 'Git-friendly collaboration',
    description: 'Work in branches, review changes, and ship with the same workflows used across software teams.',
    icon: GitBranch,
  },
];

const workflowSteps: IconCard[] = [
  {
    title: 'Prototype',
    description: 'Shape scenes, logic, and presentation quickly without committing too early to one workflow.',
    icon: PenTool,
  },
  {
    title: 'Build',
    description: 'Move into runtime code, renderer details, or React embedding when the project needs it.',
    icon: Code2,
  },
  {
    title: 'Organize',
    description: 'Keep assets, interfaces, and narrative systems in a structure that can grow with the team.',
    icon: Layers3,
  },
  {
    title: 'Ship',
    description: 'Package, document, and deliver with tooling that treats visual novels like real software products.',
    icon: Rocket,
  },
];

const ecosystemProjects: IconCard[] = [
  {
    title: 'CharPack',
    description: 'Character asset compression and optimization for projects that need lighter delivery.',
    icon: Package,
  },
  {
    title: 'Sound',
    description: 'A lightweight modern audio layer for web-based narrative experiences.',
    icon: TerminalSquare,
  },
  {
    title: 'NarraUI',
    description: 'Customizable interface pieces for visual novel presentation on top of NarraLeaf-React.',
    icon: Boxes,
  },
  {
    title: 'NarraLang',
    description: 'A simpler language layer for projects that want less code in narrative authoring.',
    icon: BookOpen,
  },
];

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

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-20 sm:py-24 lg:flex-row lg:items-center lg:gap-20 lg:py-28">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-medium tracking-[0.18em] text-fd-muted-foreground uppercase">
                NarraLeaf Project
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Build visual novels like modern software.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-fd-muted-foreground sm:text-xl">
                {appDescription}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#solutions"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-fd-primary px-5 py-3 text-sm font-medium text-fd-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
              >
                Explore Solutions
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={docsRoute}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium transition-colors duration-200 hover:bg-fd-card dark:border-white/10"
              >
                Read Docs
                <BookOpen className="size-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fd-muted-foreground">
              {heroPillars.map((pillar) => (
                <span key={pillar}>{pillar}</span>
              ))}
            </div>
          </div>

          <div className="w-full max-w-xl lg:ml-auto">
            <div className="relative overflow-hidden rounded-4xl border border-black/10 bg-fd-card shadow-sm transition-transform duration-300 hover:-translate-y-1 dark:border-white/10">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
              <div className="space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between text-xs tracking-[0.18em] text-fd-muted-foreground uppercase">
                  <span>One project</span>
                  <span>Three ways to build</span>
                </div>

                <div className="rounded-2xl border border-black/10 bg-fd-background/80 p-5 transition-colors duration-200 dark:border-white/10">
                  <p className="text-sm text-fd-muted-foreground">NarraLeaf Project</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-balance">
                    One narrative system. Three ways to ship.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {solutions.map((solution) => {
                    const Icon = solution.icon;

                    return (
                      <div
                        key={solution.title}
                        className="rounded-2xl border border-black/10 bg-fd-background/70 p-4 transition-all duration-200 hover:border-black/20 hover:bg-fd-background dark:border-white/10 dark:hover:border-white/20"
                      >
                        <Icon className="size-4 text-fd-muted-foreground" />
                        <p className="mt-4 text-sm font-medium">{solution.title}</p>
                        <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                          {solution.heroLabel}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2">
                  {['Main', 'Renderer', 'CLI'].map((module) => (
                    <span
                      key={module}
                      className="rounded-full border border-black/10 px-3 py-1 text-xs text-fd-muted-foreground transition-colors duration-200 hover:bg-fd-background dark:border-white/10"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            eyebrow="Why NarraLeaf"
            title="A modern path for a genre that deserves better tooling."
            description="NarraLeaf is not trying to be a single all-purpose engine. It gives teams a lighter, simpler, and more professional way to build visual novels across different technical paths."
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            {principles.map((principle) => {
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

      <section id="solutions" className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            eyebrow="Choose Your Approach"
            title="Three solutions, one project philosophy."
            description="Pick the workflow that matches your team today without giving up the broader NarraLeaf ecosystem."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon;

              return (
                <article
                  key={solution.title}
                  className="flex h-full flex-col rounded-[1.75rem] border border-black/10 bg-fd-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-fd-background">
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
                      href={solution.href}
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
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <SectionIntro
            eyebrow="Built For Modern Teams"
            title="The point is not just to ship a story. It is to keep the project healthy while it grows."
            description="NarraLeaf carries the expectations of serious software projects into visual novel development: structure, reuse, clear tooling boundaries, and collaboration that does not collapse as the project scales."
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {capabilities.map((capability) => {
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

      <section className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <SectionIntro
            eyebrow="From Prototype To Production"
            title="A homepage for the whole journey, not just one tool."
            description="The NarraLeaf advantage is continuity. You can move from experimentation to runtime implementation to delivery without switching to a completely different philosophy."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="relative rounded-3xl border border-black/10 bg-fd-background/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:bg-fd-card dark:border-white/10"
                >
                  <p className="text-sm text-fd-muted-foreground">0{index + 1}</p>
                  <Icon className="mt-5 size-5 text-fd-muted-foreground" />
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
            eyebrow="Ecosystem"
            title="A broader toolkit is taking shape around the core project."
            description="NarraLeaf Project is growing into an ecosystem of focused tools for assets, audio, UI customization, and language design. The homepage should hint at that breadth without letting it overpower the main three solutions."
          />

          <div className="space-y-4">
            {ecosystemProjects.map((project) => {
              const Icon = project.icon;

              return (
                <article
                  key={project.title}
                  className="flex items-start gap-4 rounded-2xl border border-black/10 bg-fd-card/70 p-4 transition-colors duration-200 hover:bg-fd-card dark:border-white/10"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-fd-background">
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
              Explore the GitHub organization
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="rounded-4xl border border-black/10 bg-fd-card px-6 py-10 shadow-sm dark:border-white/10 sm:px-10 sm:py-12">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium tracking-[0.18em] text-fd-muted-foreground uppercase">
                Get Started
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Choose the NarraLeaf path that matches how your team wants to build.
              </h2>
              <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
                Start with a zero-code studio, build the full application stack, or embed a
                lightweight player into your React product. The project stays coherent either way.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 lg:flex-row">
              {solutions.map((solution) => (
                <Link
                  key={solution.title}
                  href={solution.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-fd-background dark:border-white/10"
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
