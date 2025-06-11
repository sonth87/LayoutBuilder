import { Editor } from "grapesjs";
import PluginOptions from "../pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const options = {
    ...{
      // default options
      zoomInKey: ["ctrl", "="],
      zoomOutKey: ["ctrl", "-"],
      panelCategory: "Custom Category",
      minZoom: 25, // Minimum zoom level (%)
      maxZoom: 200, // Maximum zoom level (%)
      zoomStep: 5, // Zoom change per step (%)
    },
    ...opts,
  };

  // Initial zoom level
  let currentZoom = 100; // 100%

  const updateCanvasSize = (zoom: number) => {
    editor.Canvas.setZoom(`${zoom}`);
  };

  // Function to set zoom level with bounds checking
  const setZoomLevel = (zoom: number) => {
    // Ensure zoom stays within bounds
    zoom = Math.max(options.minZoom, Math.min(options.maxZoom, zoom));
    currentZoom = zoom;

    // Update the canvas
    updateCanvasSize(zoom);

    // Update any zoom display if needed
    const zoomDisplay = document.querySelector(".gjs-zoom-level");
    if (zoomDisplay) {
      zoomDisplay.textContent = `${zoom}%`;
    }
  };

  // zoomout button
  editor.Panels.addButton("options", {
    id: "Zoom Out",
    className: "fa fa-minus",
    command: "zoomout",
    attributes: { title: "Back" },
    category: options.panelCategory, // add a new category for the custom icon
  });

  // zoomin button
  editor.Panels.addButton("options", {
    id: "Zoom In",
    className: "fa fa-plus",
    command: "zoomin",
    attributes: { title: "Back" },
    category: options.panelCategory, // add a new category for the custom icon
  });

  // Add reset zoom button
  editor.Panels.addButton("options", {
    id: "Zoom Reset",
    className: "fa fa-expand",
    command: "zoomreset",
    attributes: { title: "Reset Zoom (100%)" },
    category: options.panelCategory,
  });

  editor.Commands.add("zoomin", {
    run: () => {
      setZoomLevel(currentZoom + options.zoomStep);
    },
  });

  editor.Commands.add("zoomout", {
    run: () => {
      setZoomLevel(currentZoom - options.zoomStep);
    },
  });

  editor.Commands.add("zoomreset", {
    run: () => {
      setZoomLevel(100);
    },
  });

  document.addEventListener("keydown", function (event) {
    if (event.shiftKey && (event.keyCode === 187 || event.keyCode === 107)) {
      event.preventDefault();
      editor.runCommand("zoomin");
    }
    if (event.shiftKey && (event.key === "-" || event.key === "_")) {
      event.preventDefault();
      editor.runCommand("zoomout");
    }
    if (event.shiftKey && event.key === "0") {
      event.preventDefault();
      editor.runCommand("zoomreset");
    }
  });

  // Initialize with default zoom
  setZoomLevel(currentZoom);
};
