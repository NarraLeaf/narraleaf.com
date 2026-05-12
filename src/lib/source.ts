import { docs, project } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import {
  docsContentRoute,
  docsImageRoute,
  docsRoute,
  projectContentRoute,
  projectImageRoute,
  projectRoute,
} from './shared';
import { i18n } from './i18n';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  i18n,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const projectSource = loader({
  baseUrl: projectRoute,
  i18n,
  source: project.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = page.locale ? [page.locale, ...page.slugs, 'image.png'] : [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getProjectPageImage(page: (typeof projectSource)['$inferPage']) {
  const segments = page.locale ? [page.locale, ...page.slugs, 'image.png'] : [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${projectImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = page.locale
    ? [page.locale, ...page.slugs, 'content.md']
    : [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export function getProjectPageMarkdownUrl(page: (typeof projectSource)['$inferPage']) {
  const segments = page.locale
    ? [page.locale, ...page.slugs, 'content.md']
    : [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${projectContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(
  page: (typeof source)['$inferPage'] | (typeof projectSource)['$inferPage'],
) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
