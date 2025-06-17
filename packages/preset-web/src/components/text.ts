import {
  headerTrait,
  ostTypeHideInSimpleHtmlTrait,
  ostTypeTextTrait,
} from "../const/consts";
import PluginOptions, { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Add webtype trait to text components
  DomComponents.addType("text", {
    model: {
      defaults: {
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Header component
  DomComponents.addType("header", {
    isComponent: (el) => {
      const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
      if (el.tagName && headings.includes(el.tagName.toLowerCase())) {
        return { type: "header" };
      }
    },
    extend: "text",
    model: {
      defaults: {
        tagName: "h1", //Default
        traits: [
          "id",
          headerTrait(opts),
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });
};
