import { Button } from "@/components/ui/button";
import { Save, Download, Eye, Settings, FileText } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { saveTemplate } from "@/api/template";
import { Link } from "react-router-dom";

type BuilderControlProps = {
  activeProject: string | null;
  editorInstance?: any;
};

const BuilderControl = ({
  activeProject,
  editorInstance,
}: BuilderControlProps) => {
  const handleSave = useCallback(async () => {
    if (!editorInstance?.current || !activeProject) {
      toast.error("Cannot save. Editor not initialized or no active project.");
      return;
    }

    try {
      const html = editorInstance.current.getHtml();
      const css = editorInstance.current.getCss();

      // Gọi API để lưu project
      const payload = {
        name: activeProject,
        slug: activeProject.replace(/\s+/g, "-").toLowerCase(),
        html,
        css,
        lastSaved: new Date().toISOString(),
      };
      await saveTemplate(payload);
      toast.success("Project saved to server thành công");
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Lưu project lên server thất bại");
    }
  }, [editorInstance, activeProject]);

  return (
    <nav className="flex items-center space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link to="/templates">
          <FileText className="w-4 h-4 mr-2" />
          Templates
        </Link>
      </Button>
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
  );
};

export default BuilderControl;
