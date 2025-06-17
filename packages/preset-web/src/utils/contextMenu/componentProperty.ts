import { Editor } from "../../types/pluginOptions";

export const showPropertiesModal = (editor: Editor, component: any) => {
  const modal = editor.Modal;

  const attributes = component.getAttributes();
  const componentType = component.get("type");
  const tagName = component.get("tagName") || "div";
  const componentId = component.getId();

  let modalContent = `
      <div style="padding: 20px; max-width: 500px;">
        <h3 style="margin: 0 0 20px 0; color: #333;">Component Properties</h3>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #555;">Basic Info</h4>
          <div style="background: #f8f9fa; padding: 12px; border-radius: 4px; font-size: 12px;">
            <div><strong>Type:</strong> ${componentType}</div>
            <div><strong>Tag:</strong> ${tagName}</div>
            <div><strong>ID:</strong> ${componentId}</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #555;">Attributes</h4>
          <div id="attributes-container" style="max-height: 200px; overflow-y: auto;">
    `;

  // Add current attributes
  Object.entries(attributes).forEach(([key, value]) => {
    modalContent += createAttributeInput(key, value as string);
  });

  modalContent += `
          </div>
          <button id="add-attribute" style="padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; margin-top: 10px;">
            + Add Attribute
          </button>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px;">
          <button id="cancel-props" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
          <button id="save-props" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Save Changes
          </button>
        </div>
      </div>
    `;

  modal.open({
    title: "Component Properties",
    content: modalContent,
  });

  // Setup modal functionality
  setTimeout(() => {
    setupModalHandlers(editor, component, modal);
  }, 100);
};

export const createAttributeInput = (key: string, value: string): string => {
  return `
      <div style="display: flex; gap: 10px; margin-bottom: 8px; align-items: center;">
        <input type="text" value="${key}" placeholder="Attribute name" 
               style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
               data-attr-key="${key}">
        <input type="text" value="${value}" placeholder="Attribute value"
               style="flex: 2; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
               data-attr-value="${key}">
        <button onclick="this.parentElement.remove()" 
                style="padding: 6px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">×</button>
      </div>
    `;
};

export const setupModalHandlers = (
  editor: Editor,
  component: any,
  modal: any
) => {
  const addBtn = document.getElementById("add-attribute");
  const container = document.getElementById("attributes-container");

  if (addBtn && container) {
    addBtn.addEventListener("click", () => {
      const newAttrDiv = document.createElement("div");
      newAttrDiv.style.cssText =
        "display: flex; gap: 10px; margin-bottom: 8px; align-items: center;";
      newAttrDiv.innerHTML = `
          <input type="text" placeholder="Attribute name" 
                 style="flex: 1; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                 data-attr-key="">
          <input type="text" placeholder="Attribute value"
                 style="flex: 2; padding: 6px; border: 1px solid #ddd; border-radius: 3px; font-size: 12px;"
                 data-attr-value="">
          <button onclick="this.parentElement.remove()" 
                  style="padding: 6px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">×</button>
        `;
      container.appendChild(newAttrDiv);
    });
  }

  // Save functionality
  const saveBtn = document.getElementById("save-props");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveComponentAttributes(editor, component, modal);
    });
  }

  // Cancel functionality
  const cancelBtn = document.getElementById("cancel-props");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      modal.close();
    });
  }
};

export const saveComponentAttributes = (
  editor: Editor,
  component: any,
  modal: any
) => {
  const newAttributes: any = {};

  // Collect all attribute inputs
  const attrInputs = document.querySelectorAll("[data-attr-key]");
  attrInputs.forEach((keyInput: any) => {
    const key = keyInput.value.trim();
    const valueInput = document.querySelector(
      `[data-attr-value="${keyInput.dataset.attrKey || ""}"]`
    ) as HTMLInputElement;
    const value = valueInput
      ? valueInput.value.trim()
      : keyInput.nextElementSibling.value.trim();

    if (key) {
      newAttributes[key] = value;
    }
  });

  // Update component attributes
  component.setAttributes(newAttributes);

  // Trigger update
  editor.trigger("component:update", component);

  modal.close();
};
