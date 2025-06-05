import { useEffect, useRef, useState } from "react";
import grapesjs, { Device } from "grapesjs";
import * as presetWebModule from "preset-web";
import vi from "grapesjs/locale/vi";
import en from "grapesjs/locale/en";
import LayerPanel from "./editor/LayerPanel";
import BlocksPanel from "./editor/BlocksPanel";
import { styleManager } from "./editor/styleManager";
import { blockManager } from "./editor/blockManager";
import { layerManager } from "./editor/layerManager";
import { panelsManager } from "./editor/panelsManager";
import { deviceManager } from "./editor/deviceManager";
import { loadProjectContent } from "@/libs/utils";
import DevicePanel from "./editor/DevicePanel";
const presetWeb = presetWebModule.default || presetWebModule;

export const GrapesEditor = ({ editorInstanceRef, activeProject }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<string>("Desktop");

  const handleSetDevice = (deviceName: string) => {
    editorInstanceRef.current?.setDevice(deviceName);
    setActiveDevice(deviceName);
  };

  useEffect(() => {
    if (!editorRef.current || editorInstanceRef.current) return;

    editorInstanceRef.current = grapesjs.init({
      container: editorRef.current,
      height: "100%",
      width: "100%",
      storageManager: false,
      plugins: [presetWeb as any],
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
          modalImportContent: function (editor: any) {
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
      panels: panelsManager,
      layerManager: layerManager,
      blockManager: blockManager,
      // styleManager: styleManager,
    });

    editorInstanceRef.current.on("device:select", (device: any) => {
      setActiveDevice(device.get("name"));
    });

    // Add device commands
    editorInstanceRef.current.Commands.add("set-device-desktop", {
      run: (editor: any) => editor.setDevice("Desktop"),
    });
    editorInstanceRef.current.Commands.add("set-device-tablet", {
      run: (editor: any) => editor.setDevice("Tablet"),
    });
    editorInstanceRef.current.Commands.add("set-device-mobile", {
      run: (editor: any) => editor.setDevice("Mobile"),
    });
    editorInstanceRef.current.Commands.add("set-device-a4", {
      run: (editor: any) => editor.setDevice("A4 Landscape"),
    });

    // Add custom commands for panels
    editorInstanceRef.current.Commands.add("show-layers", {
      getRowEl(editor: any) {
        return editor.getContainer().closest(".editor-row");
      },
      getLayersEl(row: any) {
        return row.querySelector(".layers-container");
      },
      run(editor: any, sender: any) {
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
      getRowEl(editor: any) {
        return editor.getContainer().closest(".editor-row");
      },
      getStyleEl(row: any) {
        return row.querySelector(".styles-container");
      },
      getLayersEl(row: any) {
        return row.querySelector(".layers-container");
      },
      run(editor: any, sender: any) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        if (smEl) smEl.style.display = "";
        if (lmEl) lmEl.style.display = "none";
      },
    });

    // Optionally load previously saved content if available
    if (activeProject) {
      loadProjectContent(editorInstanceRef.current, activeProject);
    }

    return () => {
      // Clean up the editor when the component unmounts
      editorInstanceRef.current?.destroy();
      editorInstanceRef.current = null;
    };
  }, [editorInstanceRef, activeProject]);

  // Add method to reload content - useful when activeProject changes
  useEffect(() => {
    if (editorInstanceRef.current && activeProject) {
      loadProjectContent(editorInstanceRef.current, activeProject);
    }
  }, [activeProject]);

  return (
    <div className="h-full flex flex-col">
      <div className="panel__devices bg-white border-b border-gray-200 p-2">
        <DevicePanel
          activeDevice={activeDevice}
          handleSetDevice={handleSetDevice}
        />
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

// You can also export the function to use elsewhere
export { loadProjectContent };
