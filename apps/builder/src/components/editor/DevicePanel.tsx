import React, { useEffect } from "react";

type DeviceProps = {
  activeDevice: string;
  handleSetDevice: (device: string) => void;
  editorInstance?: any; // Add editor instance prop
};

const DevicePanel: React.FC<DeviceProps> = ({
  activeDevice,
  handleSetDevice,
  editorInstance,
}) => {
  // Effect to handle background image when device changes
  useEffect(() => {
    if (!editorInstance) return;

    if (activeDevice === "A4 Landscape") {
      // Add background style for A4 Landscape
      editorInstance.Canvas.getBody().style.backgroundImage = "url('/images/phoi cu nhan.jpg')";
      editorInstance.Canvas.getBody().style.backgroundSize = "contain";
      editorInstance.Canvas.getBody().style.backgroundRepeat = "no-repeat";
      editorInstance.Canvas.getBody().style.backgroundPosition = "center";
    } else {
      // Remove background for other devices
      editorInstance.Canvas.getBody().style.backgroundImage = "none";
    }
  }, [activeDevice, editorInstance]);

  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-1 rounded ${
          activeDevice === "Desktop" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleSetDevice("Desktop")}
      >
        Desktop
      </button>
      <button
        className={`px-3 py-1 rounded ${
          activeDevice === "Tablet" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleSetDevice("Tablet")}
      >
        Tablet
      </button>
      <button
        className={`px-3 py-1 rounded ${
          activeDevice === "Mobile" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleSetDevice("Mobile")}
      >
        Mobile
      </button>
      <button
        className={`px-3 py-1 rounded ${
          activeDevice === "A4 Landscape"
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => handleSetDevice("A4 Landscape")}
      >
        A4 Landscape
      </button>
    </div>
  );
};

export default DevicePanel;
