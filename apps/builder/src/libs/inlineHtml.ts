import juice from "juice";
import * as prettier from "prettier";

export const splitHtmlCss = (html: string, css: string): string => {
  return `${html}<style>${css}</style>`;
};

export const inlineHtml = (html: string, css: string): string => {
  return juice(splitHtmlCss(html, css));
};

export const formatHtml = async (html: string) => {
  return await prettier.format(html, { semi: false, parser: "babel" });
};

export const htmlCssWithPrettier = async (
  html: string,
  css: string,
): Promise<string> => {
  const htmlCss = splitHtmlCss(html, css);
  return await formatHtml(htmlCss);
};
