import type { Editor, BlockProperties } from "grapesjs";
import PluginOptions from "./pluginOptions";

export default function (editor: Editor, opts: Required<PluginOptions>) {
  const { Blocks } = editor;

  const addBlock = (id: string, blockDef: BlockProperties) => {
    opts.blocks.indexOf(id)! >= 0 &&
      editor.Blocks.add(id, {
        select: true,
        ...blockDef,
        ...opts.block(id),
      });
  };

  Blocks.getAll().reset();

  Blocks.add("applyQrCode", {
    label: opts.t9n.applyQrCodeBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px;" viewBox="0 0 12.7 9.525">
      <path fill="currentColor" d="m2.7781 1.1906v2.2964h2.2964v-2.2964zm3.1469 0v0.76565h0.76507v-0.76565zm1.7005 0v2.2964h2.2964v-2.2964zm-4.0817 0.76565h0.76507v0.76507h-0.76507zm4.8474 0h0.76507v0.76507h-0.76507zm-2.4661 0.82902v0.76507h0.76507v-0.76507zm-3.1469 1.5947v0.76507h0.76565v-0.76507zm1.5307 0v0.76507h0.76565v-0.76507zm1.6162 0v0.76507h0.76507v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm-3.2312 1.5947v0.76507h0.76507v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm-6.3781 0.063368v2.2964h2.2964v-2.2964zm0.76565 0.76565h0.76507v0.76507h-0.76507zm2.3813 0.76507v0.76565h0.76507v-0.76565zm1.6156 0v0.76565h0.76565v-0.76565zm1.6156 0v0.76565h0.76565v-0.76565z" stroke-width=".51027"/>
    </svg>`,
    content: {
      type: "image",
      editable: false,
      droppable: true,
      attributes: {
        src: "$$$ApplyQrCode$$$",
        alt: "Apply link QR code",
      },
    },
  });

  Blocks.add("viewQrCode", {
    label: opts.t9n.viewQrCodeBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px;" viewBox="0 0 12.7 9.525">
      <path fill="currentColor" d="m2.7781 1.1906v2.2964h2.2964v-2.2964zm3.1469 0v0.76565h0.76507v-0.76565zm1.7005 0v2.2964h2.2964v-2.2964zm-4.0817 0.76565h0.76507v0.76507h-0.76507zm4.8474 0h0.76507v0.76507h-0.76507zm-2.4661 0.82902v0.76507h0.76507v-0.76507zm-3.1469 1.5947v0.76507h0.76565v-0.76507zm1.5307 0v0.76507h0.76565v-0.76507zm1.6162 0v0.76507h0.76507v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm-3.2312 1.5947v0.76507h0.76507v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm1.6156 0v0.76507h0.76565v-0.76507zm-6.3781 0.063368v2.2964h2.2964v-2.2964zm0.76565 0.76565h0.76507v0.76507h-0.76507zm2.3813 0.76507v0.76565h0.76507v-0.76565zm1.6156 0v0.76565h0.76565v-0.76565zm1.6156 0v0.76565h0.76565v-0.76565z" stroke-width=".51027"/>
    </svg>`,
    content: {
      type: "image",
      editable: false,
      droppable: true,
      attributes: {
        src: "$$$ViewQrCode$$$",
        alt: "View link QR code",
      },
    },
  });

  var btnStyle = `display: block; padding: 10px 30px; margin: 10px auto; text-decoration: none; border: none; color: #fff; text-align: center; background-color: #4b75cd; border-radius: 0.25rem 0.25rem 0.25em 0.25rem;`;

  Blocks.add("applyButton", {
    label: opts.t9n.buttonApplyBlkLabel,
    category: opts.t9n.categoryLabel,
    content:
      `<a data-gjs-type="link" href="$$$ApplyLink$$$" target="_blank" role="button" style="` +
      btnStyle +
      `">${opts.t9n.buttonApplyBlkText}</a>`,
    media: `<svg style="width:54px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="m0.87695 1.1856c-0.46379 0-0.87695 0.3355-0.87695 0.7891v3.2851c0 0.4536 0.41316 0.7891 0.87695 0.7891h5.3676v1.7446c0 0.12334 0.099882 0.22273 0.22221 0.22273 0.063691 0 0.12549-0.027437 0.16795-0.075964l0.83509-0.9555 0.58704 1.1762c0.079866 0.15973 0.27435 0.22404 0.43408 0.14418 0.15973-0.079866 0.22404-0.27383 0.14418-0.43357l-0.57309-1.1493h1.1942c0.12334 0 0.22324-0.10042 0.22324-0.22376 0-0.063691-0.027421-0.12394-0.074931-0.1664l-0.31884-0.28319h2.7363c0.46379 0 0.87695-0.3355 0.87695-0.7891v-3.2851c0-0.4536-0.41316-0.7891-0.87695-0.7891zm0 0.48214h10.945c0.2413 0 0.39688 0.15381 0.39688 0.30696v3.2851c0 0.15315-0.15557 0.30644-0.39688 0.30644h-3.2789l-1.9084-1.696c-0.043471-0.038418-0.09792-0.059945-0.15555-0.059945-0.1294 0-0.23461 0.10521-0.23461 0.23461v1.5214h-5.3676c-0.2413 0-0.39429-0.15329-0.39429-0.30644v-3.2851c0-0.15315 0.15299-0.30696 0.39429-0.30696z"/>
        </svg>`,
  });

  Blocks.add("button", {
    label: opts.t9n.buttonBlkLabel,
    category: opts.t9n.categoryLabel,
    content:
      `<a data-gjs-type="link" role="button" style="` +
      btnStyle +
      `">Button</a>`,
    media: `<svg style="width:54px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="m0.87695 1.1856c-0.46379 0-0.87695 0.3355-0.87695 0.7891v3.2851c0 0.4536 0.41316 0.7891 0.87695 0.7891h5.3676v1.7446c0 0.12334 0.099882 0.22273 0.22221 0.22273 0.063691 0 0.12549-0.027437 0.16795-0.075964l0.83509-0.9555 0.58704 1.1762c0.079866 0.15973 0.27435 0.22404 0.43408 0.14418 0.15973-0.079866 0.22404-0.27383 0.14418-0.43357l-0.57309-1.1493h1.1942c0.12334 0 0.22324-0.10042 0.22324-0.22376 0-0.063691-0.027421-0.12394-0.074931-0.1664l-0.31884-0.28319h2.7363c0.46379 0 0.87695-0.3355 0.87695-0.7891v-3.2851c0-0.4536-0.41316-0.7891-0.87695-0.7891zm0 0.48214h10.945c0.2413 0 0.39688 0.15381 0.39688 0.30696v3.2851c0 0.15315-0.15557 0.30644-0.39688 0.30644h-3.2789l-1.9084-1.696c-0.043471-0.038418-0.09792-0.059945-0.15555-0.059945-0.1294 0-0.23461 0.10521-0.23461 0.23461v1.5214h-5.3676c-0.2413 0-0.39429-0.15329-0.39429-0.30644v-3.2851c0-0.15315 0.15299-0.30696 0.39429-0.30696z"/>
        </svg>`,
  });

  Blocks.add("header", {
    label: opts.t9n.headerBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px;" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m8.4664 2.3913 0.3777 1.3753-0.31258 0.082201c-0.14652-0.27506-0.2963-0.55011-0.46886-0.68922-0.17257-0.13595-0.37444-0.13595-0.57306-0.13595h-0.814v3.3196c0 0.15808 0 0.31616 0.10745 0.3952 0.1107 0.079039 0.3256 0.079039 0.54375 0.079039v0.31616h-1.9536v-0.31616c0.21815 0 0.43305 0 0.54375-0.07904 0.10745-0.079039 0.10745-0.23712 0.10745-0.3952v-3.3196h-0.814c-0.19862 0-0.40049 0-0.57306 0.13595-0.17257 0.13911-0.32234 0.41417-0.46886 0.68922l-0.31258-0.082201 0.3777-1.3753z" stroke-width=".32084"/>
    </svg>`,
    content: {
      type: "header",
      content: "Title",
    },
  });

  Blocks.add("text", {
    label: opts.t9n.textBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px;" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m1.8299 1.9461v0.52917h9.0403v-0.52917h-9.0403zm0 1.0206v0.52917h7.2135v-0.52917h-7.2135zm0 1.0206v0.52917h9.0403v-0.52917h-9.0403zm0 1.0211v0.52917h7.2135v-0.52917h-7.2135zm0 1.0206v0.52917h9.0403v-0.52917h-9.0403zm0 1.0206v0.52917h7.2135v-0.52917h-7.2135z"/>
    </svg>`,
    content: {
      type: "text",
      content: "Text",
    },
  });

  Blocks.add("text2", {
    label: opts.t9n.textBlkLabelWithSpace,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px;" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m1.8299 1.9461v0.52917h9.0403v-0.52917h-9.0403zm0 1.0206v0.52917h7.2135v-0.52917h-7.2135zm0 1.0206v0.52917h9.0403v-0.52917h-9.0403zm0 1.0211v0.52917h7.2135v-0.52917h-7.2135zm0 1.0206v0.52917h9.0403v-0.52917h-9.0403zm0 1.0206v0.52917h7.2135v-0.52917h-7.2135z"/>
    </svg>`,
    content: {
      type: "text",
      content: "Text",
      style: { "margin-top": "15px", "margin-bottom": "15px" },
    },
  });

  Blocks.add("titleAndText", {
    label: opts.t9n.titleAndTextBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m1.8299 1.9461v1.0583h8.1695v-1.0583h-8.1695zm0 2.0412v0.52917h9.0403v-0.52917h-9.0403zm0 1.0211v0.52917h7.2135v-0.52917h-7.2135zm0 1.0206v0.52917h9.0403v-0.52917h-9.0403zm0 1.0206v0.52917h7.2135v-0.52917h-7.2135z" stroke-width=".3322"/>
        </svg>`,
    content: [
      {
        tagname: "div",
        components: [
          {
            type: "header",
            tagName: "h3",
            content: "Title",
          },
          { tagname: "div", components: [{ type: "text", content: "Text" }] },
        ],
      },
    ],
  });

  Blocks.add("ulist", {
    label: opts.t9n.ulistBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m2.3859 2.1921a0.52917 0.52917 0 0 0-0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917-0.52917 0.52917 0.52917 0 0 0-0.52917-0.52917zm1.2707 0.26458v0.52917h7.2135v-0.52917h-7.2135zm-1.2707 1.7766a0.52917 0.52917 0 0 0-0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917-0.52917 0.52917 0.52917 0 0 0-0.52917-0.52917zm1.2707 0.26458v0.52917h7.2135v-0.52917h-7.2135zm-1.2707 1.7766a0.52917 0.52917 0 0 0-0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917-0.52917 0.52917 0.52917 0 0 0-0.52917-0.52917zm1.2707 0.26458v0.52917h7.2135v-0.52917h-7.2135z"/>
      </svg>`,
    content: { type: "ulist" },
  });

  Blocks.add("titleAndList", {
    label: opts.t9n.titleAndListBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m1.8299 2.1854v1.0583h8.1623v-1.0583h-8.1623zm0.55604 2.0479a0.52917 0.52917 0 0 0-0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917-0.52917 0.52917 0.52917 0 0 0-0.52917-0.52917zm1.2707 0.26458v0.52917h7.2135v-0.52917h-7.2135zm-1.2707 1.7766a0.52917 0.52917 0 0 0-0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917 0.52917 0.52917 0.52917 0 0 0 0.52917-0.52917 0.52917 0.52917 0 0 0-0.52917-0.52917zm1.2707 0.26458v0.52917h7.2135v-0.52917h-7.2135z"/>
      </svg>`,
    content: [
      {
        tagname: "div",
        components: [
          {
            type: "header",
            tagName: "h3",
            content: "Title",
          },
          { tagname: "div", components: [{ type: "ulist" }] },
        ],
      },
    ],
  });

  Blocks.add("divider", {
    label: opts.t9n.dividerBlkLabel,
    category: opts.t9n.categoryLabel,
    content: `<hr style="border-top: 1px solid #2b303b;">`,
    media: `<svg style="width:60px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m-1.4833e-5 4.5835h12.7v0.35797h-12.7z"/>
      </svg>`,
  });

  Blocks.add("icon", {
    label: opts.t9n.iconBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 12.7 9.525" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="m6.1759 1.5875c-0.067716 0-0.13494 0.025902-0.18655 0.077515l-1.9275 1.9265-0.87023-0.8692c-0.10323-0.10323-0.27091-0.10323-0.37414 0-0.10323 0.10323-0.10323 0.27091 0 0.37414l1.0568 1.0568c0.10323 0.10323 0.27091 0.10323 0.37414 0l2.1141-2.1136c0.10322-0.10323 0.10322-0.27143 0-0.37465h0.0010336c-0.051608-0.051613-0.11987-0.077515-0.18759-0.077515zm2.3988 0a1.3854 1.3854 0 0 0-1.3854 1.3854 1.3854 1.3854 0 0 0 1.3854 1.386 1.3854 1.3854 0 0 0 1.3854-1.386 1.3854 1.3854 0 0 0-1.3854-1.3854zm0 0.49661a0.889 0.889 0 0 1 0.88935 0.88883 0.889 0.889 0 0 1-0.88935 0.88935 0.889 0.889 0 0 1-0.88883-0.88935 0.889 0.889 0 0 1 0.88883-0.88883zm-0.096118 2.8897c-0.063262 0-0.12645 0.024129-0.17467 0.072347-0.096436 0.096436-0.096436 0.2529 0 0.34933l0.8139 0.81339h-2.3668c-0.13655 0-0.24701 0.10994-0.24701 0.2465 0 0.13655 0.11046 0.24701 0.24701 0.24701h2.3657l-0.81235 0.81339c-0.096436 0.096436-0.096436 0.2529 0 0.34933 0.096436 0.096436 0.25341 0.096436 0.34985 0l1.234-1.2346-5.167e-4 -5.167e-4c0.096436-0.096436 0.096436-0.2529 0-0.34933l-1.2346-1.2346c-0.048218-0.048218-0.1114-0.072347-0.17467-0.072347zm-4.2344 0.045475c-0.0701 0-0.13304 0.039629-0.16381 0.10232l-0.3669 0.75396-0.81804 0.12092c-0.068389 0.010262-0.12567 0.057966-0.14676 0.12351-0.021088 0.06554-0.0040554 0.13811 0.044958 0.18655l0.59428 0.58756-0.14056 0.83044c-0.011402 0.068389 0.017477 0.13782 0.073897 0.17828 0.056422 0.040464 0.13069 0.045922 0.19224 0.013436l0.73122-0.39067 0.73122 0.39067c0.061552 0.032485 0.13633 0.027597 0.19275-0.013436 0.056423-0.041034 0.08478-0.10989 0.07338-0.17828l-0.14056-0.83044 0.59376-0.58756c0.049012-0.048444 0.066616-0.12101 0.044958-0.18655-0.021657-0.06554-0.077856-0.11325-0.14624-0.12351l-0.81907-0.12092-0.36639-0.75396c-0.030206-0.06269-0.094231-0.10232-0.16433-0.10232z" stroke-width=".34931"/>
      </svg>`,
    content: { type: "icon" },
  });

  Blocks.add("image", {
    label: opts.t9n.imageBlkLabel,
    category: opts.t9n.categoryLabel,
    attributes: { class: "fa-regular fa-image" },
    content: {
      type: "image",
      activeOnRender: 1,
    },
  });

  Blocks.add("video", {
    label: opts.t9n.videoBlkLabel,
    category: opts.t9n.categoryLabel,
    attributes: { class: "fa-brands fa-youtube" },
    content: {
      type: "video",
      src: "/video.mp4",
      style: {
        width: "100%",
        height: "350px",
      },
    },
  });

  Blocks.add("box", {
    label: opts.t9n.boxBlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"></path>
      </svg>`,
    content: {
      style: {
        padding: "20px",
      },
    },
  });

  Blocks.add("sect55", {
    label: opts.t9n.sect55BlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 23 24">
        <path fill="currentColor" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"></path>
      </svg>`,
    content: `<div style="display:flex; flex-wrap: wrap; padding: 0.2rem 0">
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 280px; padding:20px;"></div>
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 280px; padding:20px;"></div>
     </div>`,
  });

  Blocks.add("sect37", {
    label: opts.t9n.sect37BlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2 20h5V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM10 20h12V4H10v16Zm-1 0V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1Z"></path>
      </svg>`,
    content: `<div style="display:flex; flex-wrap: wrap; padding: 0.2rem 0">
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 38.2%; min-width:200px; padding:20px;"></div>
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 61.8%; padding:20px;"></div>
     </div>`,
  });

  Blocks.add("sect333", {
    label: opts.t9n.sect333BlkLabel,
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 23 24">
        <path fill="currentColor" d="M2 20h4V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM17 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1ZM9.5 20h4V4h-4v16Zm-1 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1Z"></path>
      </svg>`,
    content: `<div style="display:flex; flex-wrap: wrap; padding: 0.2rem 0">
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 200px; padding:20px;"></div>
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 200px; padding:20px;"></div>
        <div style="flex-grow: 1; flex-shrink: 1; flex-basis: 200px; padding:20px;"></div>
     </div>`,
  });

  Blocks.add("box", {
    label: "Box",
    category: opts.t9n.categoryLabel,
    media: `<svg style="width:60px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"></path>
      </svg>`,
    content: {
      style: {
        padding: "20px 20px 20px 20px",
      },
    },
  });

  Blocks.add("map", {
    label: opts.t9n.mapBlkLabel,
    category: opts.t9n.categoryLabel,
    attributes: { class: "fa-solid fa-map-location-dot" },
    content: {
      type: "map",
      style: {
        width: "100%",
        height: "350px",
      },
    },
  });

  Blocks.add("link", {
    label: opts.t9n.linkBlkLabel,
    category: opts.t9n.categoryLabel,
    attributes: { class: "fa-solid fa-link" },
    content: {
      type: "link",
      content: "Link",
    },
  });

  Blocks.add("link-block", {
    label: opts.t9n.linkBlockBlkLabel,
    category: opts.t9n.categoryLabel,
    attributes: { class: "fa-solid fa-link" },
    content: {
      type: "link",
      editable: false,
      droppable: true,
      style: {
        display: "inline-block",
        padding: "5px",
        "min-height": "50px",
        "min-width": "50px",
      },
    },
  });

  Blocks.add("scale", {
    label: opts.t9n.inputRangeBlkLabel,
    category: opts.t9n.categoryLabel,
    content: { type: "scale" },
    attributes: { class: "fa-solid fa-bars-progress" },
  });

  // Social media sites blocks
  Blocks.add("facebook", {
    label: opts.t9n.facebookBlkLabelSite,
    category: opts.t9n.smSitesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://facebook.com/",
        target: "_blank",
      },
      components: `<div style="display:flex; justify-content: center; align-items: center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i aria-hidden="true" class="fa-brands fa-square-facebook"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-facebook" },
  });

  Blocks.add("instagram", {
    label: opts.t9n.instagramBlkLabelSite,
    category: opts.t9n.smSitesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://instagram.com/",
        target: "_blank",
      },
      components: `<div style="display:flex; justify-content: center; align-items: center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i aria-hidden="true" class="fab fa-instagram-square"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-instagram" },
  });

  Blocks.add("youtube", {
    label: opts.t9n.youtubeBlkLabelSite,
    category: opts.t9n.smSitesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://www.youtube.com/",
        target: "_blank",
      },
      components: `<div style="display:flex; justify-content: center; align-items: center; width:28px; height:28px; font-size:28px; color:#293133;">
                     <i class="fa-brands fa-square-youtube"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-youtube" },
  });

  Blocks.add("linkedin", {
    label: opts.t9n.linkedinBlkLabelSite,
    category: opts.t9n.smSitesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://linkedin.com/",
        target: "_blank",
      },
      components: `<div style="display:flex; justify-content: center; align-items: center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i aria-hidden="true" class="fab fa-linkedin"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-linkedin" },
  });

  Blocks.add("xing", {
    label: opts.t9n.xingBlkLabelSite,
    category: opts.t9n.smSitesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://xing.com/",
        target: "_blank",
      },
      components: `<div style="display:flex; justify-content: center; align-items: center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i aria-hidden="true" class="fa-brands fa-square-xing"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-xing" },
  });

  Blocks.add("twitter", {
    label: opts.t9n.twitterBlkLabelSite,
    category: opts.t9n.smSitesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://twitter.com/",
        target: "_blank",
      },
      components: `<div style="display:flex; justify-content: center; align-items: center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i class="fa-brands fa-square-x-twitter"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-x-twitter" },
  });

  // Social Media Share blocks
  Blocks.add("facebookShare", {
    label: opts.t9n.facebookBlkLabelShare,
    category: opts.t9n.smSharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://www.facebook.com/sharer/sharer.php?u=$$$ViewLink$$$",
        target: "_blank",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="border: 2px solid #293133; border-radius: 3px; display:flex; justify-content: space-around; align-items: center; text-align:center; width:60px; height:28px; font-size:21px; color:#293133;">
                    <i class="fa-solid fa-share"></i>
                    <i class="fa-brands fa-facebook-f"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-facebook" },
  });

  Blocks.add("linkedinShare", {
    label: opts.t9n.linkedinBlkLabelShare,
    category: opts.t9n.smSharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://www.linkedin.com/shareArticle?mini=true&url=$$$ViewLink$$$",
        target: "_blank",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="border: 2px solid #293133; border-radius: 3px; display:flex; justify-content: space-around; align-items: center; text-align:center; width:60px; height:28px; font-size:21px; color:#293133;">
                    <i class="fa-solid fa-share"></i>
                    <i class="fa-brands fa-linkedin-in"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-linkedin" },
  });

  Blocks.add("xingShare", {
    label: opts.t9n.xingBlkLabelShare,
    category: opts.t9n.smSharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://www.xing.com/spi/shares/new?url=$$$ViewLink$$$",
        target: "_blank",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="border: 2px solid #293133; border-radius: 3px; display:flex; justify-content: space-around; align-items: center; text-align:center; width:60px; height:28px; font-size:21px; color:#293133;">
                    <i class="fa-solid fa-share"></i>
                    <i class="fa-brands fa-xing"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-xing" },
  });

  Blocks.add("twitterShare", {
    label: opts.t9n.twitterBlkLabelShare,
    category: opts.t9n.smSharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "https://twitter.com/intent/tweet?url=$$$ViewLink$$$&text=",
        target: "_blank",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="border: 2px solid #293133; border-radius: 3px; display:flex; justify-content: space-around; align-items: center; text-align:center; width:60px; height:28px; font-size:21px; color:#293133;">
                    <i class="fa-solid fa-share"></i>
                    <i class="fa-brands fa-x-twitter"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-x-twitter" },
  });

  Blocks.add("whatsAppShare", {
    label: opts.t9n.whatsAppBlkLabelShare,
    category: opts.t9n.smSharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        "data-ost-simple-hide": "1",
        href: "https://wa.me/?text=$$$ViewLink$$$",
        target: "_blank",
      },
      components: `<div style="border: 2px solid #293133; border-radius: 3px; display:flex; justify-content: space-around; align-items: center; text-align:center; width:60px; height:28px; font-size:21px; color:#293133;">
                    <i class="fa-solid fa-share"></i>
                    <i class="fa-brands fa-whatsapp"></i>
                  </div>`,
    },
    attributes: { class: "fa-brands fa-square-whatsapp" },
  });

  // conventional Shares
  Blocks.add("mail", {
    label: opts.t9n.mailBlkLabel,
    category: opts.t9n.sharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "mailto:example@mail.com?subject=Sieh%20dir%20dieses%20Inserat%20an&body=$$$ViewLink$$$",
        target: "_blank",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="display:inline-block; text-align:center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i class="fa-solid fa-envelope"></i>
                  </div>`,
    },
    attributes: { class: "fa-solid fa-square-envelope" },
  });

  Blocks.add("sms", {
    label: opts.t9n.smsBlkLabel,
    category: opts.t9n.sharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "sms:?body=Sieh%20dir%20dieses%20Inserat%20an%20$$$ViewLink$$$",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="display:inline-block; text-align:center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i class="fa-solid fa-comment-sms"></i>
                  </div>`,
    },
    attributes: { class: "fa-solid fa-comment-sms" },
  });

  Blocks.add("print", {
    label: opts.t9n.printBlkLabel,
    category: opts.t9n.sharesCategoryLabel,
    content: {
      type: "link",
      style: {
        display: "inline-block",
        margin: "3px",
        "text-decoration": "none",
      },
      attributes: {
        href: "javascript:if(window.print)window.print()",
        "data-ost-simple-hide": "1",
      },
      components: `<div style="display:inline-block; text-align:center; width:28px; height:28px; font-size:28px; color:#293133;">
                    <i class="fa-solid fa-print"></i>
                  </div>`,
    },
    attributes: { class: "fa-solid fa-print" },
  });
}
