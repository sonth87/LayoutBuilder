import React from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  activeProject: string | null;
}

export const Header = ({ activeProject }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex justify-between w-full">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 className="text-xl font-bold text-gray-900">Web Builder</h1>
          </Link>
          {activeProject && (
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {activeProject}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
