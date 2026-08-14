import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * How long a browser may keep an image under `/static/img` before asking again.
 *
 * Next serves `public/` with `max-age=0, must-revalidate`, which is why nothing
 * on the site appeared instantly on a second visit: every screenshot cost a
 * round trip to be told it had not changed. The home page's fourteen Studio
 * shots are `unoptimized`, so they are these files directly; the download page's
 * wall goes through the optimizer, which derives its own header from this one.
 *
 * Thirty days, and deliberately not `immutable`. These paths carry no content
 * hash, so the only way to publish a new screenshot under an old name is to wait
 * the window out — `immutable` would extend that to a reload the visitor has to
 * think to perform. Renaming the file still busts it immediately, which is the
 * intended way to replace one.
 */
const IMAGE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    // The floor for what the optimizer puts on `/_next/image` responses. Without
    // it the optimizer inherits the upstream `max-age=0` and re-validates every
    // derivative too, however long the source is good for.
    minimumCacheTTL: IMAGE_MAX_AGE_SECONDS,
  },
  async headers() {
    return [
      {
        source: '/static/img/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${IMAGE_MAX_AGE_SECONDS}, stale-while-revalidate=86400`,
          },
        ],
      },
    ];
  },
  async redirects() {
    const docsRedirects = [
      {
        source: '/docs/narraleaf/project',
        destination: '/project',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/project/:path*',
        destination: '/project/:path*',
        permanent: false,
      },
      {
        source: '/docs/narraleaf-project',
        destination: '/project',
        permanent: false,
      },
      {
        source: '/docs/narraleaf-project/:path*',
        destination: '/project/:path*',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/main',
        destination: '/docs/narraleaf/library/main',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/main/:path*',
        destination: '/docs/narraleaf/library/main/:path*',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/renderer',
        destination: '/docs/narraleaf/library/renderer',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/renderer/:path*',
        destination: '/docs/narraleaf/library/renderer/:path*',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/cli',
        destination: '/docs/narraleaf/library/cli',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/cli/:path*',
        destination: '/docs/narraleaf/library/cli/:path*',
        permanent: false,
      },
    ];

    return [
      ...docsRedirects,
      ...docsRedirects.map((redirect) => ({
        ...redirect,
        source: `/:lang(en|zh)${redirect.source}`,
        destination: `/:lang${redirect.destination}`,
      })),
    ];
  },
};

export default withMDX(config);
