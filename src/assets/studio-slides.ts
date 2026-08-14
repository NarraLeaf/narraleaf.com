import blueprintGameConfig from './studio-slides/blueprint-game-config.webp';
import buildForProduction from './studio-slides/build-for-production.webp';
import dashboard from './studio-slides/dashboard.webp';
import devMode from './studio-slides/dev-mode.webp';
import dialogCustomization from './studio-slides/dialog-customization.webp';
import live2dPuppet from './studio-slides/live2d-puppet.webp';
import pluginSystem from './studio-slides/plugin-system.webp';
import storyEditor from './studio-slides/story-editor.webp';
import storyLivePreview from './studio-slides/story-live-preview.webp';
import storyMotionEditor from './studio-slides/story-motion-editor.webp';
import translation from './studio-slides/translation.webp';
import uiEditor from './studio-slides/ui-editor.webp';
import uiTemplates from './studio-slides/ui-templates.webp';
import versionControl from './studio-slides/version-control.webp';

/**
 * The fourteen Studio captures, imported rather than pointed at.
 *
 * They live here and not in `public/` so that the build is what names them: an
 * import is emitted to `/_next/static/media` under a filename carrying a hash of
 * the file's contents, which makes the URL change the moment the picture does.
 * A path in `public/` is served verbatim and cannot say anything about what it
 * holds, so a re-exported screenshot arrives under the name the visitor already
 * has cached — the browser has no reason to ask for it again, and the old one
 * stays on screen for as long as the caching header allows. Hashed names cost
 * nothing to bust and let those headers be as long as they like.
 *
 * Both the home page's themed runs and the download page's wall draw from this
 * one set; the groupings differ and live with the pages that decide them.
 * Every file is 2956x1974.
 */
export const studioSlides = {
  blueprintGameConfig,
  buildForProduction,
  dashboard,
  devMode,
  dialogCustomization,
  live2dPuppet,
  pluginSystem,
  storyEditor,
  storyLivePreview,
  storyMotionEditor,
  translation,
  uiEditor,
  uiTemplates,
  versionControl,
} as const;
