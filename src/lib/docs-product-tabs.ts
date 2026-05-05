import { docsRoute } from './shared';

/**
 * Documentation shell tabs: each tab is a separate top-level docs segment.
 * NarraLeaf Project (ecosystem overview) is its own segment — not nested under NarraLeaf engine docs.
 */
export const docsProductTabs = [
  {
    title: 'NarraLeaf Project',
    description: 'Ecosystem overview and how the solutions fit together.',
    url: `${docsRoute}/narraleaf-project`,
  },
  {
    title: 'NarraLeaf',
    description: 'Engine docs — Library (Main, Renderer, CLI).',
    url: `${docsRoute}/narraleaf/library`,
  },
  {
    title: 'NarraLeaf Studio',
    description: 'Zero-code IDE and studio workflows.',
    url: `${docsRoute}/studio`,
  },
  {
    title: 'NarraLeaf-React',
    description: 'React player and embedding.',
    url: `${docsRoute}/narraleaf-react`,
  },
] as const;
