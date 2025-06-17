import PluginOptions, { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  DomComponents.addType("variable", {
    isComponent: (el) => {
      const bracket = opts.brackets;
      if (el.tagName === "VARS" || el.tagName === "vars") {
        return { type: "variable" };
      }
    },
    extend: "div",
    model: {
      defaults: {
        tagName: "vars",
        components: [
          {
            type: "textnode",
            content: `${opts.brackets[0]}ten_bien${opts.brackets[1]}`,
          },
        ],
        traits: [
          // "id",
          {
            type: "text",
            name: "variable-name",
            label: "Tên biến",
            placeholder: "Tên biến (không dấu)",
          },
          {
            type: "text",
            name: "default-value",
            label: "Default Value",
            placeholder: "Enter default value",
          },
          {
            type: "select",
            name: "variable-type",
            label: "Variable Type",
            options: [
              { id: "text", name: "Text" },
              { id: "number", name: "Number" },
              { id: "boolean", name: "Boolean" },
              { id: "date", name: "Date" },
            ],
          },
        ],
      },
      init() {
        this.listenTo(
          this,
          "change:attributes:variable-name",
          this.updateContent
        );
      },
      updateContent() {
        const attrs = this.get("attributes") || {};
        const variableName = attrs["variable-name"] || "ten_bien";

        const textNode = this.components().at(0);
        if (textNode) {
          this.components().reset([
            {
              type: "textnode",
              content: `${opts.brackets[0]}${variableName}${opts.brackets[1]}`,
            },
          ]);
        }
      },
    },
  });
};
