import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add this function to load saved content from localStorage
export const loadProjectContent = (editor, projectName) => {
  if (!editor || !projectName) {
    console.warn("Cannot load project: editor or project name is missing");
    return false;
  }

  try {
    const savedContent = localStorage.getItem(
      `webbuilder_project_${projectName}`
    );
    if (!savedContent) {
      console.info(`No saved content found for project: ${projectName}`);
      return false;
    }

    const { html, css, js } = JSON.parse(savedContent);

    // Set components if HTML exists
    if (html) {
      editor.setComponents(html);
    }

    // Set styles if CSS exists
    if (css) {
      editor.setStyle(css);
    }

    // Set JS if supported and exists
    if (js && editor.setJs) {
      editor.setJs(js);
    }

    console.info(`Successfully loaded project: ${projectName}`);
    return true;
  } catch (error) {
    console.error("Failed to load saved content:", error);
    return false;
  }
};