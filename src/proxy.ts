import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { i18n, isLocale } from '@/lib/i18n';
import { docsContentRoute, docsRoute, projectContentRoute, projectRoute } from '@/lib/shared';

function getLocalizedDocsContentPath(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const locale = isLocale(segments[0]) ? segments.shift() : i18n.defaultLanguage;
  const route = segments[0];
  const contentRoute =
    route === docsRoute.slice(1)
      ? docsContentRoute
      : route === projectRoute.slice(1)
        ? projectContentRoute
        : undefined;
  if (!contentRoute) return;

  const slugs = segments.slice(1);
  const last = slugs.at(-1);
  if (last?.endsWith('.mdx')) {
    slugs[slugs.length - 1] = last.slice(0, -4);
  }

  return `${contentRoute}/${[locale, ...slugs, 'content.md'].join('/')}`;
}

function shouldRunI18n(pathname: string): boolean {
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/og/') ||
    pathname.startsWith('/llms') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return false;
  }

  return true;
}

function handleI18n(request: NextRequest): NextResponse {
  const url = request.nextUrl;
  const segments = url.pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (isLocale(locale)) {
    return NextResponse.next();
  }

  const next = new URL(url);
  next.pathname =
    url.pathname === '/'
      ? `/${i18n.defaultLanguage}`
      : `/${i18n.defaultLanguage}${url.pathname}`.replaceAll(/\/+/g, '/');
  return NextResponse.rewrite(next);
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  void event;

  if (request.nextUrl.pathname.endsWith('.mdx')) {
    const result = getLocalizedDocsContentPath(request.nextUrl.pathname);
    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  if (isMarkdownPreferred(request)) {
    const result = getLocalizedDocsContentPath(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  if (shouldRunI18n(request.nextUrl.pathname)) {
    return handleI18n(request);
  }

  return NextResponse.next();
}
