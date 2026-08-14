import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * How long a browser may keep an image under `/static/img` before asking again.
 *
 * Next serves `public/` with `max-age=0, must-revalidate`, which is why nothing
 * on the site appeared instantly on a second visit: every picture cost a round
 * trip to be told it had not changed.
 *
 * What is left under this path is the docs screenshots and the brand mark. The
 * demo captures used to be here too and are now imported from `src/assets`, so
 * the build emits them to `/_next/static/media` under a content hash and Next
 * gives them a year and `immutable` on its own — see `src/assets/studio-slides`.
 *
 * Thirty days here, and deliberately not `immutable`, because these paths still
 * carry no hash: publishing a new docs screenshot under an old name means
 * waiting the window out, and `immutable` would extend that to a reload the
 * visitor has to think to perform. Renaming the file busts it at once, and
 * `vercel cache invalidate --srcimg <path>` clears the optimizer's copy — though
 * neither reaches a browser that already has one.
 */
const IMAGE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    // The floor for what the optimizer puts on `/_next/image` responses. Without
    // it the optimizer inherits the upstream `max-age=0` and re-validates every
    // derivative too, however long the source is good for. Safe to keep long for
    // the hashed sources, whose URL changes whenever the picture does.
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
