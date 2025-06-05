import React from "react";

type DeviceProps = {
  activeDevice: string;
  handleSetDevice: (device: string) => void;
};

const DevicePanel: React.FC<DeviceProps> = ({
  activeDevice,
  handleSetDevice,
}) => {
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
