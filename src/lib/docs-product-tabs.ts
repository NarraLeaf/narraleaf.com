import { docsRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

const localizedTabs = {
  en: [
    {
      title: 'NarraLeaf Studio',
      description: 'Zero-code authoring, editing, preview, and publishing workflows.',
      path: 'studio',
    },
    {
      title: 'NarraLeaf Desktop',
      description: 'Library and CLI docs for the desktop app toolchain.',
      path: 'narraleaf/library',
    },
    {
      title: 'NarraLeaf-React',
      description: 'React player docs for web embedding and custom UI.',
      path: 'narraleaf-react',
    },
  ],
  zh: [
    {
      title: 'NarraLeaf Studio',
      description: '零代码创作、编辑、预览与发布工作流。',
      path: 'studio',
    },
    {
      title: 'NarraLeaf Desktop',
      description: '面向桌面应用工具链的 Library 与 CLI 文档。',
      path: 'narraleaf/library',
    },
    {
      title: 'NarraLeaf-React',
      description: '用于网页嵌入和自定义 UI 的 React 播放器文档。',
      path: 'narraleaf-react',
    },
  ],
} satisfies Record<Locale, { title: string; description: string; path: string }[]>;

/**
 * Documentation shell tabs: each tab is a separate top-level docs segment.
 * Project overview lives at `/project`, outside the documentation tabs.
 */
export function docsProductTabs(locale: Locale = i18n.defaultLanguage) {
  return localizedTabs[locale].map(({ path, ...tab }) => ({
    ...tab,
    url: localizedPath(`${docsRoute}/${path}`, locale),
  }));
}
