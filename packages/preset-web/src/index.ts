import type { Component, Plugin } from "grapesjs";
import loadBlocks from "./blocks";
import loadCommands from "./commands";
import loadPanels from "./panels";
import loadTraits from "./traits";
import loadComponents from "./components";
import loadRte from "./rte";
import loadApi from "./api";
import PluginOptions, { Editor } from "./types/pluginOptions";
import { ostTrans } from "./const/ostTranslations";
import zoom from "./utils/zoom";
import keyboardNavigation from "./utils/keyboardNavigation";
import onLoadEvent from "./event/onLoad";
import {
  onComponentDeselect,
  onComponentSelect,
} from "./event/onComponentReaction";
import { storageStart } from "./event/storage";
import contextMenu from "./utils/contextMenu";

export type RequiredPluginOptions = Required<PluginOptions>;

const plugin: Plugin<PluginOptions> = async (
  editor,
  opts: Partial<PluginOptions> = {}
) => {
  let config = editor.getConfig();

  const options: RequiredPluginOptions = {
    blocks: [],
    block: () => ({}),
    juiceOpts: {},
    usedOstBlocks: [],
    cmdOpenExport: "gjs-open-export-template",
    cmdOpenImport: "gjs-open-import-template",
    cmdInlineHtml: "gjs-get-inlined-html",
    codeViewerTheme: "hopscotch",
    inlineCss: false,
    updateStyleManager: true,
    showStylesOnChange: true,
    showBlocksOnLoad: true,
    showTraitsOnLoad: true,
    showOutlineOnLoad: true,
    t9n: ostTrans,
    keyboardMoveStep: 1,
    brackets: ["{{", "}}"],
    contextMenu: {},
    ...opts,
  };

  // Change some config
  config.devicePreviewMode = true;

  loadApi(editor as Editor, options);
  loadComponents(editor, options);
  loadTraits(editor, options);
  await loadCommands(editor, options);
  await loadBlocks(editor, options);
  await loadPanels(editor, options);
  await loadRte(editor, options);
  zoom(editor, options);
  keyboardNavigation(editor, options);

  // On load
  onLoadEvent(editor, options);

  // On selected components
  onComponentSelect(editor, options);

  // On deselected components
  onComponentDeselect(editor);

  // On storage start
  storageStart(editor, options);
};

export default plugin;
export type { PluginOptions, Editor };
