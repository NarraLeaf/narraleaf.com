/**
 * The origin every absolute URL in the site's metadata is built from.
 *
 * `www`, not the apex, because the apex only ever answers with a 308 to this
 * host — and that redirect carries `max-age=0, must-revalidate`, which is set
 * by Vercel's domain layer before a request reaches this app and cannot be
 * given cache headers from `next.config` or `vercel.json`. The hop itself is
 * not removable, so the lever left is to stop pointing at the apex: anything
 * Next resolves against this base (Open Graph images, canonical links) names
 * `www` directly and costs no redirect when a crawler or a shared link follows
 * it.
 *
 * Without it Next falls back to `http://localhost:3000` and says so at build
 * time — which is where the `og:image` on every docs page had been pointing.
 */
export const siteUrl = 'https://www.narraleaf.com';

export const appName = 'NarraLeaf Project';
export const navBrandName = 'NarraLeaf';
export const appDescription =
  'NarraLeaf helps visual novel projects move from a Studio workspace to a desktop app or an embedded React player without changing the story model.';
/** Public URL for the favicon (see `public/narraleaf.ico`). */
export const siteIconPath = '/narraleaf.ico';
/**
 * The brand mark drawn in the nav and the footer.
 *
 * Deliberately not `siteIconPath`. The favicon is a 256px multi-resolution
 * `.ico` weighing 176KB, and the nav renders it at 28px on every page of the
 * site — behind `unoptimized`, so the whole file went over the wire for a mark
 * that never occupies more than a few thousand pixels.
 */
export const siteLogoPath = '/static/img/narraleaf-logo.webp';
export const projectRoute = '/project';
export const docsRoute = '/docs';
export const downloadRoute = '/download';
export const projectImageRoute = '/og/project';
/**
 * Card images for the pages outside the documentation tree.
 *
 * The docs pages already get one apiece from `/og/docs`; the home, download and
 * project pages had none at all, so every link to them shared anywhere rendered
 * as bare text. Generated rather than a checked-in picture, so the card always
 * carries the same title the page does.
 */
export const siteImageRoute = '/og/site';
export const docsImageRoute = '/og/docs';
export const projectContentRoute = '/llms.mdx/project';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'NarraLeaf',
  repo: 'narraleaf.com',
  branch: 'main',
};
