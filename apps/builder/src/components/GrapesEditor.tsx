import { FC, RefObject, useEffect, useRef, useState } from "react";
import grapesjs, { Device } from "grapesjs";
import { Editor } from "preset-web";
import presetWebModule from "preset-web";
import vi from "grapesjs/locale/vi.js";
import en from "grapesjs/locale/en.js";
import LayerPanel from "./editor/LayerPanel";
import BlocksPanel from "./editor/BlocksPanel";
import { styleManager } from "./editor/styleManager";
import { blockManager } from "./editor/blockManager";
import { layerManager } from "./editor/layerManager";
import { panelsManager } from "./editor/panelsManager";
import { deviceManager } from "./editor/deviceManager";

import DevicePanel from "./editor/DevicePanel";

type GjsEditorProps = {
  initialContent?: string;
  editorInstanceRef: RefObject<Editor>;
};

export const GjsEditor: FC<GjsEditorProps> = ({
  initialContent,
  editorInstanceRef,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<string>("Desktop");
  const [dragMode, setDragMode] = useState<string>("translate");

  const handleSetDevice = (deviceName: string) => {
    editorInstanceRef.current?.setDevice(deviceName);
    setActiveDevice(deviceName);
  };

  useEffect(() => {
    if (!editorRef.current || editorInstanceRef.current) return;

    editorInstanceRef.current = grapesjs.init({
      container: editorRef.current,
      // dragMode: "translate", // 'absolute' | 'translate'
      height: "100%",
      width: "100%",
      storageManager: false,
      plugins: [presetWebModule],
      i18n: {
        locale: "vi", // default locale
        detectLocale: true, // by default, the editor will detect the language
        localeFallback: "vi", // default fallback
        messages: { vi, en },
      },
      pluginsOpts: {
        "preset-web": {
          modalImportTitle: "Import Template",
          modalImportLabel:
            '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function (editor: Editor) {
            return editor.getHtml() + "<style>" + editor.getCss() + "</style>";
          },
          blocksBasicOpts: {
            blocks: [
              "column1",
              "column2",
              "column3",
              "text",
              "link",
              "image",
              "video",
            ],
            flexGrid: true,
          },
        },
      },
      canvas: {
        // styles: [
        //   "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
        // ]
      },
      deviceManager: deviceManager,
      // panels: panelsManager,
      // layerManager: layerManager,
      // blockManager: blockManager,
      // styleManager: styleManager,
    });

    editorInstanceRef.current.on("device:select", (device: any) => {
      setActiveDevice(device.get("name"));
    });

    // Add device commands
    editorInstanceRef.current.Commands.add("set-device-desktop", {
      run: (editor: Editor) => editor.setDevice("Desktop"),
    });
    editorInstanceRef.current.Commands.add("set-device-tablet", {
      run: (editor: Editor) => editor.setDevice("Tablet"),
    });
    editorInstanceRef.current.Commands.add("set-device-mobile", {
      run: (editor: Editor) => editor.setDevice("Mobile"),
    });
    editorInstanceRef.current.Commands.add("set-device-a4", {
      run: (editor: Editor) => editor.setDevice("A4 Landscape"),
    });

    // Add custom commands for panels
    editorInstanceRef.current.Commands.add("show-layers", {
      getRowEl(editor: Editor) {
        return editor.getContainer().closest(".editor-row");
      },
      getLayersEl(row: any) {
        return row.querySelector(".layers-container");
      },
      run(editor: Editor, sender: any) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        const smEl = this.getStyleEl(this.getRowEl(editor));
        if (lmEl) lmEl.style.display = "";
        if (smEl) smEl.style.display = "none";
      },
      getStyleEl(row: any) {
        return row.querySelector(".styles-container");
      },
    });

    editorInstanceRef.current.Commands.add("show-styles", {
      getRowEl(editor: Editor) {
        return editor.getContainer().closest(".editor-row");
      },
      getStyleEl(row: any) {
        return row.querySelector(".styles-container");
      },
      getLayersEl(row: any) {
        return row.querySelector(".layers-container");
      },
      run(editor: Editor) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        if (smEl) smEl.style.display = "";
        if (lmEl) lmEl.style.display = "none";
      },
    });

    // Optionally load previously saved content if available
    if (initialContent) {
      editorInstanceRef.current.setComponents(initialContent);
    }

    return () => {
      // Clean up the editor when the component unmounts
      editorInstanceRef.current?.destroy();
      editorInstanceRef.current = null;
    };
  }, [editorInstanceRef, initialContent]);

  // Add method to reload content - useful when activeProject changes
  useEffect(() => {
    if (editorInstanceRef.current && initialContent) {
      editorInstanceRef.current.setComponents(initialContent);
    }
  }, [initialContent]);

  return (
    <div className="h-full flex flex-col">
      <div className="panel__devices bg-white border-b border-gray-200 p-2 flex justify-between">
        <DevicePanel
          activeDevice={activeDevice}
          handleSetDevice={handleSetDevice}
          editorInstance={editorInstanceRef.current}
        />
        <div>
          <input
            type="checkbox"
            id="toggle-drag-mode"
            value={dragMode === "absolute" ? "true" : "false"}
            onChange={() => {
              const _dragMode =
                dragMode === "translate" ? "absolute" : "translate";
              editorInstanceRef.current.setDragMode(_dragMode);
              setDragMode(_dragMode);
            }}
          />
          <label htmlFor="toggle-drag-mode" className="ml-2">
            Drag Mode: {dragMode}
          </label>
        </div>
      </div>
      <div className="editor-row flex-1 flex">
        {/* <BlocksPanel /> */}

        <div className="editor-canvas flex-1 relative">
          <div className="panel__basic-actions absolute top-2 left-2 z-10">
            {/* Basic action buttons will be rendered here by GrapesJS */}
          </div>
          <div ref={editorRef} className="h-full" />
        </div>

        {/* <LayerPanel /> */}
      </div>
    </div>
  );
};

// import presetWebModule from "preset-web";

// import grapesjs, { Editor, usePlugin } from "grapesjs";
// import GjsEditor from "@grapesjs/react";
// console.log(typeof presetWebModule, presetWebModule, "presetWebModule");
// export const GrapesEditor = ({ editorInstanceRef, activeProject }) => {
//   const onEditor = (editor: Editor) => {
//     console.log("Editor loaded", { editor });
//   };

//   return (
//     <GjsEditor
//       grapesjs={grapesjs}
//       plugins={[
//         presetWebModule
//       ]}
//       grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
//       options={{
//         height: "100vh",
//         storageManager: false,
//       }}
//       onEditor={onEditor}
//     />
//   );
// };
