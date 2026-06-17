'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type UiEditorSlide = {
  src: string;
  alt: string;
};

type UiEditorSlideshowLabels = {
  previous: string;
  next: string;
  goToSlide: string;
  openPreview: string;
  closePreview: string;
};

type UiEditorSlideshowProps = {
  slides: UiEditorSlide[];
  labels: UiEditorSlideshowLabels;
};

const slideInterval = 4500;

export function UiEditorSlideshow(props: UiEditorSlideshowProps) {
  const { slides, labels } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1 || expandedIndex !== null) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, slideInterval);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, expandedIndex, slides.length]);

  useEffect(() => {
    if (expandedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpandedIndex(null);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expandedIndex]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const expandedSlide = expandedIndex === null ? null : slides[expandedIndex];

  return (
    <>
      <div className="group relative aspect-[1441/905] overflow-hidden rounded-xl border border-black/10 bg-[#05090d] shadow-sm dark:border-white/10">
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
              <button
                type="button"
                tabIndex={active ? 0 : -1}
                aria-label={`${labels.openPreview} ${index + 1}`}
                onClick={() => setExpandedIndex(index)}
                className="absolute inset-0 cursor-zoom-in focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none"
              >
                <div className="absolute inset-x-0 -top-[5px] h-[calc(100%+5px)]">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 600px, calc(100vw - 48px)"
                    className="pointer-events-none object-cover object-top"
                  />
                </div>
              </button>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#05090d]/65 to-transparent" />

        <button
          type="button"
          aria-label={labels.previous}
          onClick={showPrevious}
          className="absolute top-1/2 left-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white opacity-90 shadow-sm backdrop-blur transition-all duration-200 hover:bg-black/65 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label={labels.next}
          onClick={showNext}
          className="absolute top-1/2 right-3 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white opacity-90 shadow-sm backdrop-blur transition-all duration-200 hover:bg-black/65 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none sm:opacity-0 sm:group-hover:opacity-100"
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

        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-cyan-300/20" />
      </div>

      {expandedSlide ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={expandedSlide.alt}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            aria-hidden="true"
            onClick={() => setExpandedIndex(null)}
            className="absolute inset-0 cursor-zoom-out bg-black/80 backdrop-blur-sm"
          />
          <div
            className="relative z-10"
            style={{ width: 'min(96vw, calc(88vh * 1441 / 905))' }}
          >
            <div className="relative aspect-[1441/905] overflow-hidden rounded-xl border border-white/15 bg-[#05090d] shadow-2xl">
              <div className="absolute inset-x-0 -top-[5px] h-[calc(100%+5px)]">
                <Image
                  src={expandedSlide.src}
                  alt={expandedSlide.alt}
                  fill
                  unoptimized
                  sizes="96vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <button
              type="button"
              aria-label={labels.closePreview}
              onClick={() => setExpandedIndex(null)}
              className="absolute -top-3 -right-3 z-20 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white shadow-sm backdrop-blur transition-colors duration-200 hover:bg-black/85 focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:outline-none"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
