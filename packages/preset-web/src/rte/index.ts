import { Editor } from "grapesjs";
import type PluginOptions from "../pluginOptions";
import Piklor from "./colorPicker";

// Thêm các interface để định nghĩa rõ kiểu dữ liệu
interface RichTextEditor {
  getToolbarEl: () => HTMLElement;
  remove: (name: string) => void;
  add: (name: string, action: any) => void;
  exec: (cmd: string, value?: string) => void;
  doc: Document;
}

interface ActionObject {
  name: string;
  btn: HTMLElement;
}

interface ColorPicker {
  colorChosen: (callback: (color: string) => void) => void;
}

interface FontsOptions {
  fontName?: string[];
  fontSize?: boolean;
  fontColor?: string[];
  hilite?: string[];
}

interface IconsOptions {
  fontColor?: string;
  hiliteColor?: string;
  heading1?: string;
  heading2?: string;
  heading3?: string;
  heading4?: string;
  heading5?: string;
  heading6?: string;
  paragraph?: string;
  quote?: string;
  clear?: string;
  indent?: string;
  outdent?: string;
  subscript?: string;
  superscript?: string;
  olist?: string;
  ulist?: string;
  justifyLeft?: string;
  justifyCenter?: string;
  justifyFull?: string;
  justifyRight?: string;
  copy?: string;
  cut?: string;
  paste?: string;
  delete?: string;
  code?: string;
  line?: string;
  undo?: string;
  redo?: string;
}

interface RTEOptions {
  base?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    link?: boolean;
  };
  fonts?: FontsOptions;
  format?: {
    heading1?: boolean;
    heading2?: boolean;
    heading3?: boolean;
    heading4?: boolean;
    heading5?: boolean;
    heading6?: boolean;
    paragraph?: boolean;
    quote?: boolean;
    clearFormatting?: boolean;
  };
  subscriptSuperscript?: boolean;
  indentOutdent?: boolean;
  list?: boolean;
  align?: boolean;
  actions?: {
    copy?: boolean;
    cut?: boolean;
    paste?: boolean;
    delete?: boolean;
  };
  undoredo?: boolean;
  extra?: boolean;
  icons?: IconsOptions;
  darkColorPicker?: boolean;
  maxWidth?: string | null;
}

