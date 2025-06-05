import type { Editor } from "grapesjs";
import juice from "juice";
import PluginOptions from "./pluginOptions";

// Add this interface to define the structure of your code editors
interface CodeViewer {
  setContent: (content: string) => void;
  getContent: () => string;
  getElement: () => HTMLElement;
  editor: {
    refresh: () => void;
  };
  el: HTMLElement;
}

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const cmdm = editor.Commands;
  const pfx = editor.getConfig().stylePrefix;

  cmdm.add(opts.cmdInlineHtml, {
    run(editor, s, opts = {}) {
      const tmpl = editor.getHtml() + `<style>${editor.getCss()}</style>`;
      return juice(tmpl, { ...opts.juiceOpts, ...opts });
    },
  });

  cmdm.add(opts.cmdOpenExport, {
    containerEl: null as HTMLDivElement | null,
    // Change these types to match what they actually are
    codeEditorHtml: null as CodeViewer | null,
    codeEditorCss: null as CodeViewer | null,
    splitView: false as boolean,

    createCodeViewer(): any {
      return editor.CodeManager.createViewer({
        codeName: "htmlmixed",
        theme: opts.codeViewerTheme,
      });
    },

    createCssViewer(): any {
      return editor.CodeManager.createViewer({
        codeName: "css",
        theme: opts.codeViewerTheme,
      });
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

    createCssEditor() {
      const el = document.createElement("div");
      const codeEditor = this.createCssViewer();

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
        containerEl.style.display = "grid";
        containerEl.style.gap = "5px";
        containerEl.style.gridTemplateColumns = "minmax(0, 1fr) minmax(0, 1fr)";
        this.containerEl = containerEl;
      }

      return containerEl;
    },

    updateEditorContent() {
      const { codeEditorHtml, codeEditorCss, splitView } = this as any;

      if (splitView) {
        // Split view mode - show HTML and CSS separately
        if (codeEditorHtml) {
          codeEditorHtml.setContent(editor.getHtml());
          codeEditorHtml.editor.refresh();
        }

        if (codeEditorCss) {
          codeEditorCss.setContent(editor.getCss());
          codeEditorCss.editor.refresh();
        }
      } else {
        // Combined view mode
        if (codeEditorHtml) {
          const tmpl = `${editor.getHtml()}<style>${editor.getCss()}</style>`;
          codeEditorHtml.setContent(juice(tmpl, opts.juiceOpts));
          codeEditorHtml.editor.refresh();
        }
      }
    },

    toggleSplitView() {
      this.splitView = !this.splitView;
      const container = this.getCodeContainer();

      // Update the switch button text
      const switchBtn = container.querySelector(`.${pfx}split-view-btn`);
      if (switchBtn) {
        switchBtn.textContent = this.splitView ? "Combined View" : "Split View";
      }

      // Update the switch button text
      const htmlCon = container.querySelector(`.${pfx}html-container`);
      if (htmlCon) {
        (htmlCon as HTMLDivElement).style.gridColumn = this.splitView
          ? "span 1"
          : "span 2";
      }

      // Show/hide the CSS editor
      const cssEditorContainer = container.querySelector(
        `.${pfx}css-container`
      );
      if (cssEditorContainer) {
        (cssEditorContainer as HTMLElement).style.display = this.splitView
          ? "block"
          : "none";
      }

      // Update the content
      this.updateEditorContent();
    },

    run(editor) {
      let { codeEditorHtml, codeEditorCss } = this;
      const container = this.getCodeContainer();

      // Clear container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Add label if needed
      if (opts.t9n.modalLabelExport) {
        let labelEl = document.createElement("div");
        labelEl.className = `${pfx}export-label`;
        labelEl.innerHTML = opts.t9n.modalLabelExport;
        container.appendChild(labelEl);
      }

      // Create controls container
      const controlsContainer = document.createElement("div");
      controlsContainer.className = `${pfx}export-controls`;
      controlsContainer.style.marginBottom = "10px";
      controlsContainer.style.display = "flex";
      controlsContainer.style.justifyContent = "flex-end";
      controlsContainer.style.gridColumn = "span 2";

      // Create split view toggle button
      const splitViewBtn = document.createElement("button");
      splitViewBtn.className = `${pfx}split-view-btn`;
      splitViewBtn.style.padding = "5px 10px";
      splitViewBtn.style.cursor = "pointer";
      splitViewBtn.style.backgroundColor = "#f5f5f5";
      splitViewBtn.style.border = "1px solid #ddd";
      splitViewBtn.style.borderRadius = "3px";
      splitViewBtn.textContent = this.splitView
        ? "Combined View"
        : "Split View";
      splitViewBtn.onclick = this.toggleSplitView.bind(this);

      controlsContainer.appendChild(splitViewBtn);
      container.appendChild(controlsContainer);

      // HTML Container
      const htmlContainer = document.createElement("div");
      htmlContainer.className = `${pfx}html-container`;
      htmlContainer.innerHTML = "HTML";
      htmlContainer.style.gridColumn = this.splitView ? "span 1" : "span 2";

      // Create HTML editor if not yet instantiated
      if (!codeEditorHtml) {
        const htmlViewer = this.createCodeEditor();
        codeEditorHtml = htmlViewer.codeEditor;
        this.codeEditorHtml = codeEditorHtml;
        htmlContainer.appendChild(htmlViewer.el);
      } else {
        const parentNode = codeEditorHtml.el?.parentNode;
        if (parentNode) {
          htmlContainer.appendChild(parentNode);
        }
      }

      container.appendChild(htmlContainer);

      // CSS Container (only shown in split view)
      const cssContainer = document.createElement("div");
      cssContainer.innerHTML = "CSS";
      cssContainer.className = `${pfx}css-container`;
      cssContainer.style.display = this.splitView ? "block" : "none";

      // Create CSS editor if not yet instantiated
      if (!codeEditorCss) {
        const cssViewer = this.createCssEditor();
        codeEditorCss = cssViewer.codeEditor;
        this.codeEditorCss = codeEditorCss;
        cssContainer.appendChild(cssViewer.el);
      } else {
        if (codeEditorCss.el.parentNode)
          cssContainer.appendChild(codeEditorCss.el.parentNode);
      }

      container.appendChild(cssContainer);

      // Open modal
      editor.Modal.open({
        title: opts.t9n.modalTitleExport,
        content: container,
      });

      // Update content based on current view mode
      this.updateEditorContent();
    },
  });
};
