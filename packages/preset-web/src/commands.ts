import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";
import { cmdDeviceDesktop, cmdDeviceMobile, cmdDeviceTablet } from "./consts";
import openExportCommand from "./openExportCommand";
import openImportCommand from "./openImportCommand";
import openExportJson from "./openExportJson";
import {
  extractDataFields,
  removeStyleProperties,
} from "./utils/jsonProcessors";
import { toggleDragMode } from "./utils/toggleDragMode";

export default async (editor: Editor, opts: Required<PluginOptions>) => {
  const { Commands } = editor;

  openImportCommand(editor, opts);
  openExportCommand(editor, opts);
  openExportJson(editor, opts);

  Commands.add(cmdDeviceDesktop, {
    run: (ed) => ed.setDevice("Desktop"),
    stop: () => {},
  });

  Commands.add(cmdDeviceTablet, {
    run: (ed) => ed.setDevice("Tablet"),
    stop: () => {},
  });

  Commands.add(cmdDeviceMobile, {
    run: (ed) => ed.setDevice("Mobile portrait"),
    stop: () => {},
  });

  Commands.add("ost-blocks-visibility", {
    run(editor) {
      const cList = editor.Canvas.getBody().classList;
      cList.add("show-ost-blocks");
    },
    stop(editor) {
      const cList = editor.Canvas.getBody().classList;
      cList.remove("show-ost-blocks");
    },
  });

  // Thêm command chuyển đổi chế độ drag
  Commands.add("toggle-drag-mode", {
    run: (editor) => toggleDragMode(editor, opts),
    stop: () => {},
  });

  Commands.add("extract-data-fields", {
    async run() {
      const dataFields = await extractDataFields(editor);
      return dataFields;
    },
  });

  Commands.add("clean-json", {
    run() {
      const cleanedJson = removeStyleProperties(editor);
      return cleanedJson;
    },
  });
};
