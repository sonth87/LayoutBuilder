import { ORIENTATION, TEMPLATE_TYPE, PAGE_SIZE } from "../constant";

export type OrientationType = (typeof ORIENTATION)[keyof typeof ORIENTATION];

export type TemplateExportType =
  (typeof TEMPLATE_TYPE)[keyof typeof TEMPLATE_TYPE];

export type PageSizeType = (typeof PAGE_SIZE)[keyof typeof PAGE_SIZE];

export type PageSizeCustomType = {
  width: number;
  height: number;
  unit?: "mm" | "cm" | "in" | "px";
};
