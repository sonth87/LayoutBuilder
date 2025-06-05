import { useRef, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { GrapesEditor } from "./GrapesEditor";

export const WebBuilder = () => {
  const [activeProject, setActiveProject] = useState<string | null>(
    "MyProject"
  );
  const editorInstanceRef = useRef(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        activeProject={activeProject}
        editorInstance={editorInstanceRef}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onProjectSelect={setActiveProject} />
        <main className="flex-1">
          <GrapesEditor
            editorInstanceRef={editorInstanceRef}
            activeProject={activeProject} // Pass the activeProject here
          />
        </main>
      </div>
    </div>
  );
};
