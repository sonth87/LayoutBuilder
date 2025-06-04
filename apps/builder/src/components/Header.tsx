import { Button } from "@/components/ui/button";
import { Save, Download, Eye, Settings } from "lucide-react";

interface HeaderProps {
  activeProject: string | null;
}

export const Header = ({ activeProject }: HeaderProps) => {
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
        <Button variant="outline" size="sm">
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
