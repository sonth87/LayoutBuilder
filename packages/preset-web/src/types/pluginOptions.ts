import { Editor as GjsEditor } from "grapesjs";
import juice from "juice";
import { BackgroundType } from "./background";
import { ContextMenuConfig } from './contextMenu';

export default interface PluginOptions {
  /**
   * Which blocks to add.
   */
  blocks?: string[];

  /**
   * Add custom block options, based on block id.
   * @default (blockId) => ({})
   * @example (blockId) => blockId === 'quote' ? { attributes: {...} } : {};
   */
  block?: (blockId: string) => {};

  /**
   * Export command id.
   * @default 'gjs-open-export-template'
   */
  cmdOpenExport?: string;

  /**
   * Import command id.
   * @default 'gjs-open-import-template'
   */
  cmdOpenImport?: string;

  /**
   * Get inlined HTML command id.
   * @default 'gjs-get-inlined-html'
   */
  cmdInlineHtml?: string;

  /**
   * If `true`, inline CSS on export.
   * @default true
   */
  inlineCss?: boolean;

  /**
   * Update Style Manager with more reliable style properties to use for newsletters.
   * @default true
   */
  updateStyleManager?: boolean;

  /**
   * Show the Style Manager on component change.
   * @default true
   */
  showStylesOnChange?: boolean;

  /**
   * Show the Block Manager on load.
   * @default true
   */
  showBlocksOnLoad?: boolean;

  /**
   * Show the Traits Manager on load.
   * @default true
   */
  showTraitsOnLoad?: boolean;

  /**
   * Show the outline option on load.
   * @default true
   */
  showOutlineOnLoad?: boolean;

  /**
   * Code viewer theme.
   * @default 'hopscotch'
   */
  codeViewerTheme?: string;

  /**
   * Custom options for `juice` HTML inliner.
   * @default {}
   */
  juiceOpts?: juice.Options;

  /**
   * translations
   */
  t9n?: OstTranslations;

  /**
   * blocks
   */
  usedOstBlocks?: {
    name: string;
    count: number;
  }[];

  keyboardMoveStep?: number;

  brackets?: [string, string];

  contextMenu?: ContextMenuConfig;
}

export type OstTranslations = {
  [key: string]: string;
};

export interface Editor extends GjsEditor {
  extractVariables?: () => Promise<any>;
  extractJsonData?: () => Promise<any>;
  setCanvasBackground?: (background: BackgroundType) => boolean;
  getCanvasBackground?: () => BackgroundType | null;
  resetCanvasBackground?: () => boolean;
}
