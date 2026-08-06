import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getNegotiator, isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { i18n, isLocale, LOCALE_COOKIE, type Locale } from '@/lib/i18n';
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

/**
 * Which language to serve a request whose path carries no locale.
 *
 * A language chosen by hand outranks the browser's preference — see
 * LOCALE_COOKIE. Negotiation yields undefined for a language this site does not
 * publish (`fr`, `ja`) and for a missing or malformed header, all of which fall
 * through to the default. Regional tags fold to their base language, so zh-CN,
 * zh-TW and zh-HK all resolve to zh.
 */
function resolveLocale(request: NextRequest): Locale {
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;

  const negotiated = getNegotiator(request).languages(i18n.languages)[0];
  if (isLocale(negotiated)) return negotiated;

  return i18n.defaultLanguage;
}

function handleI18n(request: NextRequest): NextResponse {
  const url = request.nextUrl;
  const segments = url.pathname.split('/').filter(Boolean);

  // A locale already in the path is what the visitor asked for. A shared /zh/
  // link stays Chinese for an English reader, and neither the cookie nor the
  // browser's preference gets to override it.
  if (isLocale(segments[0])) {
    return NextResponse.next();
  }

  const locale = resolveLocale(request);
  const target = new URL(url);
  target.pathname =
    url.pathname === '/' ? `/${locale}` : `/${locale}${url.pathname}`.replaceAll(/\/+/g, '/');

  // hideLocale is 'default-locale', so English is canonically served from the
  // unprefixed path and is rewritten in place. Every other language owns a
  // visible prefix, so the visitor is redirected onto it — serving Chinese from
  // an English URL would leave the address bar lying about what the page says,
  // and make the link unshareable.
  //
  // 307 and never 308: this path resolves differently per visitor, so a
  // permanent redirect would burn one visitor's language into their browser
  // cache and strand them there.
  const response =
    locale === i18n.defaultLanguage
      ? NextResponse.rewrite(target)
      : NextResponse.redirect(target, 307);

  // The outcome now depends on a header and a cookie, so any shared cache in
  // front of this has to key on both rather than on the path alone.
  response.headers.set('Vary', 'Accept-Language, Cookie');
  return response;
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
