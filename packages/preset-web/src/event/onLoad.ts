import { Component } from "grapesjs";
import PluginOptions, { Editor } from "../types/pluginOptions";
import {
  headerTrait,
  ostTypeHideInSimpleHtmlTrait,
  ostTypeTextTrait,
  wrapperClass,
} from "../const/consts";
import setupContextMenu from "../utils/contextMenu";

export default (editor: Editor, options: Required<PluginOptions>) => {
  editor.on("load", () => {
    // Create webtoolbar
    const tools = document.getElementById("gjs-tools");
    const ostTools = document.createElement("div");
    ostTools.classList.add("gjs-ost-toolbar");
    tools?.append(ostTools);

    // Change all elements with header tags from type text to header
    const changeHeaderType = (component: Component): void => {
      const tagName = component.get("tagName");

      const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
      if (
        tagName &&
        headings.includes(tagName.toLowerCase()) &&
        component.get("type") === "text"
      ) {
        component.set({ type: "header" });
        component.setTraits([
          { name: "id" },
          headerTrait(options),
          ostTypeTextTrait(options),
          ostTypeHideInSimpleHtmlTrait(options),
        ]);
      }
      const children = component.components();
      children.each((child) => changeHeaderType(child));
    };

    // editor wrapper
    const wrapper = editor.getWrapper();
    wrapper?.addClass(wrapperClass);
    const components = wrapper?.components();
    components?.each((component) => changeHeaderType(component));

    // context menu
    setupContextMenu(editor, options);
  });
};
