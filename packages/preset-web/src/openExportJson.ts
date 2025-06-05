import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const cmdm = editor.Commands;
  const pfx = editor.getConfig().stylePrefix;

  cmdm.add(opts.cmdOpenExportJson, {
    containerEl: null as HTMLDivElement | null,
    codeEditorJson: null as HTMLDivElement | null,

    createCodeViewer(): any {
      return editor.CodeManager.createViewer({
        codeName: "javascript",
        theme: opts.codeViewerTheme,
      });
    },

    getJsonData(_editor: Editor): string {
      const json = _editor.getProjectData();
      const jsonData = JSON.stringify(json, null, 2);
      return jsonData;
    },

    createCodeEditor() {
      const el = document.createElement("div");
      const codeEditor = this.createCodeViewer();

      el.style.flex = "1 0 auto";
      el.style.boxSizing = "border-box";
      el.className = `${pfx}export-code`;
      el.appendChild(codeEditor.getElement());

      return { codeEditor, el };
    },

    getCodeContainer(): HTMLDivElement {
      let containerEl = this.containerEl;

      if (!containerEl) {
        containerEl = document.createElement("div");
        containerEl.className = `${pfx}export-container`;
        containerEl.style.display = "flex";
        containerEl.style.gap = "5px";
        containerEl.style.flexDirection = "column";
        containerEl.style.justifyContent = "space-between";
        this.containerEl = containerEl;
      }

      return containerEl;
    },

    run(editor) {
      let { codeEditorJson } = this as any;
      const container = this.getCodeContainer();

      if (!codeEditorJson) {
        const codeViewer = this.createCodeEditor();
        codeEditorJson = codeViewer.codeEditor;
        this.codeEditorJson = codeEditorJson;

        if (opts.t9n.modalLabelExport) {
          let labelEl = document.createElement("div");
          labelEl.className = `${pfx}export-label`;
          labelEl.innerHTML = opts.t9n.codeEditorJson;
          container.appendChild(labelEl);
        }

        container.appendChild(codeViewer.el);
      }

      editor.Modal.open({
        title: opts.t9n.modalTitleExport,
        content: container,
      });

      if (codeEditorJson) {
        codeEditorJson.setContent(this.getJsonData(editor));
        codeEditorJson.editor.refresh();
      }
    },
  });
};
