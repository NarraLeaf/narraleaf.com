'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type DesktopDemoImage = {
  src: string;
  alt: string;
};

type DesktopDemoShowcaseLabels = {
  previous: string;
  next: string;
  goToSlide: string;
};

type DesktopDemoShowcaseProps = {
  codeImage: DesktopDemoImage;
  slides: DesktopDemoImage[];
  labels: DesktopDemoShowcaseLabels;
};

const slideInterval = 4500;

function GameDemoSlideshow(props: {
  slides: DesktopDemoImage[];
  labels: DesktopDemoShowcaseLabels;
}) {
  const { slides, labels } = props;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, slideInterval);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, slides.length]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="group relative aspect-[2678/1660] overflow-visible">
      {slides.map((slide, index) => {
        const active = index === activeIndex;

        return (
          <div
            key={slide.src}
            aria-hidden={!active}
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-out',
              active
                ? 'pointer-events-auto z-10 translate-x-0 opacity-100'
                : 'pointer-events-none z-0 translate-x-3 opacity-0',
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(min-width: 1024px) 560px, calc(100vw - 48px)"
              className="object-contain object-center"
              unoptimized
            />
          </div>
        );
      })}

      <button
        type="button"
        aria-label={labels.previous}
        onClick={showPrevious}
        className="absolute top-1/2 left-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white opacity-90 shadow-sm backdrop-blur transition-all duration-200 hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        aria-label={labels.next}
        onClick={showNext}
        className="absolute top-1/2 right-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white opacity-90 shadow-sm backdrop-blur transition-all duration-200 hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        <ChevronRight className="size-4" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`${labels.goToSlide} ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={cn(
              'h-1.5 rounded-full bg-white shadow-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none',
              index === activeIndex ? 'w-7 opacity-100' : 'w-4 opacity-45 hover:opacity-75',
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function DesktopDemoShowcase(props: DesktopDemoShowcaseProps) {
  const { codeImage, slides, labels } = props;

  return (
    <div className="mt-8 sm:mt-10">
      <div className="grid gap-5 lg:hidden">
        <div className="relative aspect-[2970/1974] overflow-visible">
          <Image
            src={codeImage.src}
            alt={codeImage.alt}
            fill
            sizes="calc(100vw - 48px)"
            className="object-contain object-center"
            unoptimized
          />
        </div>

        <GameDemoSlideshow slides={slides} labels={labels} />
      </div>

      <div className="relative hidden h-[560px] lg:block xl:h-[590px]">
        <div className="absolute top-0 left-0 w-[73%] overflow-visible">
          <div className="relative aspect-[2970/1974]">
            <Image
              src={codeImage.src}
              alt={codeImage.alt}
              fill
              sizes="840px"
              className="object-contain object-center"
              unoptimized
            />
          </div>
        </div>

        <div className="absolute top-[104px] right-0 z-20 w-[49%] xl:top-[118px]">
          <GameDemoSlideshow slides={slides} labels={labels} />
        </div>
      </div>
    </div>
  );
}
