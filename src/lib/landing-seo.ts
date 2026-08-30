import { type Locale } from './i18n';
import { downloadRoute, projectRoute } from './shared';

/**
 * The pages outside the documentation tree: what each one is called in a search
 * result, and what it promises there.
 *
 * They are collected here because three places have to agree on them. The page
 * builds its `<title>` and meta description from this, the card image route
 * draws the same two strings, and the sitemap ranks the same set of paths. A
 * title that differs between the page and its card is the shape of a result
 * that reads as a redirect.
 */
export type LandingPageKey = 'home' | 'download' | 'project';

export type LandingPageSeo = {
  /** The full `<title>`, product name included: these pages set it outright. */
  title: string;
  description: string;
  /** Terms this page in particular answers for, ahead of the site-wide list. */
  keywords: string[];
};

export const landingPaths: Record<LandingPageKey, string> = {
  home: '/',
  download: downloadRoute,
  project: projectRoute,
};

const landingSeo: Record<LandingPageKey, Record<Locale, LandingPageSeo>> = {
  home: {
    en: {
      title: 'NarraLeaf: Visual Novel Engine, Editor and React Player',
      description:
        'NarraLeaf builds visual novels as software. Write and preview a project in NarraLeaf Studio, ship it as a Windows, macOS, Android, iOS or web build, or embed the story in a React app with narraleaf-react.',
      keywords: [
        'visual novel',
        'build a visual novel',
        'visual novel development',
        'visual novel game engine',
      ],
    },
    zh: {
      title: 'NarraLeaf：视觉小说引擎、编辑器与 React 播放器',
      description:
        'NarraLeaf 用做软件的方式做视觉小说。在 NarraLeaf Studio 里编写与预览工程，构建成 Windows、macOS、Android、iOS 或网页版本，也可以用 narraleaf-react 把剧情嵌进 React 应用。',
      keywords: ['视觉小说', '视觉小说开发', '制作视觉小说', '视觉小说游戏引擎'],
    },
    ja: {
      title: 'NarraLeaf：ビジュアルノベルエンジン、エディタ、React プレイヤー',
      description:
        'NarraLeaf はビジュアルノベルをソフトウェアとして作ります。NarraLeaf Studio で執筆とプレビューを行い、Windows、macOS、Android、iOS、Web 向けにビルドし、narraleaf-react を使えば React アプリにそのまま物語を組み込めます。',
      keywords: [
        'ビジュアルノベル',
        'ノベルゲーム開発',
        'ビジュアルノベルの作り方',
        'ノベルゲーム制作',
      ],
    },
  },
  download: {
    en: {
      title: 'Download NarraLeaf Studio for Windows and macOS',
      description:
        'Download NarraLeaf Studio, the free visual novel editor for Windows and macOS. Assets, interfaces, story, localization, team collaboration and production builds in one workspace.',
      keywords: [
        'download visual novel maker',
        'free visual novel editor',
        'visual novel editor for Windows',
        'visual novel editor for macOS',
      ],
    },
    zh: {
      title: '下载 NarraLeaf Studio（Windows 与 macOS）',
      description:
        '下载 NarraLeaf Studio，面向 Windows 与 macOS 的免费视觉小说编辑器。资源、界面、剧情、本地化、团队协作与正式构建都在同一个工作区里。',
      keywords: [
        '视觉小说制作软件下载',
        '免费视觉小说编辑器',
        'Windows 视觉小说编辑器',
        'macOS 视觉小说编辑器',
      ],
    },
    ja: {
      title: 'NarraLeaf Studio をダウンロード（Windows / macOS）',
      description:
        'Windows と macOS 向けの無料ビジュアルノベルエディタ、NarraLeaf Studio をダウンロードします。アセット、インターフェース、ストーリー、ローカライズ、チーム共同編集、製品版ビルドが 1 つのワークスペースにそろっています。',
      keywords: [
        'ノベルゲーム制作ソフト ダウンロード',
        '無料 ビジュアルノベル エディタ',
        'Windows ノベルゲーム制作ソフト',
        'macOS ノベルゲーム制作ソフト',
      ],
    },
  },
  project: {
    en: {
      title: 'The NarraLeaf Project: Studio, Desktop and React Player',
      description:
        'An ecosystem for visual novel creation, application delivery and React embedding: a zero-code studio, a desktop application toolchain, and a lightweight React player that share one project model.',
      keywords: [
        'visual novel toolchain',
        'NarraLeaf Project',
        'React visual novel player',
        'visual novel ecosystem',
      ],
    },
    zh: {
      title: 'NarraLeaf Project：Studio、桌面工具链与 React 播放器',
      description:
        'NarraLeaf Project 生态总览：面向视觉小说创作、应用交付与 React 嵌入的零代码 Studio、桌面应用工具链与轻量 React 播放器，三条路径共用同一套项目模型。',
      keywords: ['视觉小说工具链', 'NarraLeaf 项目', 'React 视觉小说播放器', '视觉小说生态'],
    },
    ja: {
      title: 'NarraLeaf Project：Studio、デスクトップ、React プレイヤー',
      description:
        'ビジュアルノベルの制作、アプリケーションの配信、React への組み込みを扱うエコシステムです。ノーコードのスタジオ、デスクトップアプリのツールチェーン、軽量な React プレイヤーが 1 つのプロジェクトモデルを共有します。',
      keywords: [
        'ビジュアルノベル ツールチェーン',
        'NarraLeaf Project',
        'React ビジュアルノベル プレイヤー',
        'ビジュアルノベル エコシステム',
      ],
    },
  },
};

export function landingPageSeo(key: LandingPageKey, locale: Locale): LandingPageSeo {
  return landingSeo[key][locale];
}
