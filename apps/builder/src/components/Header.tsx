import { Button } from "@/components/ui/button";
import { Save, Download, Eye, Settings } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

interface HeaderProps {
  activeProject: string | null;
  editorInstance?: any;
}

export const Header = ({ activeProject, editorInstance }: HeaderProps) => {
  const handleSave = useCallback(() => {
    if (!editorInstance?.current || !activeProject) {
      toast.error("Cannot save. Editor not initialized or no active project.");
      return;
    }

    try {
      const html = editorInstance.current.getHtml();
      const css = editorInstance.current.getCss();
      const js = editorInstance.current.getJs?.() || "";

      // Save to localStorage with project name as key
      const projectData = {
        html,
        css,
        js,
        lastSaved: new Date().toISOString(),
      };

      localStorage.setItem(
        `webbuilder_project_${activeProject}`,
        JSON.stringify(projectData)
      );

      toast.success("Project saved successfully");
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project");
    }
  }, [editorInstance, activeProject]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-900">Web Builder</h1>
        {activeProject && (
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {activeProject}
          </span>
        )}
      </div>

      <nav className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={!activeProject}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </nav>
    </header>
  );
};
