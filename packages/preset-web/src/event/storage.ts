import PluginOptions, { Editor } from "../types/pluginOptions";

export const storageStart = (editor: Editor, opts: Required<PluginOptions>) => {
  editor.on("storage:start", () => {
    // Reset all Components
    const getAllComponents = (model: any, result: any[] = []) => {
      result.push(model);
      model.components().each((mod: any) => getAllComponents(mod, result));
      return result;
    };
    var allComponents = getAllComponents(editor.DomComponents.getWrapper());
    allComponents.forEach((compo) =>
      compo.set({
        draggable: true,
        removable: true,
        copyable: true,
        toolbar: [
          {
            attributes: { class: "fa-solid fa-arrow-up" },
            command: "select-parent",
          },
          {
            attributes: { class: "fa-solid fa-arrows-up-down-left-right" },
            command: "tlb-move",
          },
          { attributes: { class: "fa-regular fa-copy" }, command: "tlb-clone" },
          { attributes: { class: "fa-solid fa-trash" }, command: "tlb-delete" },
        ],
      })
    );
  });
};
