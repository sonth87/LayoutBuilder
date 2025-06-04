import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { GrapesEditor } from "./GrapesEditor";

export const WebBuilder = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header activeProject={activeProject} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onProjectSelect={setActiveProject} />
        <main className="flex-1">
          <GrapesEditor />
        </main>
      </div>
    </div>
  );
};
