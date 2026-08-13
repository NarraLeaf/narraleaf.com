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
export const projectImageRoute = '/og/project';
export const docsImageRoute = '/og/docs';
export const projectContentRoute = '/llms.mdx/project';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'NarraLeaf',
  repo: 'narraleaf.com',
  branch: 'main',
};
