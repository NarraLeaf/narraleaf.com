import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { VideoFrame } from '@/components/video-frame';
import { i18n, isLocale, localizedPath } from '@/lib/i18n';
import { landingPageSeo } from '@/lib/landing-seo';
import { absoluteUrl, alternatesFor, jsonLdScript, keywordsFor, socialMetadataFor } from '@/lib/seo';
import { tutorialsRoute } from '@/lib/shared';
import {
  bilibiliWatchUrl,
  formatClock,
  getTutorial,
  isoDuration,
  tutorialEmbedUrl,
  tutorialLocales,
  tutorialSeries,
  tutorialUrl,
  tutorialsCopy,
  youtubeWatchUrl,
} from '@/lib/tutorials';

export default async function TutorialPage(props: PageProps<'/[lang]/tutorials/[slug]'>) {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();

  const tutorial = getTutorial(slug, lang);
  if (!tutorial) notFound();

  const copy = tutorialsCopy[lang];
  const { series, episode, video, previous, next } = tutorial;
  const embed = tutorialEmbedUrl(tutorial, lang);

  // A video carries its own structured data, so a search result can show the
  // poster, the length and the upload date beside the page.
  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.summary,
    thumbnailUrl: absoluteUrl(video.poster),
    uploadDate: video.published,
    duration: isoDuration(video.length),
    embedUrl: embed,
    url: absoluteUrl(tutorialUrl(slug, lang)),
    inLanguage: lang,
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(videoJsonLd)} />

      <Link
        href={localizedPath(tutorialsRoute, lang)}
        className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        <ArrowLeft className="size-4" />
        {copy.allTutorials}
      </Link>

      <article className="mt-8">
        <header className="space-y-5">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fd-muted-foreground">
            <span>{series.title[lang]}</span>
            <span aria-hidden="true">·</span>
            <span>{video.label}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={isoDuration(video.length)} className="tabular-nums">
              {formatClock(video.length)}
            </time>
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{video.title}</h1>
          <p className="text-lg leading-8 text-fd-muted-foreground">{video.summary}</p>
        </header>

        <VideoFrame src={embed} title={video.title} className="mt-10" />

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          {lang === 'zh' && series.bilibili ? (
            <a
              href={bilibiliWatchUrl(series.bilibili, episode.number)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <ExternalLink className="size-4" />
              {copy.watchOnBilibili}
            </a>
          ) : null}
          <a
            href={youtubeWatchUrl(video.youtube)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            <ExternalLink className="size-4" />
            {copy.watchOnYouTube}
          </a>
        </div>

        {video.chapters.length > 0 ? (
          <section aria-labelledby="chapters" className="mt-12">
            <h2 id="chapters" className="text-xl font-semibold tracking-tight">
              {copy.chapters}
            </h2>
            <ol className="mt-4 divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/10">
              {video.chapters.map((chapter) => (
                <li key={chapter.t} className="flex gap-4 px-4 py-3">
                  <span className="w-10 shrink-0 text-sm leading-6 text-fd-muted-foreground tabular-nums">
                    {formatClock(chapter.t)}
                  </span>
                  <span className="leading-6">{chapter.text}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {previous || next ? (
          <nav className="mt-12 grid gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                href={tutorialUrl(previous.episode.slug, lang)}
                className="flex flex-col gap-1 rounded-xl border border-black/10 p-4 transition-colors hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
              >
                <span className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
                  <ArrowLeft className="size-4" />
                  {copy.previous}
                </span>
                <span className="font-medium">{previous.video.title}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={tutorialUrl(next.episode.slug, lang)}
                className="flex flex-col items-end gap-1 rounded-xl border border-black/10 p-4 text-end transition-colors hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
              >
                <span className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground">
                  {copy.next}
                  <ArrowRight className="size-4" />
                </span>
                <span className="font-medium">{next.video.title}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    tutorialSeries(lang).flatMap(({ episodes }) => episodes.map(({ episode }) => ({ lang, slug: episode.slug }))),
  );
}

export async function generateMetadata(props: PageProps<'/[lang]/tutorials/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!isLocale(lang)) notFound();

  const tutorial = getTutorial(slug, lang);
  if (!tutorial) notFound();

  const { video } = tutorial;
  const section = landingPageSeo('tutorials', lang);
  const title = `${video.title} | ${section.title}`;
  const path = `${tutorialsRoute}/${slug}`;
  const social = socialMetadataFor({ locale: lang, path, title, description: video.summary, image: video.poster });
  // The poster is the video's own 16:9 thumbnail, not a 1200x630 card.
  const images = [{ url: video.poster, width: 1280, height: 720, alt: video.title }];

  return {
    title: { absolute: title },
    description: video.summary,
    keywords: keywordsFor(lang, [video.title, ...section.keywords]),
    alternates: alternatesFor(path, lang, tutorialLocales(slug)),
    ...social,
    openGraph: { ...social.openGraph, images },
    twitter: { ...social.twitter, images: [video.poster] },
  };
}
