import { ostTypeHideInSimpleHtmlTrait } from "../const/consts";
import PluginOptions, { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Scale the new range
  DomComponents.addType("scale", {
    isComponent: (el) => el.tagName === "DIV" && el.classList.contains("scale"),
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class: "scale",
          "data-percent": "66",
          "data-fcolor": "#3b5998",
          "data-bgcolor": "#CCCCCC",
        },
        style: {
          "box-sizing": "border-box",
          padding: "0",
          height: "20px",
          "max-width": "100%",
          border: "0px solid #666666",
          background: "linear-gradient(to right,#3b5998 66%, #CCCCCC 66%);",
        },
        traits: [
          {
            name: "percent",
            type: "number",
            min: 0,
            max: 100,
            label: opts.t9n.labelScalePercent,
            changeProp: true,
          },
          {
            name: "fcolor",
            type: "color",
            label: opts.t9n.labelScaleBarColor,
            placeholder: "#222222",
            changeProp: true,
          },
          {
            name: "bgcolor",
            type: "color",
            label: opts.t9n.labelScaleBgColor,
            placeholder: "#cccccc",
            changeProp: true,
          },
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
      init() {
        const scaleAttr = this.getAttributes();
        this.set("percent", scaleAttr["data-percent"]);
        this.set("bgcolor", scaleAttr["data-bgcolor"]);
        this.set("fcolor", scaleAttr["data-fcolor"]);

        this.on("change:percent", this.updateScale);
        this.on("change:bgcolor", this.updateScale);
        this.on("change:fcolor", this.updateScale);
      },
      updateScale() {
        var p = this.get("percent");
        var b = this.get("bgcolor");
        var f = this.get("fcolor");
        this.set("attributes", {
          "data-percent": p,
          "data-bgcolor": b,
          "data-fcolor": f,
        });
        this.addStyle({
          background: `linear-gradient(to right, ${f} ${p}%, ${b} ${p}%)`,
        });
      },
    },
  });
};
