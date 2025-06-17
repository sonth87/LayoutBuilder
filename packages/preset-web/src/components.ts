import PluginOptions, { Editor } from "./types/pluginOptions";
import {
  ostTypeTextTrait,
  ostTypeImageTrait,
  ostTypeHideInSimpleHtmlTrait,
  nameTrait,
  valueTrait,
} from "./const/consts";
import loadScale from "./components/scale";
import loadIcon from "./components/icon";
import loadText from "./components/text";
import loadVideo from "./components/video";
import loadItemList from "./components/itemList";
import loadVariable from "./components/variable";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  loadScale(editor, opts);
  loadText(editor, opts);
  loadIcon(editor, opts);

  // INPUT
  DomComponents.addType("range", {
    isComponent: (el) => el.tagName == "INPUT",
    model: {
      defaults: {
        tagName: "input",
        droppable: true,
        highlightable: true,
        traits: [nameTrait, valueTrait],
        attributes: { type: "range", disabled: true },
      },
    },
    extendFnView: ["updateAttributes"],
    view: {
      updateAttributes() {
        this.el.setAttribute("autocomplete", "on");
      },
    },
  });

  // Add webtype trait to table components
  DomComponents.addType("table", {
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

  // Add webtype trait to link components
  DomComponents.addType("link", {
    model: {
      defaults: {
        traits: [
          "id",
          "href",
          "target",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add webtype trait to image components
  DomComponents.addType("image", {
    model: {
      defaults: {
        traits: [
          "id",
          "alt",
          ostTypeImageTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add webtype trait to text components
  DomComponents.addType("textnode", {
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

  // Add webtype trait to default components
  DomComponents.addType("default", {
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

  loadVideo(editor, opts);
  loadItemList(editor, opts);
  loadVariable(editor, opts);
};
