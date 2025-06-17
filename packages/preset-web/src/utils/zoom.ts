import PluginOptions, { Editor } from "../types/pluginOptions";

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

  // Pan variables
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panOffsetX = 0;
  let panOffsetY = 0;
  let animationFrameId: any = null;

  // Function to update canvas position with requestAnimationFrame
  const updateCanvasPosition = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      // Lấy iframe document thay vì canvas element
      const iframe = editor.Canvas.getFrameEl();
      const iframeDoc =
        iframe?.contentDocument || iframe?.contentWindow?.document;

      if (iframeDoc && iframeDoc.body) {
        // Áp dụng transform cho body của iframe
        iframeDoc.body.style.transform = `translate3d(${panOffsetX}px, ${panOffsetY}px, 0) scale(${currentZoom / 100})`;
        iframeDoc.body.style.transformOrigin = "top left";
        iframeDoc.body.style.willChange = isPanning ? "transform" : "auto";

        // Đảm bảo overflow được handle đúng
        iframeDoc.body.style.overflow = "visible";
        if (iframeDoc.documentElement) {
          // iframeDoc.documentElement.style.overflow = "hidden";
        }
      }
    });
  };

  // Function to set zoom level with bounds checking
  const setZoomLevel = (zoom: number) => {
    const oldZoom = currentZoom;

    // Ensure zoom stays within bounds
    zoom = Math.max(options.minZoom, Math.min(options.maxZoom, zoom));
    currentZoom = zoom;

    // Update the canvas
    updateCanvasPosition();

    // Update any zoom display if needed
    const zoomDisplay = document.querySelector(".gjs-zoom-level");
    if (zoomDisplay) {
      zoomDisplay.textContent = `${zoom}%`;
    }

    // Trigger zoom change event
    if (oldZoom !== zoom) {
      editor.trigger("zoom:level-change", {
        oldZoom,
        newZoom: zoom,
        position: { x: panOffsetX, y: panOffsetY },
      });
    }
  };

  // Add pan functionality
  const setupPanFunctionality = () => {
    const iframe = editor.Canvas.getFrameEl();
    const iframeDoc =
      iframe?.contentDocument || iframe?.contentWindow?.document;

    if (!iframeDoc) return;

    // Mouse down event (middle button) - listen trên iframe document
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        isPanning = true;
        panStartX = e.clientX - panOffsetX;
        panStartY = e.clientY - panOffsetY;
        iframeDoc.body.style.cursor = "grabbing";
        iframeDoc.body.style.userSelect = "none";

        // Add event listeners to iframe document
        iframeDoc.addEventListener("mousemove", handleMouseMove);
        iframeDoc.addEventListener("mouseup", handleMouseUp);
        // Backup listeners on main document
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        e.preventDefault();
        panOffsetX = e.clientX - panStartX;
        panOffsetY = e.clientY - panStartY;
        updateCanvasPosition();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1 && isPanning) {
        isPanning = false;
        iframeDoc.body.style.cursor = "default";
        iframeDoc.body.style.userSelect = "auto";

        // Remove event listeners
        iframeDoc.removeEventListener("mousemove", handleMouseMove);
        iframeDoc.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (iframeDoc.body) {
          iframeDoc.body.style.willChange = "auto";
        }
      }
    };

    // Thêm wheel event để zoom với Ctrl/Cmd + scroll
    const handleWheel = (e: WheelEvent) => {
      // Kiểm tra nếu Ctrl (Windows/Linux) hoặc Cmd (macOS) được giữ
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // deltaY > 0 = scroll down = zoom out
        // deltaY < 0 = scroll up = zoom in
        const zoomChange = e.deltaY > 0 ? -options.zoomStep : options.zoomStep;
        setZoomLevel(currentZoom + zoomChange);
      }
    };

    // Listen events trên iframe document
    iframeDoc.addEventListener("mousedown", handleMouseDown);
    iframeDoc.addEventListener("wheel", handleWheel, { passive: false });

    // Prevent context menu
    iframeDoc.addEventListener("contextmenu", (e) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    });

    // Thêm wheel listener cho main document để catch events ngoài iframe
    document.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          // Kiểm tra nếu target là trong canvas area
          const canvasContainer = editor.Canvas.getElement()?.parentElement;
          if (canvasContainer?.contains(e.target as Node)) {
            e.preventDefault();
            const zoomChange =
              e.deltaY > 0 ? -options.zoomStep : options.zoomStep;
            setZoomLevel(currentZoom + zoomChange);
          }
        }
      },
      { passive: false }
    );
  };

  const setupDeviceChangeListener = () => {
    editor.on("device:change", (device) => {
      editor.runCommand("resetall");
    });
  };

  // Wait for editor to be ready
  editor.on("load", () => {
    setupPanFunctionality();
    setupDeviceChangeListener();
  });

  // zoomout button
  editor.Panels.addButton("options", {
    id: "Zoom Out",
    className: "fa fa-minus",
    command: "zoomout",
    attributes: { title: "Zoom out" },
    category: options.panelCategory, // add a new category for the custom icon
  });

  // zoomin button
  editor.Panels.addButton("options", {
    id: "Zoom In",
    className: "fa fa-plus",
    command: "zoomin",
    attributes: { title: "Zoom in" },
    category: options.panelCategory, // add a new category for the custom icon
  });

  // Add reset all button (gộp zoom reset và position reset)
  editor.Panels.addButton("options", {
    id: "Reset All",
    className: "fa fa-expand",
    command: "resetall",
    attributes: { title: "Reset Zoom & Position" },
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

  // Gộp chung reset zoom và position
  editor.Commands.add("resetall", {
    run: () => {
      // Reset zoom về 100%
      currentZoom = 100;
      // Reset position về 0,0
      panOffsetX = 0;
      panOffsetY = 0;
      // Update canvas
      updateCanvasPosition();
    },
  });

  // Cập nhật keyboard events để tránh conflict
  document.addEventListener("keydown", function (event) {
    // Zoom in: Ctrl/Cmd + Plus hoặc Shift + Plus
    if (
      (event.ctrlKey || event.metaKey || event.shiftKey) &&
      (event.keyCode === 187 || event.keyCode === 107 || event.key === "=")
    ) {
      event.preventDefault();
      editor.runCommand("zoomin");
    }

    // Zoom out: Ctrl/Cmd + Minus hoặc Shift + Minus
    if (
      (event.ctrlKey || event.metaKey || event.shiftKey) &&
      (event.key === "-" || event.key === "_")
    ) {
      event.preventDefault();
      editor.runCommand("zoomout");
    }

    // Reset: Ctrl/Cmd + 0 hoặc Shift + 0
    if (
      (event.ctrlKey || event.metaKey || event.shiftKey) &&
      event.key === "0"
    ) {
      event.preventDefault();
      editor.runCommand("resetall");
    }
  });

  // Initialize with default zoom
  setZoomLevel(currentZoom);
};
