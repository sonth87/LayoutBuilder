import { iconTrait, ostTypeHideInSimpleHtmlTrait } from "../const/consts";
import PluginOptions, { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Icon component
  DomComponents.addType("icon", {
    isComponent: (el) => {
      var classNames = [
        "fa",
        "fas",
        "far",
        "fab",
        "fa-solid",
        "fa-regular",
        "fa-brands",
      ];
      if (
        el.tagName === "I" &&
        classNames.some((className) => el.classList.contains(className))
      ) {
        return { type: "icon" };
      }
    },
    model: {
      defaults: {
        tagName: "i",
        attributes: { class: "fas fa-star" },
        traits: ["id", iconTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });
};
