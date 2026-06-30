import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { type Locale, localizedPath } from '@/lib/i18n';
import { DemoPreviewFrame } from './demo-preview-frame';
import { LayeredDemoShowcase } from './layered-demo-showcase';
import { HighlightedName } from './project-identity';

type EmbedDemoCopy = {
  title: string;
  description: string;
  code: string[];
};

type NarraLeafReactDemoProps = {
  copy: EmbedDemoCopy;
  locale: Locale;
};

function syntaxHighlight(line: string) {
  const parts = line.split(
    /(`[^`]*`|"[^"]*"|'[^']*'|\b(?:const|new|from|import|export|function|return)\b|\b(?:Story|Scene|Character|Image|Menu|Transform|FadeIn|Dissolve)\b|\b(?:introScene|featureScene|narraImage|narrator|narra)\b|\.[A-Za-z_][A-Za-z0-9_]*|\/\/.*$)/g,
  );

  return parts.map((part, index) => {
    if (!part) return null;
    let className = 'text-slate-300';

    if (/^`|"|'/.test(part)) {
      className = 'text-emerald-300';
    } else if (/^(const|new|from|import|export|function|return)$/.test(part)) {
      className = 'text-sky-300';
    } else if (/^(Story|Scene|Character|Image|Menu|Transform|FadeIn|Dissolve)$/.test(part)) {
      className = 'text-cyan-200';
    } else if (/^(introScene|featureScene|narraImage|narrator|narra)$/.test(part)) {
      className = 'text-violet-200';
    } else if (/^\./.test(part)) {
      className = 'text-amber-200';
    } else if (/^\/\//.test(part)) {
      className = 'text-slate-500';
    }

    return (
      <span key={`${part}-${index}`} className={className}>
        {part}
      </span>
    );
  });
}

function ScriptPreview(props: { copy: EmbedDemoCopy }) {
  const { copy } = props;
  const emphasizedLines = new Set(Array.from({ length: 9 }, (_, index) => index + 6));

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#071016] shadow-[0_24px_70px_rgba(8,47,73,0.24)] ring-1 ring-cyan-300/20 dark:shadow-[0_24px_80px_rgba(0,0,0,0.55)] dark:ring-cyan-200/15">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <pre className="overflow-x-auto overflow-y-hidden p-0 font-mono text-[12px] leading-5 text-slate-200">
        <code className="block min-w-max py-3">
          {copy.code.map((line, index) => {
            const lineNumber = index + 1;

            return (
              <span
                key={`${lineNumber}-${line}`}
                className={[
                  'block px-4',
                  emphasizedLines.has(lineNumber) ? 'bg-cyan-300/10' : '',
                ].join(' ')}
              >
                <span className="mr-4 inline-block w-5 select-none text-right text-slate-600">
                  {lineNumber}
                </span>
                {syntaxHighlight(line)}
                {'\n'}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

export function NarraLeafReactDemo(props: NarraLeafReactDemoProps) {
  const { copy, locale } = props;
  const isZh = locale === 'zh';
  const docsHref = localizedPath('/docs/narraleaf-react', locale);
  const docsLabel = isZh ? '阅读 React 文档' : 'Read React Docs';

  return (
    <section className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              <HighlightedName text={copy.title} name="NarraLeaf-React" tone="react" />
            </h2>
            <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
              {copy.description}
            </p>
          </div>

          <Link
            href={docsHref}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-black/10 px-5 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-fd-card dark:border-white/10"
          >
            {docsLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <LayeredDemoShowcase
          code={<ScriptPreview copy={copy} />}
          demo={
            <DemoPreviewFrame
              src={localizedPath('/nlr-demo-frame', locale)}
              title="NarraLeaf-React embedded demo"
              expandLabel={isZh ? '放大演示' : 'Expand demo'}
              collapseLabel={isZh ? '收起演示' : 'Collapse demo'}
            />
          }
          codeLabel={isZh ? '代码示例窗口' : 'Code example window'}
          demoLabel={isZh ? '实时演示窗口' : 'Live demo window'}
        />
      </div>
    </section>
  );
}
