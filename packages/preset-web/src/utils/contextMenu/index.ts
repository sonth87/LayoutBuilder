import { ContextMenuItem, ContextMenuConfig } from "../../types/contextMenu";
import PluginOptions, { Editor } from "../../types/pluginOptions";
import { showPropertiesModal } from "./componentProperty";
import { createMenuItem, getMenuItems } from "./menuItem";

export default function createComponentContextMenu(
  editor: Editor,
  opts: Required<PluginOptions>
) {
  let contextMenu: HTMLElement | null = null;
  let targetComponent: any = null;
  const pfx = editor.getConfig().stylePrefix;

  // Merge default config with user config
  const config: ContextMenuConfig = {
    enableDefaultItems: true,
    customItems: [],
    itemOrder: [],
    disabledItems: [],
    ...opts.contextMenu,
  };

  function createContextMenu(): HTMLElement {
    // Remove existing menu if any
    if (contextMenu) {
      contextMenu.remove();
    }

    contextMenu = document.createElement("div");
    contextMenu.className = `${pfx}component-context-menu`;
    contextMenu.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      padding: 8px 0;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 13px;
      min-width: 180px;
      display: none;
    `;

    const menuItems = getMenuItems({
      editor,
      openStyleManager,
      openSettingsManager,
      openLayerManager,
      hide,
      targetComponent,
      showPropertiesModal: (component: any) =>
        showPropertiesModal(editor, component),
      deleteComponent,
      config,
    });

    menuItems.forEach((item) => {
      if (item.separator) {
        const separator = document.createElement("div");
        separator.style.cssText = `
          height: 1px;
          background: #eee;
          margin: 6px 0;
        `;
        contextMenu?.appendChild(separator);
      } else {
        const menuItem = createMenuItem(editor, item as ContextMenuItem);
        contextMenu?.appendChild(menuItem);
      }
    });

    document.body.appendChild(contextMenu);
    return contextMenu;
  }

  function openStyleManager() {
    // editor.Commands.run("open-sm");
    editor.Panels.getButton("views", "open-sm")?.set("active", true);
  }

  function openSettingsManager() {
    // editor.Commands.run("open-tm");
    editor.Panels.getButton("views", "open-tm")?.set("active", true);
  }

  function openLayerManager() {
    // editor.Commands.run("open-layers");
    editor.Panels.getButton("views", "open-layers")?.set("active", true);
  }

  function deleteComponent() {
    if (!targetComponent) return;

    if (confirm("Are you sure you want to delete this component?")) {
      try {
        targetComponent.remove();
        editor.trigger("component:remove", targetComponent);
      } catch (error) {
        console.error("Error deleting component:", error);
      }
    }
  }

  function show(x: number, y: number, component: any) {
    targetComponent = component;

    if (!contextMenu) {
      createContextMenu();
    } else {
      // Recreate menu to update items based on current component
      contextMenu.remove();
      createContextMenu();
    }

    if (contextMenu) {
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
      contextMenu.style.display = "block";

      // Adjust position if menu goes outside viewport
      adjustMenuPosition(x, y);
    }
  }

  function adjustMenuPosition(x: number, y: number) {
    if (!contextMenu) return;

    const rect = contextMenu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      contextMenu.style.left = `${x - rect.width}px`;
    }

    if (rect.bottom > viewportHeight) {
      contextMenu.style.top = `${y - rect.height}px`;
    }
  }

  function hide() {
    if (contextMenu) {
      contextMenu.style.display = "none";
    }
    targetComponent = null;
  }

  function setupEventListeners() {
    const iframe = editor.Canvas.getFrameEl();
    const iframeDoc =
      iframe?.contentDocument || iframe?.contentWindow?.document;

    if (!iframeDoc) return;

    // Component right click event
    iframeDoc.addEventListener("contextmenu", (e: MouseEvent) => {
      handleComponentContextMenu(e);
    });

    // Hide menu listeners
    const hideHandler = (e: Event) => {
      if (!contextMenu || contextMenu.style.display === "none") {
        return;
      }

      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") {
          hide();
        }
      } else if (e instanceof MouseEvent) {
        // Check if click is outside context menu
        const target = e.target as HTMLElement;
        if (!contextMenu.contains(target)) {
          hide();
        }
      }
    };

    // Listen on multiple contexts to ensure menu hides
    document.addEventListener("click", hideHandler, true);
    document.addEventListener("keydown", hideHandler);
    iframeDoc.addEventListener("click", hideHandler, true);

    // Additional handler specifically for iframe clicks
    iframeDoc.addEventListener(
      "mousedown",
      (e: MouseEvent) => {
        if (!contextMenu || contextMenu.style.display === "none") {
          return;
        }

        // If clicking anywhere in the iframe that's not the context menu, hide it
        const target = e.target as HTMLElement;
        if (!contextMenu.contains(target)) {
          hide();
        }
      },
      true
    );

    iframeDoc.addEventListener("scroll", () => hide());
    window.addEventListener("resize", () => hide());

    // Hide when iframe loses focus
    iframe?.addEventListener("blur", () => hide());
  }

  function handleComponentContextMenu(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // Find the component element
    const target = e.target as HTMLElement;
    let component = null;

    // Check if the target element has GrapesJS component data
    if (target.getAttribute && target.getAttribute("data-gjs-type")) {
      component = findComponentByElement(target);
    } else {
      // Look for parent element with component data
      const componentEl = target.closest("[data-gjs-type]");
      if (componentEl) {
        component = findComponentByElement(componentEl as HTMLElement);
      }
    }

    if (component) {
      // Select the component
      editor.select(component);

      // Show context menu
      const x = e.clientX;
      const y = e.clientY;

      show(x, y, component);
    }
  }

  // Helper method to find component by DOM element
  function findComponentByElement(element: HTMLElement): any {
    const iframe = editor.Canvas.getFrameEl();
    const iframeDoc =
      iframe?.contentDocument || iframe?.contentWindow?.document;

    if (!iframeDoc) return null;

    const allComponents = editor.DomComponents.getComponents();
    return findComponentInTree(allComponents, element);
  }

  // Recursive search through component tree
  function findComponentInTree(
    components: any,
    targetElement: HTMLElement
  ): any {
    for (let i = 0; i < components.length; i++) {
      const component = components.models
        ? components.models[i]
        : components[i];

      if (!component) continue;

      // Get the DOM element for this component
      const componentElement = component.getEl ? component.getEl() : null;

      if (componentElement === targetElement) {
        return component;
      }

      // Check children recursively
      const children = component.get ? component.get("components") : null;
      if (children && children.length > 0) {
        const found = findComponentInTree(children, targetElement);
        if (found) return found;
      }
    }

    return null;
  }

  // Initialize
  setupEventListeners();

  // Return public API with configuration methods
  return {
    show,
    hide,
    updateConfig: (newConfig: Partial<ContextMenuConfig>) => {
      Object.assign(config, newConfig);
    },
    addCustomItem: (item: ContextMenuItem) => {
      if (!config.customItems) {
        config.customItems = [];
      }
      config.customItems.push(item);
    },
    removeCustomItem: (label: string) => {
      if (config.customItems) {
        config.customItems = config.customItems.filter(
          (item) => item.label?.toLowerCase() !== label.toLowerCase()
        );
      }
    },
  };
}
