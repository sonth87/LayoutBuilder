import PluginOptions, { Editor } from "../types/pluginOptions";

export default (editor: Editor, opts: Required<PluginOptions>) => {
  const { DomComponents } = editor;

  // Add webblock trait to video components
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
          label: "Blocks",
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
};
