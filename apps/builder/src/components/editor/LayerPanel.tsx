import React from "react";

const LayerPanel = () => {
  return (
    <div className="panel__right w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="panel__switcher border-b border-gray-200 p-2 flex gap-2">
        {/* Panel switcher will be rendered here by GrapesJS */}
      </div>
      <div className="layers-container flex-1 p-4 overflow-y-auto">
        {/* Layers will be rendered here by GrapesJS */}
      </div>
      <div
        className="styles-container flex-1 p-4 overflow-y-auto"
        style={{ display: "none" }}
      >
        {/* Styles will be rendered here by GrapesJS */}
      </div>
    </div>
  );
};

export default LayerPanel;
