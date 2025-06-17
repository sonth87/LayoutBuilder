import PluginOptions, { Editor } from "../types/pluginOptions";

export const toggleDragMode = (
  editor: Editor,
  opts: Required<PluginOptions>
) => {
  const pfx = editor.getConfig().stylePrefix;

  editor.Canvas.getBody().classList.toggle("drag-mode");
  const isDragMode = editor.Canvas.getBody().classList.contains("drag-mode");

  editor.setDragMode(isDragMode ? "absolute" : "");

  const dragModeButton = document.querySelector(
    `.${pfx}drag-mode-button`
  ) as HTMLButtonElement;
  if (dragModeButton) {
    dragModeButton.classList.toggle("active", isDragMode);
    dragModeButton.setAttribute("aria-pressed", String(isDragMode));
  }
  editor.trigger("drag-mode:toggle", { isDragMode });

  return isDragMode;
};
