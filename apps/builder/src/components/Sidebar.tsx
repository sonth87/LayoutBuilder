import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Folder, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  onProjectSelect: (project: string) => void;
}

export const Sidebar = ({ onProjectSelect }: SidebarProps) => {
  const [projects] = useState([
    { name: "Quản lý Templates", path: "/templates" },
  ]);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Projects</h3>
          <div className="space-y-1">
            {projects.map((project) => (
              <Link
                to={project.path}
                key={project.name}
                onClick={() => onProjectSelect(project.name)}
              >
                <button
                  key={project.name}
                  className="w-full flex items-center p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Folder className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="flex-1 text-left">{project.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
