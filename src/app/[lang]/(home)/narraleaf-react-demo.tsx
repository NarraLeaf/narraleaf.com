import { type Locale, localizedPath } from '@/lib/i18n';
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
  const emphasizedLines = new Set(Array.from({ length: 12 }, (_, index) => index + 12));

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

  return (
    <section className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            <HighlightedName text={copy.title} name="NarraLeaf-React" tone="react" />
          </h2>
          <p className="text-base leading-7 text-fd-muted-foreground sm:text-lg">
            {copy.description}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <ScriptPreview copy={copy} />

          <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/10 bg-fd-card p-2 shadow-sm dark:border-white/10">
            <iframe
              src={localizedPath('/nlr-demo-frame', locale)}
              title="NarraLeaf-React embedded demo"
              className="h-full w-full rounded-xl bg-[#eef8fb]"
              loading="lazy"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
