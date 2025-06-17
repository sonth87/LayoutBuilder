import type PluginOptions from "../types/pluginOptions";
import { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const moveStep = opts.keyboardMoveStep || 5; // Default 5px movement step

  // Register a command to move selected components
  editor.Commands.add("move-component", {
    run: (editor, sender, options = {}) => {
      const { direction, amount = moveStep } = options;
      const selectedComponent = editor.getSelected();

      if (!selectedComponent) return;

      // Get current style
      const style = selectedComponent.getStyle();
      const { position } = style;

      // Chỉ áp dụng cho component có position absolute
      if (position !== "absolute") {
        return;
      }

      // Convert position values to numbers
      const parseValue = (value: any) => {
        if (!value || value === "auto") return null;
        const parsed = parseInt(value);
        return isNaN(parsed) ? null : parsed;
      };

      const topVal = parseValue(style.top);
      const leftVal = parseValue(style.left);
      const bottomVal = parseValue(style.bottom);
      const rightVal = parseValue(style.right);

      // Determine which properties to use based on priority rules
      const getVerticalProperty = () => {
        // Ưu tiên property đã có giá trị, nếu không có thì ưu tiên top
        if (topVal !== null) return "top";
        if (bottomVal !== null) return "bottom";
        return "top"; // Default to top
      };

      const getHorizontalProperty = () => {
        // Ưu tiên property đã có giá trị, nếu không có thì ưu tiên left
        if (leftVal !== null) return "left";
        if (rightVal !== null) return "right";
        return "left"; // Default to left
      };

      // Update position based on direction
      const newStyle: any = {};

      // Đảm bảo position vẫn là absolute
      newStyle.position = "absolute";

      switch (direction) {
        case "up":
          const verticalPropUp = getVerticalProperty();
          if (verticalPropUp === "top") {
            const currentTop = topVal !== null ? topVal : 0;
            newStyle.top = `${currentTop - amount}px`;
            // Clear bottom if we're using top và có bottom value
            if (bottomVal !== null) {
              newStyle.bottom = "auto";
            }
          } else {
            const currentBottom = bottomVal !== null ? bottomVal : 0;
            const newBottom = currentBottom + amount;
            newStyle.bottom = `${newBottom}px`;
            if (topVal !== null) {
              newStyle.top = "auto";
            }
          }
          break;

        case "down":
          const verticalPropDown = getVerticalProperty();
          if (verticalPropDown === "top") {
            const currentTop = topVal !== null ? topVal : 0;
            const newTop = currentTop + amount;
            newStyle.top = `${newTop}px`;
            // Clear bottom if we're using top và có bottom value
            if (bottomVal !== null) {
              newStyle.bottom = "auto";
            }
          } else {
            const currentBottom = bottomVal !== null ? bottomVal : 0;
            const newBottom = currentBottom - amount;
            newStyle.bottom = `${newBottom}px`;
            // Clear top if we're using bottom và có top value
            if (topVal !== null) {
              newStyle.top = "auto";
            }
          }
          break;

        case "left":
          const horizontalPropLeft = getHorizontalProperty();
          if (horizontalPropLeft === "left") {
            const currentLeft = leftVal !== null ? leftVal : 0;
            const newLeft = currentLeft - amount;
            newStyle.left = `${newLeft}px`;
            // Clear right if we're using left và có right value
            if (rightVal !== null) {
              newStyle.right = "auto";
            }
          } else {
            const currentRight = rightVal !== null ? rightVal : 0;
            const newRight = currentRight + amount;
            newStyle.right = `${newRight}px`;
            // Clear left if we're using right và có left value
            if (leftVal !== null) {
              newStyle.left = "auto";
            }
          }
          break;

        case "right":
          const horizontalPropRight = getHorizontalProperty();
          if (horizontalPropRight === "left") {
            const currentLeft = leftVal !== null ? leftVal : 0;
            const newLeft = currentLeft + amount;
            newStyle.left = `${newLeft}px`;
            // Clear right if we're using left và có right value
            if (rightVal !== null) {
              newStyle.right = "auto";
            }
          } else {
            const currentRight = rightVal !== null ? rightVal : 0;
            const newRight = currentRight - amount;
            newStyle.right = `${newRight}px`;
            // Clear left if we're using right và có left value
            if (leftVal !== null) {
              newStyle.left = "auto";
            }
          }
          break;
      }

      // Apply the new styles - chỉ update những property thay đổi
      selectedComponent.addStyle(newStyle);

      // Trigger change event to update UI
      editor.trigger("component:update", selectedComponent);

      return selectedComponent;
    },
  });

  // Biến để track xem event listener đã được gắn chưa
  let listenersAttached = false;

  // Add keyboard event listener
  const handleKeyDown = (e: KeyboardEvent) => {
    // Chỉ xử lý khi có component được chọn
    const selectedComponent = editor.getSelected();
    if (!selectedComponent) return;

    // Kiểm tra xem component có position absolute không
    const style = selectedComponent.getStyle();

    // Chỉ xử lý nếu component ĐÃ có position absolute
    if (style.position !== "absolute") {
      return;
    }

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

    // Di chuyển nhanh hơn khi nhấn Shift
    // Nếu Shift được nhấn, tăng gấp 5 lần bước di chuyển
    const amount = e.shiftKey ? moveStep * 5 : moveStep;

    // Run the move command
    editor.runCommand("move-component", { direction, amount });
  };

  // Attach event listener specifically to the canvas
  const attachListeners = () => {
    if (listenersAttached) {
      return;
    }

    document.addEventListener("keydown", handleKeyDown);
    listenersAttached = true;
  };

  // Remove event listeners
  const detachListeners = () => {
    if (!listenersAttached) return;

    document.removeEventListener("keydown", handleKeyDown);
    listenersAttached = false;
  };

  // Add event listeners when editor is loaded
  editor.on("load", () => {
    setTimeout(() => {
      attachListeners();
    }, 100);
  });

  // Clean up event listeners when editor is closed
  editor.on("destroy", detachListeners);
};
