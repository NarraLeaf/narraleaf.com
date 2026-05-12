import { docsRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

/**
 * Documentation shell tabs: each tab is a separate top-level docs segment.
 * NarraLeaf Project (ecosystem overview) is its own segment, not nested under NarraLeaf engine docs.
 */
export function docsProductTabs(locale: Locale = i18n.defaultLanguage) {
  return [
  {
    title: 'NarraLeaf Project',
    description: 'Start here for the project map and the three build paths.',
    url: localizedPath(`${docsRoute}/narraleaf-project`, locale),
  },
  {
    title: 'NarraLeaf',
    description: 'Library and CLI docs for the desktop engine toolchain.',
    url: localizedPath(`${docsRoute}/narraleaf/library`, locale),
  },
  {
    title: 'NarraLeaf Studio',
    description: 'Zero-code authoring, editing, preview, and publishing workflows.',
    url: localizedPath(`${docsRoute}/studio`, locale),
  },
  {
    title: 'NarraLeaf-React',
    description: 'React player docs for web embedding and custom UI.',
    url: localizedPath(`${docsRoute}/narraleaf-react`, locale),
  },
  ] as const;
}
