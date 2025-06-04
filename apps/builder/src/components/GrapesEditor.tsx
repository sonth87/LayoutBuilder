import { useEffect, useRef, useState } from "react";
import grapesjs from "grapesjs";
// import "grapesjs/dist/css/grapes.min.css";
import * as presetWebModule from "preset-web";
import vi from "grapesjs/locale/vi";
import en from "grapesjs/locale/en";
import LayerPanel from "./LayerPanel";
import BlocksPanel from "./BlocksPanel";
const presetWeb = presetWebModule.default || presetWebModule;

export const GrapesEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);
  const [activeDevice, setActiveDevice] = useState<string>("Desktop");

  const handleSetDevice = (deviceName: string) => {
    editorInstance.current?.setDevice(deviceName);
    setActiveDevice(deviceName);
  };

  useEffect(() => {
    if (!editorRef.current || editorInstance.current) return;

    editorInstance.current = grapesjs.init({
      container: editorRef.current,
      height: "100%",
      width: "100%",
      storageManager: false,
      plugins: [presetWeb as any],
      i18n: {
        locale: 'vi', // default locale
        detectLocale: true, // by default, the editor will detect the language
        localeFallback: 'vi', // default fallback
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
      deviceManager: {
        devices: [
          {
            name: "Desktop",
            width: "",
          },
          {
            name: "Tablet",
            width: "768px",
            widthMedia: "992px",
          },
          {
            name: "Mobile",
            width: "320px",
            widthMedia: "768px",
          },
          {
            name: "A4 Landscape",
            width: "842px",
            height: "595px",
          },
        ],
      },
      panels: {
        // stylePrefix: "pn-",
        defaults: [
          // {
          //   id: "basic-actions",
          //   el: ".panel__basic-actions",
          //   buttons: [
          //     {
          //       id: "visibility",
          //       active: true,
          //       className: "btn-toggle-borders",
          //       label: "<i class='fa fa-clone'></i>",
          //       command: "sw-visibility",
          //     },
          //   ],
          // },
          // {
          //   id: "panel-devices",
          //   el: ".panel__devices",
          //   buttons: [
          //     {
          //       id: "device-desktop",
          //       label: "Desktop",
          //       command: "set-device-desktop",
          //       active: true,
          //       togglable: false,
          //     },
          //     {
          //       id: "device-tablet",
          //       label: "Tablet",
          //       command: "set-device-tablet",
          //       togglable: false,
          //     },
          //     {
          //       id: "device-mobile",
          //       label: "Mobile",
          //       command: "set-device-mobile",
          //       togglable: false,
          //     },
          //     {
          //       id: "device-a4",
          //       label: "A4Page",
          //       command: "set-device-a4",
          //       togglable: false,
          //     },
          //   ],
          // },
          // {
          //   id: "panel-switcher",
          //   el: ".panel__switcher",
          //   buttons: [
          //     {
          //       id: "show-layers",
          //       active: true,
          //       label: "Layers",
          //       command: "show-layers",
          //       togglable: false,
          //     },
          //     {
          //       id: "show-style",
          //       label: "Styles",
          //       command: "show-styles",
          //       togglable: false,
          //     },
          //   ],
          // },
        ],
      },
      layerManager: {
        // appendTo: ".layers-container",
      },
      blockManager: {
        // appendTo: ".blocks-container",
        blocks: [
          // Layout Components
          {
            id: "section",
            label: "<b>Section</b>",
            category: "Layout",
            attributes: { class: "gjs-block-section" },
            content: `<section style="padding: 20px;">
              <h1>This is a simple title</h1>
              <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
          },
          {
            id: "column1",
            label: "1 Column",
            category: "Layout",
            content:
              '<div class="row"><div class="col-12" style="padding: 20px; border: 1px dashed #ccc;">Column content</div></div>',
          },
          {
            id: "column2",
            label: "2 Columns",
            category: "Layout",
            content:
              '<div class="row"><div class="col-6" style="padding: 20px; border: 1px dashed #ccc;">Column 1</div><div class="col-6" style="padding: 20px; border: 1px dashed #ccc;">Column 2</div></div>',
          },
          {
            id: "column3",
            label: "3 Columns",
            category: "Layout",
            content:
              '<div class="row"><div class="col-4" style="padding: 20px; border: 1px dashed #ccc;">Column 1</div><div class="col-4" style="padding: 20px; border: 1px dashed #ccc;">Column 2</div><div class="col-4" style="padding: 20px; border: 1px dashed #ccc;">Column 3</div></div>',
          },

          // Basic Components
          {
            id: "text",
            label: "Text",
            category: "Basic",
            content:
              '<div data-gjs-type="text" style="padding: 10px;">Insert your text here</div>',
          },
          {
            id: "button",
            label: "Button",
            category: "Basic",
            content:
              '<button class="btn btn-primary" style="padding: 10px 20px; margin: 10px;">Click me</button>',
          },
          {
            id: "link",
            label: "Link",
            category: "Basic",
            content:
              '<a href="#" style="color: #007bff; text-decoration: underline;">Link text</a>',
          },
          {
            id: "image",
            label: "Image",
            category: "Media",
            select: true,
            content: {
              type: "image",
              style: {
                width: "100%",
                height: "auto",
              },
            },
            activate: true,
          },
          {
            id: "video",
            label: "Video",
            category: "Media",
            content: {
              type: "video",
              src: "img/video2.webm",
              style: {
                height: "350px",
                width: "100%",
                maxWidth: "615px",
              },
            },
          },

          // Form Components
          {
            id: "form",
            label: "Form",
            category: "Forms",
            content: `<form style="padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" style="display: block; margin-bottom: 5px; font-weight: bold;">Name</label>
                <input type="text" class="form-control" id="name" placeholder="Enter name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div class="form-group" style="margin-bottom: 15px;">
                <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Enter email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <button type="submit" class="btn btn-primary" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
            </form>`,
          },
          {
            id: "input",
            label: "Input",
            category: "Forms",
            content:
              '<input type="text" placeholder="Enter text" class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin: 10px 0;">',
          },
          {
            id: "textarea",
            label: "Textarea",
            category: "Forms",
            content:
              '<textarea placeholder="Enter your message" class="form-control" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin: 10px 0; resize: vertical;"></textarea>',
          },
          {
            id: "select",
            label: "Select",
            category: "Forms",
            content: `<select class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin: 10px 0;">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>`,
          },
          {
            id: "checkbox",
            label: "Checkbox",
            category: "Forms",
            content: `<div style="margin: 10px 0;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" style="margin-right: 8px;">
                <span>Checkbox option</span>
              </label>
            </div>`,
          },
          {
            id: "radio",
            label: "Radio",
            category: "Forms",
            content: `<div style="margin: 10px 0;">
              <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px;">
                <input type="radio" name="radio-group" style="margin-right: 8px;">
                <span>Radio option 1</span>
              </label>
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="radio-group" style="margin-right: 8px;">
                <span>Radio option 2</span>
              </label>
            </div>`,
          },
        ],
      },
      styleManager: {
        appendTo: ".styles-container",
        sectors: [
          {
            name: "Dimension",
            open: false,
            buildProps: ["width", "min-height", "padding"],
            properties: [
              {
                type: "integer",
                name: "The width",
                property: "width",
                units: ["px", "%"],
                defaults: "auto",
                min: 0,
              },
            ],
          },
          {
            name: "Typography",
            open: false,
            buildProps: [
              "font-family",
              "font-size",
              "font-weight",
              "letter-spacing",
              "color",
              "line-height",
              "text-align",
            ],
          },
          {
            name: "Decorations",
            open: false,
            buildProps: [
              "opacity",
              "border-radius",
              "border",
              "box-shadow",
              "background",
            ],
          },
        ],
      },
    });

    editorInstance.current.on("device:select", (device: any) => {
      setActiveDevice(device.get("name"));
    });

    // Add device commands
    editorInstance.current.Commands.add("set-device-desktop", {
      run: (editor: any) => editor.setDevice("Desktop"),
    });
    editorInstance.current.Commands.add("set-device-tablet", {
      run: (editor: any) => editor.setDevice("Tablet"),
    });
    editorInstance.current.Commands.add("set-device-mobile", {
      run: (editor: any) => editor.setDevice("Mobile"),
    });
    editorInstance.current.Commands.add("set-device-a4", {
      run: (editor: any) => editor.setDevice("A4 Landscape"),
    });

    // Add custom commands for panels
    editorInstance.current.Commands.add("show-layers", {
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

    editorInstance.current.Commands.add("show-styles", {
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

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="panel__devices bg-white border-b border-gray-200 p-2 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${
            activeDevice === "Desktop"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSetDevice("Desktop")}
        >
          Desktop
        </button>
        <button
          className={`px-3 py-1 rounded ${
            activeDevice === "Tablet" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleSetDevice("Tablet")}
        >
          Tablet
        </button>
        <button
          className={`px-3 py-1 rounded ${
            activeDevice === "Mobile" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleSetDevice("Mobile")}
        >
          Mobile
        </button>
        <button
          className={`px-3 py-1 rounded ${
            activeDevice === "A4 Landscape"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSetDevice("A4 Landscape")}
        >
          A4 Landscape
        </button>
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
