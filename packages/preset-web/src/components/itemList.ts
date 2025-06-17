import {
  ostTypeHideInSimpleHtmlTrait,
  ostTypeTextTrait,
  uListItemContent,
  ulListItem,
} from "../const/consts";
import PluginOptions, { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Unsorted list item component
  DomComponents.addType("ulistitem", {
    isComponent: (el) => {
      if (el.tagName === "LI" && el.classList.contains("ulistitem")) {
        return { type: "ulistitem" };
      }
    },
    model: {
      defaults: {
        tagName: "li",
        draggable: "ul",
        attributes: { class: "ulistitem" },
        style: { "text-align": "left" },
        components: uListItemContent,
        traits: ["id", "title", ostTypeTextTrait(opts)],
      },
    },
  });

  // Unsorted list component with fontawesome
  DomComponents.addType("ulist", {
    isComponent: (el) => {
      if (el.tagName === "UL" && el.classList.contains("ulist")) {
        return { type: "ulist" };
      }
    },
    model: {
      defaults: {
        tagName: "ul",
        attributes: { class: "ulist fa-ul" },
        style: {
          padding: "0.2em 0",
          "margin-left": "2em",
          "line-height": "1.4em",
        },
        components: [ulListItem, ulListItem, ulListItem],
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });
};
