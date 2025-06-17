import React, { FC, PropsWithChildren, useRef, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const [activeProject, setActiveProject] = useState<string | null>(
    "MyProject"
  );
  const editorInstanceRef = useRef(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header activeProject={activeProject} />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
        <Sidebar onProjectSelect={setActiveProject} />

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
