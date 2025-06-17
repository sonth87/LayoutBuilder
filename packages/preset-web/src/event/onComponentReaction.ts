import { Component } from "grapesjs";
import PluginOptions, { Editor } from "../types/pluginOptions";

export const onComponentSelect = (
  editor: Editor,
  options: Required<PluginOptions>
) => {
  editor.on("component:selected", () => {
    let selected = editor.getSelected();

    if (selected != undefined) {
      if (selected.is("ulistitem")) {
        showOstToolbar(editor, options, selected);
      } else if (selected.isChildOf("ulistitem")) {
        showOstToolbar(editor, options, selected.closestType("ulistitem"));
      } else if (selected.getEl()?.tagName === "LI") {
        // If list element is empty replace with placeholder text (M&E case:)
        if (selected.components().length === 0 && !selected.get("content")) {
          var selectedPosition = selected.index();
          var newComponent = selected
            .parent()
            ?.append("<li>Text</li>", { at: selectedPosition });
          selected.remove();
          editor.select(newComponent);
          selected = editor.getSelected();
        }
        showOstToolbar(editor, options, selected);
      } else if (isChildOfElement(selected.getEl(), "LI")) {
        showOstToolbar(editor, options, selected.closest("li"));
      }
    }
  });
};

export const onComponentDeselect = (editor: Editor) => {
  editor.on("component:deselected", () => {
    var ostToolbar = document.querySelector(".gjs-ost-toolbar");
    ostToolbar?.classList.remove("show");
  });
};

function showOstToolbar(
  editor: Editor,
  options: Required<PluginOptions>,
  listItem: Component | undefined
) {
  var elPos = listItem?.index() || 0;
  var elLast = listItem?.parent()?.getLastChild().index();

  var ostToolbar = document.querySelector(".gjs-ost-toolbar");
  if (ostToolbar != undefined) {
    ostToolbar.innerHTML = "";

    // Add clone button
    const cBtn = document.createElement("div");
    cBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zm-1.3 3.88h2.6v3.82h3.82v2.6H13.3v3.82h-2.6V13.3H6.88v-2.6h3.82z"/></svg>';
    cBtn.classList.add("gjs-ost-toolbar-item", "clone");
    cBtn.title = options.t9n.ostToolbarClone;
    cBtn.addEventListener("click", () => {
      if (!listItem || !editor) return;
      const clonedItem = listItem?.clone();
      listItem?.parent()?.append(clonedItem, { at: elPos + 1 });
    });
    ostToolbar.appendChild(cBtn);

    //Add delete button
    const dBtn = document.createElement("div");
    dBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm5.12 7.7v2.6H6.88v-2.6z"/></svg>';
    dBtn.title = options.t9n.ostToolbarDelete;
    dBtn.classList.add("gjs-ost-toolbar-item", "del");
    if (elLast != 0) {
      dBtn.addEventListener("click", () => {
        listItem?.remove();
        ostToolbar?.classList.remove("show");
      });
    } else {
      dBtn.classList.add("disable");
    }
    ostToolbar.appendChild(dBtn);

    // Add move up button
    const upBtn = document.createElement("div");
    upBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.9 20.75 12 3.25l10.1 17.5Z"/></svg>';
    upBtn.title = options.t9n.ostToolbarUp;
    upBtn.classList.add("gjs-ost-toolbar-item", "up");
    if (elPos > 0) {
      upBtn.addEventListener("click", () => {
        if (elPos && listItem?.parent() != undefined) {
          let parent = listItem.parent();
          if (parent) {
            listItem?.move(parent, { at: elPos - 1 });
          }
          editor.selectRemove(listItem);
          editor.select(listItem);
        }
      });
    } else {
      upBtn.classList.add("disable");
    }
    ostToolbar.appendChild(upBtn);

    // Add move down button
    const dwnBtn = document.createElement("div");
    dwnBtn.innerHTML =
      '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M22.4 3.25 12 20.75 1.6 3.25Z"/></svg>';
    dwnBtn.title = options.t9n.ostToolbarDown;
    dwnBtn.classList.add("gjs-ost-toolbar-item", "down");
    if (elPos != elLast) {
      var toPos = elPos + 2;
      if (elPos == elLast) {
        toPos = 0;
      }
      dwnBtn.addEventListener("click", () => {
        if (toPos && listItem?.parent() != undefined) {
          let parent = listItem.parent();
          if (parent) {
            listItem.move(parent, { at: toPos });
          }
          editor.selectRemove(listItem);
          editor.select(listItem);
        }
      });
    } else {
      dwnBtn.classList.add("disable");
    }
    ostToolbar.appendChild(dwnBtn);

    // Add show
    ostToolbar.classList.add("show");
  }
}

function isChildOfElement(element: HTMLElement | undefined, tag: string) {
  while (element?.parentNode) {
    element = element.parentNode as HTMLElement;
    if (element.tagName === tag) return element;
  }
  return false;
}
