import { WebBuilder } from "@/components/WebBuilder";
import { TemplateFormData } from "@/types/template";
import React, { FC } from "react";

type VisualBuilderProps = {
  formData: TemplateFormData;
  editorInstanceRef: React.RefObject<any>;
};

const VisualBuilder: FC<VisualBuilderProps> = ({
  formData,
  editorInstanceRef,
}) => {
  return (
    <div className="h-[calc(100vh-200px)]">
      <WebBuilder
        initialContent={{ html: formData.html, css: formData.css }}
        editorInstanceRef={editorInstanceRef}
      />
    </div>
  );
};

export default VisualBuilder;
