import type { Editor } from "grapesjs";
import PluginOptions from "./pluginOptions";
import {
  uListItemContent,
  ulListItem,
  ostTypeTextTrait,
  ostTypeImageTrait,
  ostTypeHideInSimpleHtmlTrait,
  headerTrait,
  iconTrait,
  nameTrait,
  valueTrait,
} from "./consts";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Add ostendis block trait to video components
  var dType = DomComponents.getType("video");
  var dModel = dType?.model;
  var dView = dType?.view;
  const yt = "yt";
  const vi = "vi";
  const ytnc = "ytnc";

  DomComponents.addType("video", {
    model: dModel.extend({
      updateTraits() {
        const { em } = this;
        const prov = this.get("provider");
        let tagName = "iframe";
        let traits;

        switch (prov) {
          case yt:
          case ytnc:
            traits = this.getYoutubeTraits();
            break;
          case vi:
            traits = this.getVimeoTraits();
            break;
          default:
            tagName = "video";
            traits = this.getSourceTraits();
        }

        traits.push({
          type: "select",
          label: "Ostendis Blocks",
          name: "data-ost-type",
          options: [
            { id: "", name: opts.t9n.traitOstNone },
            { id: "videoURL", name: opts.t9n.traitOstVideoURL },
          ],
        });

        this.set({ tagName }, { silent: true }); // avoid break in view
        this.set({ traits });
        em.get("ready") && em.trigger("component:toggled");
      },
    }),
    view: dView,
  });

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

  // INPUT
  DomComponents.addType("range", {
    isComponent: (el) => el.tagName == "INPUT",
    model: {
      defaults: {
        tagName: "input",
        droppable: true,
        highlightable: true,
        traits: [nameTrait, valueTrait],
        attributes: { type: "range", disabled: true },
      },
    },
    extendFnView: ["updateAttributes"],
    view: {
      updateAttributes() {
        this.el.setAttribute("autocomplete", "on");
      },
    },
  });

  // Unsorted list item component
  DomComponents.addType("ulistitem", {
    isComponent: (el) => {
      if (el.tagName === "LI" && el.classList.contains("ulistitem")) {
        return { type: "ulistitem" };
      }
    },
    model: {
      defaults: {
        tagName: "li",
        draggable: "ul",
        attributes: { class: "ulistitem" },
        style: { "text-align": "left" },
        components: uListItemContent,
        traits: ["id", "title", ostTypeTextTrait(opts)],
      },
    },
  });

  // Unsorted list component with fontawesome
  DomComponents.addType("ulist", {
    isComponent: (el) => {
      if (el.tagName === "UL" && el.classList.contains("ulist")) {
        return { type: "ulist" };
      }
    },
    model: {
      defaults: {
        tagName: "ul",
        attributes: { class: "ulist fa-ul" },
        style: {
          padding: "0.2em 0",
          "margin-left": "2em",
          "line-height": "1.4em",
        },
        components: [ulListItem, ulListItem, ulListItem],
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Header component
  DomComponents.addType("header", {
    isComponent: (el) => {
      const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
      if (el.tagName && headings.includes(el.tagName.toLowerCase())) {
        return { type: "header" };
      }
    },
    extend: "text",
    model: {
      defaults: {
        tagName: "h1", //Default
        traits: [
          "id",
          headerTrait(opts),
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Icon component
  DomComponents.addType("icon", {
    isComponent: (el) => {
      var classNames = [
        "fa",
        "fas",
        "far",
        "fab",
        "fa-solid",
        "fa-regular",
        "fa-brands",
      ];
      if (
        el.tagName === "I" &&
        classNames.some((className) => el.classList.contains(className))
      ) {
        return { type: "icon" };
      }
    },
    model: {
      defaults: {
        tagName: "i",
        attributes: { class: "fas fa-star" },
        traits: ["id", iconTrait(opts), ostTypeHideInSimpleHtmlTrait(opts)],
      },
    },
  });

  // Add ostendis type trait to table components
  DomComponents.addType("table", {
    model: {
      defaults: {
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add ostendis type trait to link components
  DomComponents.addType("link", {
    model: {
      defaults: {
        traits: [
          "id",
          "href",
          "target",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add ostendis type trait to image components
  DomComponents.addType("image", {
    model: {
      defaults: {
        traits: [
          "id",
          "alt",
          ostTypeImageTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add ostendis type trait to text components
  DomComponents.addType("textnode", {
    model: {
      defaults: {
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add ostendis type trait to text components
  DomComponents.addType("text", {
    model: {
      defaults: {
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });

  // Add ostendis type trait to default components
  DomComponents.addType("default", {
    model: {
      defaults: {
        traits: [
          "id",
          ostTypeTextTrait(opts),
          ostTypeHideInSimpleHtmlTrait(opts),
        ],
      },
    },
  });
};
