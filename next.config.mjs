import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/docs/narraleaf/project',
        destination: '/docs/narraleaf-project',
        permanent: false,
      },
      {
        source: '/docs/narraleaf/project/:path*',
        destination: '/docs/narraleaf-project/:path*',
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
  },
};

export default withMDX(config);
