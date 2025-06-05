export const styleManager = {
  appendTo: ".styles-container",
  sectors: [
    {
      name: "Dimension",
      open: false,
      buildProps: ["width", "min-height", "padding"],
      properties: [
        {
          type: "integer",
          name: "The width",
          property: "width",
          units: ["px", "%"],
          defaults: "auto",
          min: 0,
        },
      ],
    },
    {
      name: "Typography",
      open: false,
      buildProps: [
        "font-family",
        "font-size",
        "font-weight",
        "letter-spacing",
        "color",
        "line-height",
        "text-align",
      ],
    },
    {
      name: "Decorations",
      open: false,
      buildProps: [
        "opacity",
        "border-radius",
        "border",
        "box-shadow",
        "background",
      ],
    },
  ],
};
