import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/shared';

/**
 * What crawlers may read, and where the URL list is.
 *
 * Everything a reader can open is open to a crawler as well, including the
 * generated card images under `/og` — a scraper that is refused those renders a
 * shared link as bare text. `/api` is the search index, which answers queries
 * rather than serving pages.
 *
 * `/nlr-demo-frame` is left crawlable on purpose: it carries `noindex` in its
 * own metadata, and a page blocked here is never read closely enough for that
 * to be noticed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
