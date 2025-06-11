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
      
      // Force editor to save state for undo/redo
      editor.UndoManager.add({ 
        component: selectedComponent,
        style: { 
          ...selectedComponent.getStyle()
        }
      });

      return selectedComponent;
    },
  });

  // Clear transform tracking when component is deselected
  editor.on("component:deselected", (component) => {
    if (component && component.getId) {
      componentTransforms.delete(component.getId());
    }
  });

  // Add keyboard event listener specifically to canvas frame
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only proceed if we have a selected component and Alt key is pressed
    const selectedComponent = editor.getSelected();
    if (!selectedComponent || !e.altKey) return;
    
    // Check if this is an arrow key
    const isArrowKey = [37, 38, 39, 40].includes(e.keyCode);
    if (!isArrowKey) return;
    
    // Stop propagation to prevent other handlers from catching this event
    e.stopPropagation();
    e.preventDefault();

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
        return;
    }

    // Adjust move amount if shift key is also pressed
    const amount = e.shiftKey ? moveStep * 5 : moveStep;

    // Run the move command
    editor.runCommand("move-component", { direction, amount });
  };

  // Attach event listener specifically to the canvas
  const attachCanvasListeners = () => {
    // Get the canvas element
    const canvasEl = editor.Canvas.getElement();
    const canvasDoc = editor.Canvas.getDocument();
    const canvasWin = editor.Canvas.getWindow();
    
    if (canvasEl) {
      canvasEl.addEventListener("keydown", handleKeyDown);
    }
    
    if (canvasDoc) {
      canvasDoc.addEventListener("keydown", handleKeyDown);
    }
    
    if (canvasWin) {
      canvasWin.addEventListener("keydown", handleKeyDown);
    }
    
    // Also attach to main document as a fallback, but with focus check
    document.addEventListener("keydown", (e) => {
      // Only handle if focus is in the editor area
      const activeEl = document.activeElement;
      const editorEl = editor.getContainer();
      
      if (editorEl && (editorEl.contains(activeEl) || activeEl === editorEl)) {
        handleKeyDown(e);
      }
    });
  };

  // Remove event listeners
  const detachCanvasListeners = () => {
    const canvasEl = editor.Canvas.getElement();
    const canvasDoc = editor.Canvas.getDocument();
    const canvasWin = editor.Canvas.getWindow();
    
    if (canvasEl) {
      canvasEl.removeEventListener("keydown", handleKeyDown);
    }
    
    if (canvasDoc) {
      canvasDoc.removeEventListener("keydown", handleKeyDown);
    }
    
    if (canvasWin) {
      canvasWin.removeEventListener("keydown", handleKeyDown);
    }
    
    document.removeEventListener("keydown", handleKeyDown);
  };

  // Add event listeners when editor is loaded
  editor.on("load", () => {
    // Short timeout to ensure canvas is fully initialized
    setTimeout(() => {
      attachCanvasListeners();
    }, 100);
  });

  // Clean up event listeners when editor is closed
  editor.on("destroy", detachCanvasListeners);
  
  // Re-attach listeners when canvas is refreshed
  editor.on("canvas:refresh", () => {
    detachCanvasListeners();
    // Short timeout to ensure canvas is fully refreshed
    setTimeout(() => {
      attachCanvasListeners();
    }, 100);
  });
};
