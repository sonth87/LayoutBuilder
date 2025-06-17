import {
  ContextMenuConfig,
  ContextMenuItem,
  ContextMenuItems,
} from "../../types/contextMenu";
import { Editor } from "../../types/pluginOptions";

export const createMenuItem = (
  editor: Editor,
  item: ContextMenuItem
): HTMLElement => {
  const menuItem = document.createElement("div");
  menuItem.className = "gjs-component-context-menu-item";
  menuItem.style.cssText = `
      padding: 10px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: background-color 0.2s;
      ${item.danger ? "color: #e74c3c;" : ""}
    `;

  const iconHtml = createIconHtml(item.icon);
  menuItem.innerHTML = `
      ${iconHtml}
      <div style="flex: 1;">
        ${item.label ? `<div style="font-weight: 500;">${item.label}</div>` : ""}
        ${item.description ? `<div style="font-size: 11px; color: #666; margin-top: 2px;">${item.description}</div>` : ""}
      </div>
    `;

  menuItem.addEventListener("mouseenter", () => {
    menuItem.style.backgroundColor = item.danger ? "#fdf2f2" : "#f8f9fa";
  });

  menuItem.addEventListener("mouseleave", () => {
    menuItem.style.backgroundColor = "transparent";
  });

  if (item?.action)
    menuItem.addEventListener("click", () => item?.action?.(item, editor));

  return menuItem;
};

export const getDefaultMenuItems = ({
  openStyleManager,
  openSettingsManager,
  openLayerManager,
  hide,
  targetComponent,
  showPropertiesModal,
  deleteComponent,
}: {
  openStyleManager: () => void;
  openSettingsManager: () => void;
  openLayerManager: () => void;
  hide: () => void;
  targetComponent: any;
  showPropertiesModal: (component: any) => void;
  deleteComponent: () => void;
}): ContextMenuItems[] => {
  return [
    {
      label: "Styling",
      icon: "fa fa-paint-brush",
      description: "Open Style Manager",
      action: () => {
        openStyleManager();
        hide();
      },
    },
    {
      label: "Settings",
      icon: "fa fa-cog",
      description: "Open Settings Manager",
      action: () => {
        openSettingsManager();
        hide();
      },
    },
    {
      label: "Layout View",
      icon: "fa fa-sitemap",
      description: "Open Layer Manager",
      action: () => {
        openLayerManager();
        hide();
      },
    },
    { separator: true },
    {
      label: "Properties",
      icon: "fa fa-list-ul",
      description: "Configure Attributes",
      action: () => {
        showPropertiesModal(targetComponent);
        hide();
      },
    },
    { separator: true },
    {
      label: "Delete",
      icon: "fa fa-trash",
      description: "Remove Component",
      danger: true,
      action: () => {
        deleteComponent();
        hide();
      },
    },
  ];
};

export const getMenuItems = ({
  editor,
  openStyleManager,
  openSettingsManager,
  openLayerManager,
  hide,
  targetComponent,
  showPropertiesModal,
  deleteComponent,
  config,
}: {
  editor: Editor;
  openStyleManager: () => void;
  openSettingsManager: () => void;
  openLayerManager: () => void;
  hide: () => void;
  targetComponent: any;
  showPropertiesModal: (component: any) => void;
  deleteComponent: () => void;
  config: ContextMenuConfig;
}): ContextMenuItems[] => {
  const defaultItems = config.enableDefaultItems
    ? getDefaultMenuItems({
        openStyleManager,
        openSettingsManager,
        openLayerManager,
        hide,
        targetComponent,
        showPropertiesModal: showPropertiesModal,
        deleteComponent,
      })
    : [];

  // Filter out disabled items
  const enabledDefaultItems = defaultItems.filter((item) => {
    if ("separator" in item) return true;
    return item.label
      ? !config.disabledItems?.includes(item.label.toLowerCase())
      : true;
  });

  // Add custom items
  const customItems = config.customItems || [];

  // Combine default and custom items
  let allItems = [...enabledDefaultItems];

  // Insert custom items
  customItems.forEach((customItem) => {
    // Wrap action to pass component and editor
    const wrappedItem = {
      ...customItem,
      action: () => customItem?.action?.(targetComponent, editor),
    };

    // Check visibility condition
    if (customItem.visible && !customItem.visible(targetComponent, editor)) {
      return;
    }

    allItems.push(wrappedItem);
  });

  // Apply custom order if specified
  if (config.itemOrder && config.itemOrder.length > 0) {
    allItems = reorderItems(allItems, config.itemOrder);
  }

  // Filter items based on visibility conditions
  return allItems.filter((item) => {
    if ("separator" in item) return true;

    const menuItem = item as ContextMenuItem;
    if (menuItem.visible) {
      return menuItem.visible(targetComponent, editor);
    }
    return true;
  });
};

function reorderItems(
  items: (ContextMenuItem | { separator: boolean })[],
  order: string[]
): (ContextMenuItem | { separator: boolean })[] {
  const reordered: (ContextMenuItem | { separator: boolean })[] = [];
  const itemMap = new Map<string, ContextMenuItem | { separator: boolean }>();

  // Create map for quick lookup
  items.forEach((item) => {
    if (!("separator" in item) && item.label) {
      itemMap.set(item.label.toLowerCase(), item);
    }
  });

  // Add items in specified order
  order.forEach((label) => {
    const item = itemMap.get(label.toLowerCase());
    if (item) {
      reordered.push(item);
      itemMap.delete(label.toLowerCase());
    }
  });

  // Add remaining items
  itemMap.forEach((item) => {
    reordered.push(item);
  });

  return reordered;
}

function createIconHtml(icon: ContextMenuItem["icon"]): string {
  if (!icon) {
    return '<div style="width: 14px; height: 14px;"></div>'; // Placeholder
  }
  const size = "14px";
  if (icon.startsWith("<")) {console.log(icon);
    return `<div style="width: ${size}; height: ${size}; display: flex; align-items: center; justify-content: center;">${icon}</div>`;
  } else {
    return `<i class="${icon}" style="width: 14px; font-size: 14px;"></i>`;
  }
}
