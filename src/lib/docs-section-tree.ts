import { flattenTree, type Folder, type Root, type Node } from 'fumadocs-core/page-tree';
import { docsRoute } from './shared';
import { type Locale, i18n, localizedPath } from './i18n';

function isFolder(node: Node): node is Folder {
  return node.type === 'folder';
}

/** Scope the page tree to one top-level docs folder (e.g. narraleaf-project, narraleaf, studio, narraleaf-react). */
export function buildSectionPageTree(
  fullTree: Root,
  section: string,
  locale: Locale = i18n.defaultLanguage,
): Root {
  const prefix = localizedPath(`${docsRoute}/${section}`, locale);
  const folder = fullTree.children.find((node): node is Folder => {
    if (!isFolder(node)) return false;
    const pages = flattenTree(node.children);
    return pages.some((p) => p.url === prefix || p.url.startsWith(`${prefix}/`));
  });

  if (!folder) {
    return { ...fullTree, children: [] };
  }

  return {
    ...fullTree,
    name: '',
    description: undefined,
    children: folder.children,
    $ref: folder.$ref,
  };
}
