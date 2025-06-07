import { Editor } from "grapesjs";
import type PluginOptions from "../pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const moveStep = opts.keyboardMoveStep || 5; // Default 5px movement step
  // Track accumulated transforms for each component
  const componentTransforms = new Map();

  // Register a command to move selected components
  editor.Commands.add("move-component", {
    run: (editor, sender, options = {}) => {
      const { direction, amount = moveStep } = options;
      const selectedComponent = editor.getSelected();

      if (!selectedComponent) return;
      const componentId = selectedComponent.getId();

      // Get current position
      const style = selectedComponent.getStyle();
      let { top, left, right, bottom, position } = style;

      // If position is not set or is static, we need to make it relative
      if (!position || position === "static") {
        selectedComponent.setStyle({ position: "relative" });
        position = "relative";
      }

      // Convert position values to numbers
      const parseValue = (value: any) => {
        if (!value) return 0;
        return parseInt(value) || 0;
      };

      const topVal = parseValue(top);
      const leftVal = parseValue(left);

      // Initialize transform tracking for this component if not exists
      if (!componentTransforms.has(componentId)) {
        componentTransforms.set(componentId, { x: 0, y: 0 });
      }

      const currentTransform = componentTransforms.get(componentId);

      // Update position based on direction
      switch (direction) {
        case "up":
          if (position === "absolute" || position === "fixed") {
            selectedComponent.setStyle({ top: `${topVal - amount}px` });
          } else {
            // Update accumulated Y transform
            currentTransform.y -= amount;
            selectedComponent.setStyle({
              transform: `translate(${currentTransform.x}px, ${currentTransform.y}px)`,
            });
          }
          break;
        case "down":
          if (position === "absolute" || position === "fixed") {
            selectedComponent.setStyle({ top: `${topVal + amount}px` });
          } else {
            // Update accumulated Y transform
            currentTransform.y += amount;
            selectedComponent.setStyle({
              transform: `translate(${currentTransform.x}px, ${currentTransform.y}px)`,
            });
          }
          break;
        case "left":
          if (position === "absolute" || position === "fixed") {
            selectedComponent.setStyle({ left: `${leftVal - amount}px` });
          } else {
            // Update accumulated X transform
            currentTransform.x -= amount;
            selectedComponent.setStyle({
              transform: `translate(${currentTransform.x}px, ${currentTransform.y}px)`,
            });
          }
          break;
        case "right":
          if (position === "absolute" || position === "fixed") {
            selectedComponent.setStyle({ left: `${leftVal + amount}px` });
          } else {
            // Update accumulated X transform
            currentTransform.x += amount;
            selectedComponent.setStyle({
              transform: `translate(${currentTransform.x}px, ${currentTransform.y}px)`,
            });
          }
          break;
      }

      // Trigger change event to update UI
      editor.trigger("component:update", selectedComponent);

      return selectedComponent;
    },
  });

  // Clear transform tracking when component is deselected
  editor.on("component:deselected", (component) => {
    if (component && component.getId) {
      componentTransforms.delete(component.getId());
    }
  });

  // Add keyboard event listener
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only handle events when an element is selected and Alt key is pressed
    const selectedComponent = editor.getSelected();
    if (!selectedComponent || !e.altKey) return;

    // Prevent default arrow key behavior (scrolling)
    if ([37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
    }

    let direction;

    switch (e.keyCode) {
      case 38: // Up arrow
        direction = "up";
        break;
      case 40: // Down arrow
        direction = "down";
        break;
      case 37: // Left arrow
        direction = "left";
        break;
      case 39: // Right arrow
        direction = "right";
        break;
      default:
        return; // Not an arrow key
    }

    // Adjust move amount if shift key is also pressed
    const amount = e.shiftKey ? moveStep * 5 : moveStep;

    // Run the move command
    editor.runCommand("move-component", { direction, amount });
  };

  // Add event listener when editor is loaded
  editor.on("load", () => {
    document.addEventListener("keydown", handleKeyDown);
  });

  // Clean up event listener when editor is closed
  editor.on("destroy", () => {
    document.removeEventListener("keydown", handleKeyDown);
  });
};
