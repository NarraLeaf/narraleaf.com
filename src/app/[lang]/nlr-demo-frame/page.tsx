import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, type Locale } from '@/lib/i18n';
import { NarraLeafReactPlayerFrame } from './player-frame';

type NarraLeafReactFramePageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NarraLeafReactFramePage(props: NarraLeafReactFramePageProps) {
  const { lang } = await props.params;

  if (!isLocale(lang)) {
    notFound();
  }

  return <NarraLeafReactPlayerFrame locale={lang as Locale} />;
}
