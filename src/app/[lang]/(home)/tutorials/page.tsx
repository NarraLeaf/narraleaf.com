import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import { isLocale } from '@/lib/i18n';
import { landingMetadata } from '@/lib/seo';
import {
  bilibiliCollectionUrl,
  formatClock,
  tutorialSeries,
  tutorialUrl,
  tutorialsCopy,
  youtubePlaylistUrl,
} from '@/lib/tutorials';

export default async function TutorialsIndexPage(props: PageProps<'/[lang]/tutorials'>) {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  const copy = tutorialsCopy[lang];
  const groups = tutorialSeries(lang);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:py-20">
      <header className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
        <p className="text-lg leading-8 text-fd-muted-foreground">{copy.description}</p>
      </header>

      {groups.length === 0 ? (
        <p className="mt-12 text-fd-muted-foreground">{copy.empty}</p>
      ) : (
        groups.map(({ series, episodes }) => (
          <section key={series.id} aria-labelledby={`series-${series.id}`} className="mt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 id={`series-${series.id}`} className="text-2xl font-semibold tracking-tight">
                {series.title[lang]}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                {lang === 'zh' && series.bilibili ? (
                  <a
                    href={bilibiliCollectionUrl(series.bilibili)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                  >
                    <ExternalLink className="size-4" />
                    {copy.collection}
                  </a>
                ) : null}
                <a
                  href={youtubePlaylistUrl(series.playlist[lang])}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  <ExternalLink className="size-4" />
                  {copy.playlist}
                </a>
              </div>
            </div>

            <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {episodes.map(({ episode, video }, index) => (
                <li key={episode.slug}>
                  <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-black/10 bg-fd-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black/15 dark:border-white/10 dark:hover:border-white/15">
                    <div className="relative aspect-video border-b border-black/10 bg-black dark:border-white/10">
                      <Image
                        src={video.poster}
                        alt=""
                        fill
                        priority={index < 3}
                        sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                      <span className="absolute right-2 bottom-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
                        {formatClock(video.length)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <p className="text-sm text-fd-muted-foreground">{video.label}</p>
                      <h3 className="text-lg font-semibold tracking-tight text-balance">
                        {/* Stretched over the whole card, so the title stays the one link. */}
                        <Link href={tutorialUrl(episode.slug, lang)} className="after:absolute after:inset-0">
                          {video.title}
                        </Link>
                      </h3>
                      <p className="line-clamp-3 text-sm leading-6 text-fd-muted-foreground">{video.summary}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </main>
  );
}

export async function generateMetadata(props: PageProps<'/[lang]/tutorials'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLocale(lang)) notFound();

  return landingMetadata('tutorials', lang);
}
