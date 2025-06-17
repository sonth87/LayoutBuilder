import { wrapperClass } from "../const/consts";
import { BackgroundType } from "../types/background";
import { Editor } from "../types/pluginOptions";

const wrapperWithDot = "." + wrapperClass;

export const setBackground = (
  editor: Editor,
  background: BackgroundType
): boolean => {
  const iframe = editor.Canvas.getFrameEl();
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

  if (!iframeDoc) {
    console.warn("Canvas iframe document not found");
    return false;
  }

  // Tìm wrapperWithDot trong iframe document
  const editorWrapper = iframeDoc.querySelector(wrapperWithDot) as HTMLElement;

  if (!editorWrapper) {
    console.warn("Editor wrapper not found in iframe");
    return false;
  }

  try {
    if (typeof background === "string") {
      // Simple background (color, image URL, or CSS value)
      if (
        background.startsWith("#") ||
        background.startsWith("rgb") ||
        background.startsWith("hsl")
      ) {
        // Color
        editorWrapper.style.backgroundColor = background;
        editorWrapper.style.backgroundImage = "";
      } else if (
        background.startsWith("http") ||
        background.startsWith("data:") ||
        background.startsWith("/") ||
        background.startsWith("./")
      ) {
        // Image URL
        editorWrapper.style.backgroundImage = `url('${background}')`;
        editorWrapper.style.backgroundSize = "cover";
        editorWrapper.style.backgroundPosition = "center";
        editorWrapper.style.backgroundRepeat = "no-repeat";
      } else {
        // CSS value
        editorWrapper.style.background = background;
      }
    } else {
      // Background options object
      const {
        color,
        image,
        size = "cover",
        position = "center",
        repeat = "no-repeat",
        attachment = "scroll",
      } = background;

      if (color) {
        editorWrapper.style.backgroundColor = color;
      }

      if (image) {
        editorWrapper.style.backgroundImage = `url('${image}')`;
        editorWrapper.style.backgroundSize = size;
        editorWrapper.style.backgroundPosition = position;
        editorWrapper.style.backgroundRepeat = repeat;
        editorWrapper.style.backgroundAttachment = attachment;
      }
    }

    // Trigger update event
    editor.trigger("canvas:background-change", { background });
    return true;
  } catch (error) {
    console.error("Error setting canvas background:", error);
    return false;
  }
};

export const getBackground = (editor: Editor): BackgroundType | null => {
  const iframe = editor.Canvas.getFrameEl();
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

  if (!iframeDoc) {
    return null;
  }

  // Tìm wrapperWithDot trong iframe document
  const editorWrapper = iframeDoc.querySelector(wrapperWithDot) as HTMLElement;

  if (!editorWrapper) {
    return null;
  }

  const computedStyle = iframe.contentWindow?.getComputedStyle(editorWrapper);

  return {
    color: computedStyle?.backgroundColor || "",
    image: computedStyle?.backgroundImage || "",
    size: computedStyle?.backgroundSize || "",
    position: computedStyle?.backgroundPosition || "",
    repeat: computedStyle?.backgroundRepeat || "",
    attachment: computedStyle?.backgroundAttachment || "",
  } as BackgroundType;
};

export const resetBackground = (editor: Editor): boolean => {
  const iframe = editor.Canvas.getFrameEl();
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

  if (!iframeDoc) {
    console.warn("Canvas iframe document not found");
    return false;
  }

  // Tìm wrapperWithDot trong iframe document
  const editorWrapper = iframeDoc.querySelector(wrapperWithDot) as HTMLElement;

  if (!editorWrapper) {
    console.warn("Editor wrapper not found in iframe");
    return false;
  }

  try {
    editorWrapper.style.background = "";
    editorWrapper.style.backgroundColor = "";
    editorWrapper.style.backgroundImage = "";
    editorWrapper.style.backgroundSize = "";
    editorWrapper.style.backgroundPosition = "";
    editorWrapper.style.backgroundRepeat = "";
    editorWrapper.style.backgroundAttachment = "";

    // Trigger update event
    editor.trigger("canvas:background-reset");
    return true;
  } catch (error) {
    console.error("Error resetting canvas background:", error);
    return false;
  }
};

// Helper function với multiple fallback options cho việc tìm target element
export const findBackgroundTarget = (editor: Editor): HTMLElement | null => {
  const iframe = editor.Canvas.getFrameEl();
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;

  if (!iframeDoc) {
    return null;
  }

  // Option 1: Tìm wrapperWithDot
  let target = iframeDoc.querySelector(wrapperWithDot) as HTMLElement;

  if (!target) {
    // Option 2: Tìm .gjs-cv-canvas
    target = iframeDoc.querySelector(".gjs-cv-canvas") as HTMLElement;
  }

  if (!target) {
    // Option 3: Fallback to body
    target = iframeDoc.body;
  }

  return target;
};

// Alternative function sử dụng helper
export const setBackgroundSafe = (
  editor: Editor,
  background: BackgroundType
): boolean => {
  const target = findBackgroundTarget(editor);

  if (!target) {
    console.warn("No suitable background target found");
    return false;
  }

  try {
    if (typeof background === "string") {
      if (
        background.startsWith("#") ||
        background.startsWith("rgb") ||
        background.startsWith("hsl")
      ) {
        target.style.backgroundColor = background;
        target.style.backgroundImage = "";
      } else if (
        background.startsWith("http") ||
        background.startsWith("data:") ||
        background.startsWith("/") ||
        background.startsWith("./")
      ) {
        target.style.backgroundImage = `url('${background}')`;
        target.style.backgroundSize = "cover";
        target.style.backgroundPosition = "center";
        target.style.backgroundRepeat = "no-repeat";
      } else {
        target.style.background = background;
      }
    } else {
      const {
        color,
        image,
        size = "cover",
        position = "center",
        repeat = "no-repeat",
        attachment = "scroll",
      } = background;

      if (color) {
        target.style.backgroundColor = color;
      }

      if (image) {
        target.style.backgroundImage = `url('${image}')`;
        target.style.backgroundSize = size;
        target.style.backgroundPosition = position;
        target.style.backgroundRepeat = repeat;
        target.style.backgroundAttachment = attachment;
      }
    }

    editor.trigger("canvas:background-change", { background });
    return true;
  } catch (error) {
    console.error("Error setting canvas background:", error);
    return false;
  }
};
