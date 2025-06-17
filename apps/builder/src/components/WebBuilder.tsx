import { FC, RefObject, useEffect, useRef, useState } from "react";
import { GjsEditor } from "./GrapesEditor";
import juice from "juice";
import { inlineHtml } from "@/libs/inlineHtml";
import { Editor } from "preset-web";

type WebBuilderProps = {
  initialContent?: { html: string; css: string };
  editorInstanceRef: RefObject<Editor>;
};

export const WebBuilder: FC<WebBuilderProps> = ({
  initialContent,
  editorInstanceRef,
}) => {
  return (
    <div className="h-full flex-1 bg-gray-50">
      <GjsEditor
        initialContent={inlineHtml(
          initialContent?.html || "",
          initialContent?.css || ""
        )}
        editorInstanceRef={editorInstanceRef}
      />
    </div>
  );
};
