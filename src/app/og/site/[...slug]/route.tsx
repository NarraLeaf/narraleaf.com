import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { i18n, isLocale, type Locale } from '@/lib/i18n';
import { landingPageSeo, type LandingPageKey } from '@/lib/landing-seo';
import { appName } from '@/lib/shared';
import { cardDescription } from '@/lib/seo';

export const revalidate = false;

const LANDING_KEYS: LandingPageKey[] = ['home', 'download', 'project'];

function isLandingKey(value: string | undefined): value is LandingPageKey {
  return LANDING_KEYS.includes(value as LandingPageKey);
}

/**
 * The card image for one landing page in one language.
 *
 * `/og/site/<locale>/<page>/image.png`, mirroring `/og/docs`, so the trailing
 * segment gives scrapers that insist on an image extension something to read.
 */
export async function GET(_req: Request, { params }: RouteContext<'/og/site/[...slug]'>) {
  const { slug } = await params;
  const [locale, key] = slug;
  if (!isLocale(locale) || !isLandingKey(key)) notFound();

  const copy = landingPageSeo(key, locale as Locale);

  return new ImageResponse(
    <DefaultImage
      title={copy.title}
      description={cardDescription(copy.description)}
      site={appName}
    />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    LANDING_KEYS.map((key) => ({ slug: [lang, key, 'image.png'] })),
  );
}
