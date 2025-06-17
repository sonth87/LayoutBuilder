import { BackgroundType } from "./types/background";
import PluginOptions, { Editor } from "./types/pluginOptions";
import {
  getBackground,
  resetBackground,
  setBackground,
} from "./utils/background";
import {
  extractDataFields,
  removeStyleProperties,
} from "./utils/jsonProcessors";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  editor.extractVariables = async () => {
    const dataFields = await extractDataFields(editor, opts.brackets);
    return dataFields;
  };

  editor.extractJsonData = async () => {
    const dataFields = await removeStyleProperties(editor);
    return dataFields;
  };

  // Set background for canvas/body
  editor.setCanvasBackground = (background: BackgroundType) => {
    return setBackground(editor, background);
  };

  // Get current canvas background
  editor.getCanvasBackground = () => {
    return getBackground(editor);
  };

  // Reset canvas background
  editor.resetCanvasBackground = () => {
    return resetBackground(editor);
  };
};