export default (editor: Editor, opts: Required<PluginOptions>) => {
  // Deep copy to prevent modifying the original options
  const options: RTEOptions = {
    ...{
      // default options
      base: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        link: true,
      },
      fonts: {
        fontName: [],
        fontSize: true,
        fontColor: [],
        hilite: [],
      },
      format: {
        heading1: true,
        heading2: true,
        heading3: true,
        heading4: false,
        heading5: false,
        heading6: false,
        paragraph: true,
        quote: false,
        clearFormatting: true,
      },
      subscriptSuperscript: false,
      indentOutdent: false,
      list: false,
      align: true,
      actions: {
        copy: false,
        cut: false,
        paste: false,
        delete: false,
      },
      undoredo: false,
      extra: false,
      icons: {},
      darkColorPicker: true,
      maxWidth: null,
    },
    ...(opts || {}),
  };

  // Merge font options from opts
  // if (opts?.rte?.fonts) {
  //   if (Array.isArray(opts.rte.fonts.fontName) && options.fonts) {
  //     options.fonts.fontName = [...opts.rte.fonts.fontName];
  //   }
  //   if (Array.isArray(opts.rte.fonts.fontColor) && options.fonts) {
  //     options.fonts.fontColor = [...opts.rte.fonts.fontColor];
  //   }
  //   if (Array.isArray(opts.rte.fonts.hilite) && options.fonts) {
  //     options.fonts.hilite = [...opts.rte.fonts.hilite];
  //   }
  // }

  const icons = options.icons || {};
  const formatBlock = "formatBlock";
  const rte: any = editor.RichTextEditor;

  const fontNames = options.fonts?.fontName?.length ? options.fonts.fontName : false;

  const fontOptionsEl = fontNames
    ? fontNames
        .map((font) => "<option>" + font.toString() + "</option>")
        .join("")
    : "";

  const fontNamesEl = `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
        ${fontOptionsEl}
    </select>`;

  // Safely handle container ID
  const getContainerId = (): string => {
    const container = editor.Config.container;
    if (typeof container === 'string') {
      return container.replace(/[^a-zA-Z0-9]/g, "");
    } else if (container instanceof HTMLElement && container.id) {
      return container.id.replace(/[^a-zA-Z0-9]/g, "");
    }
    // Fallback to a unique ID if container doesn't provide one
    return `rte-container-${Date.now()}`;
  };

  editor.onReady(() => {
    // Safely access toolbar element and set maxWidth
    if (options.maxWidth) {
      const toolbarEl = rte.getToolbarEl();
      if (toolbarEl && toolbarEl.firstChild instanceof HTMLElement) {
        toolbarEl.firstChild.style.maxWidth = options.maxWidth;
      }
    }

    // Remove defaults if not required
    if (!options.base || typeof options.base === "object") {
      if (options.base?.bold === false) rte.remove("bold");
      if (options.base?.italic === false) rte.remove("italic");
      if (options.base?.underline === false) rte.remove("underline");
      if (options.base?.strikethrough === false) rte.remove("strikethrough");
      if (options.base?.link === false) rte.remove("link");
    }

    // Font name selector
    if (options.fonts?.fontName && fontNames) {
      rte.add("fontName", {
        icon: fontNamesEl,
        // Bind the 'result' on 'change' listener
        event: "change",
        attributes: {
          style: "padding: 0 4px 2px;",
          title: "Font Name",
        },
        result: (rte: RichTextEditor, action: ActionObject) => {
          const firstChild = action.btn.firstChild as HTMLSelectElement | null;
          if (firstChild?.value) {  // Using optional chaining here
            rte.exec("fontName", firstChild.value);
          }
        },
        // Callback on any input change (mousedown, keydown, etc..)
        update: (rte: RichTextEditor, action: ActionObject) => {
          const value = rte.doc.queryCommandValue(action.name);
          if (value && value !== "false") {
            const firstChild = action.btn.firstChild as HTMLSelectElement | null;
            if (firstChild) {  // Null check
              firstChild.value = value;
            }
          }
        },
      });
    }

    // Font size selector
    if (options.fonts?.fontSize) {
      rte.add("fontSize", {
        icon: `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
          <option value="1">xx-small</option>
          <option value="2">x-small</option>
          <option value="3">small</option>
          <option value="4">medium</option>
          <option value="5">large</option>
          <option value="6">x-large</option>
          <option value="7">xx-large</option>
        </select>`,
        // Bind the 'result' on 'change' listener
        event: "change",
        attributes: {
          style: "padding: 0 4px 2px;",
          title: "Font Size",
        },
        result: (rte: RichTextEditor, action: ActionObject) => {
          const firstChild = action.btn.firstChild as HTMLSelectElement | null;
          if (firstChild?.value) {  // Using optional chaining
            rte.exec("fontSize", firstChild.value);
          }
        },
        // Callback on any input change (mousedown, keydown, etc..)
        update: (rte: RichTextEditor, action: ActionObject) => {
          const value = rte.doc.queryCommandValue(action.name);
          if (value && value !== "false") {
            const firstChild = action.btn.firstChild as HTMLSelectElement | null;
            if (firstChild) {  // Null check
              firstChild.value = value;
            }
          }
        },
      });
    }

    // Font color picker
    const colorPickers: Record<string, ColorPicker> = {};
    if (options.fonts?.fontColor) {
      rte.add("fontColor", {
        icon: `${
          icons.fontColor ||
          '<b style="pointer-events:none;border-bottom:2px solid">A</b>'
        }
        <div id="foreColor-picker-${getContainerId()}"
          class="${
            options.darkColorPicker
              ? "rte-color-picker dark"
              : "rte-color-picker light"
          }">
        </div>`,
        attributes: {
          id: "rte-font-color",
          title: "Font Color",
        },
        result: (rte: RichTextEditor) => {
          const containerId = getContainerId();
          const pickerId = `foreColor-picker-${containerId}`;
          const pikerEle = `#${pickerId}`;
          
          if (!colorPickers[pickerId]) {
            const fontColors = options.fonts?.fontColor;
            const colors = Array.isArray(fontColors) && fontColors.length > 0
              ? fontColors
              : null;
              
            try {
              colorPickers[pickerId] = new Piklor(
                pikerEle,
                colors || [],
                {
                  open: "span#rte-font-color.gjs-rte-action",
                  closeOnBlur: true,
                }
              );
            } catch (e) {
              console.error("Failed to initialize color picker:", e);
              return;
            }
          }
          
          colorPickers[pickerId]?.colorChosen((col) => rte.exec("foreColor", col));
        },
      });
    }

    // Highlight color picker
    if (options.fonts?.hilite) {
      rte.add("hiliteColor", {
        icon: `${
          icons.hiliteColor ||
          '<b style="pointer-events:none;" class="rte-hilite-btn">A</b>'
        }
        <div id="hilite-picker-${getContainerId()}"
          class="${
            options.darkColorPicker
              ? "rte-color-picker dark"
              : "rte-color-picker light"
          }">
        </div>`,
        attributes: {
          id: "rte-font-hilite",
          title: "Font Highlight",
        },
        result: (rte: RichTextEditor) => {
          const containerId = getContainerId();
          const pickerId = `hilite-picker-${containerId}`;
          const pikerEle = `#${pickerId}`;
          
          if (!colorPickers[pickerId]) {
            const hiliteColors = options.fonts?.hilite;
            const colors = Array.isArray(hiliteColors) && hiliteColors.length > 0
              ? hiliteColors
              : null;
              
            try {
              colorPickers[pickerId] = new Piklor(
                pikerEle,
                colors || [],
                {
                  open: "span#rte-font-hilite.gjs-rte-action",
                  closeOnBlur: true,
                }
              );
            } catch (e) {
              console.error("Failed to initialize highlight color picker:", e);
              return;
            }
          }
          
          colorPickers[pickerId]?.colorChosen((col) => rte.exec("hiliteColor", col));
        },
      });
    }

    // Headings
    if (options.format?.heading1) {
      rte.add("heading1", {
        icon: icons.heading1 || "<div>H1</div>",
        attributes: {
          title: "Heading 1",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<h1>"),
      });
    }
    
    if (options.format?.heading2) {
      rte.add("heading2", {
        icon: icons.heading2 || "<div>H2</div>",
        attributes: {
          title: "Heading 2",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<h2>"),
      });
    }
    
    if (options.format?.heading3) {
      rte.add("heading3", {
        icon: icons.heading3 || "<div>H3</div>",
        attributes: {
          title: "Heading 3",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<h3>"),
      });
    }
    
    if (options.format?.heading4) {
      rte.add("heading4", {
        icon: icons.heading4 || "<div>H4</div>",
        attributes: {
          title: "Heading 4",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<h4>"),
      });
    }
    
    if (options.format?.heading5) {
      rte.add("heading5", {
        icon: icons.heading5 || "<div>H5</div>",
        attributes: {
          title: "Heading 5",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<h5>"),
      });
    }
    
    if (options.format?.heading6) {
      rte.add("heading6", {
        icon: icons.heading6 || "<div>H6</div>",
        attributes: {
          title: "Heading 6",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<h6>"),
      });
    }
    
    if (options.format?.paragraph) {
      rte.add("paragraph", {
        icon: icons.paragraph || "&#182;",
        attributes: {
          title: "Paragraph",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<p>"),
      });
    }
    
    if (options.format?.quote) {
      rte.add("quote", {
        icon: icons.quote || '<i class="fa fa-quote-left"></i>',
        attributes: {
          title: "Quote",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<blockquote>"),
      });
    }
    
    if (options.format?.clearFormatting) {
      rte.add("clearFormatting", {
        icon: icons.clear || '<i class="fa fa-eraser"></i>',
        attributes: {
          title: "Clear Formatting",
        },
        result: (rte: RichTextEditor) => rte.exec("removeFormat"),
      });
    }
    
    if (options.indentOutdent) {
      rte.add("indent", {
        icon: icons.indent || '<i class="fa fa-indent"></i>',
        attributes: {
          title: "Indent",
        },
        result: (rte: RichTextEditor) => rte.exec("indent"),
      });
      
      rte.add("outdent", {
        icon: icons.outdent || '<i class="fa fa-outdent"></i>',
        attributes: {
          title: "Outdent",
        },
        result: (rte: RichTextEditor) => rte.exec("outdent"),
      });
    }
    
    if (options.subscriptSuperscript) {
      rte.add("subscript", {
        icon: icons.subscript || "<div>X<sub>2</sub></div>",
        attributes: {
          title: "Subscript",
        },
        result: (rte: RichTextEditor) => rte.exec("subscript"),
      });
      
      rte.add("superscript", {
        icon: icons.superscript || "<div>X<sup>2</sup></div>",
        attributes: {
          title: "Superscript",
        },
        result: (rte: RichTextEditor) => rte.exec("superscript"),
      });
    }
    
    if (options.list) {
      rte.add("olist", {
        icon: icons.olist || '<i class="fa fa-list-ol"></i>',
        attributes: {
          title: "Ordered List",
        },
        result: (rte: RichTextEditor) => rte.exec("insertOrderedList"),
      });
      
      rte.add("ulist", {
        icon: icons.ulist || '<i class="fa fa-list-ul"></i>',
        attributes: {
          title: "Unordered List",
        },
        result: (rte: RichTextEditor) => rte.exec("insertUnorderedList"),
      });
    }
    
    if (options.align) {
      rte.add("justifyLeft", {
        icon: icons.justifyLeft || '<i class="fa fa-align-left"></i>',
        attributes: {
          title: "Align Left",
        },
        result: (rte: RichTextEditor) => rte.exec("justifyLeft"),
      });
      
      rte.add("justifyCenter", {
        icon: icons.justifyCenter || '<i class="fa fa-align-center"></i>',
        attributes: {
          title: "Align Center",
        },
        result: (rte: RichTextEditor) => rte.exec("justifyCenter"),
      });
      
      rte.add("justifyFull", {
        icon: icons.justifyFull || '<i class="fa fa-align-justify"></i>',
        attributes: {
          title: "Align Justify",
        },
        result: (rte: RichTextEditor) => rte.exec("justifyFull"),
      });
      
      rte.add("justifyRight", {
        icon: icons.justifyRight || '<i class="fa fa-align-right"></i>',
        attributes: {
          title: "Align Right",
        },
        result: (rte: RichTextEditor) => rte.exec("justifyRight"),
      });
    }
    
    if (options.actions?.copy) {
      rte.add("copy", {
        icon: icons.copy || '<i class="fa fa-files-o"></i>',
        attributes: {
          title: "Copy",
        },
        result: (rte: RichTextEditor) => rte.exec("copy"),
      });
    }
    
    if (options.actions?.cut) {
      rte.add("cut", {
        icon: icons.cut || '<i class="fa fa-scissors"></i>',
        attributes: {
          title: "Cut",
        },
        result: (rte: RichTextEditor) => rte.exec("cut"),
      });
    }
    
    if (options.actions?.paste) {
      rte.add("paste", {
        icon: icons.paste || '<i class="fa fa-clipboard"></i>',
        attributes: {
          title: "Paste",
        },
        result: (rte: RichTextEditor) => rte.exec("paste"),
      });
    }
    
    if (options.actions?.delete) {
      rte.add("delete", {
        icon: icons.delete || '<i class="fa fa-trash-o"></i>',
        attributes: {
          title: "Delete",
        },
        result: (rte: RichTextEditor) => rte.exec("delete"),
      });
    }
    
    if (options.extra) {
      rte.add("code", {
        icon: icons.code || '<i class="fa fa-code"></i>',
        attributes: {
          title: "Code",
        },
        result: (rte: RichTextEditor) => rte.exec(formatBlock, "<pre>"),
      });
      
      rte.add("line", {
        icon: icons.line || "<b>&#8213;</b>",
        attributes: {
          title: "Horizontal Line",
        },
        result: (rte: RichTextEditor) => rte.exec("insertHorizontalRule"),
      });
    }
    
    if (options.undoredo) {
      rte.add("undo", {
        icon: icons.undo || '<i class="fa fa-reply"></i>',
        attributes: {
          title: "Undo",
        },
        result: (rte: RichTextEditor) => rte.exec("undo"),
      });
      
      rte.add("redo", {
        icon: icons.redo || '<i class="fa fa-share"></i>',
        attributes: {
          title: "Redo",
        },
        result: (rte: RichTextEditor) => rte.exec("redo"),
      });
    }
  });
};
