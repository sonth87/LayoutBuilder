import { Response, Request } from "express";
import { Template } from "../model/template.model";
import { fillTemplateHtml } from "../util/fillHtml";
import { Types } from "mongoose";
import { ORIENTATION, PAGE_SIZE, TEMPLATE_TYPE } from "../constant";
import { exportInlineHtml, exportPdf } from "../util/export";

export const createTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template = new Template(req.body);
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTemplates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTemplateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    let template;

    if (Types.ObjectId.isValid(id)) template = await Template.findById(id);
    else template = await Template.findOne({ slug: id });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTemplate) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTemplate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * API: Trả về HTML đã fill giá trị theo template id hoặc slug.
 * Body: {
 *   values: Record<string, string>,
 *   exportType: 'html' | 'inline-html' | 'pdf'
 * }
 * Query: id hoặc slug
 */
export const renderTemplateHtml = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, slug } = req.query;
    const {
      values,
      "export-type": exportType = "html",
      orientation = ORIENTATION.portrait,
      "page-size": pageSize = PAGE_SIZE.A4,
    } = req.body;

    if (!id && !slug) {
      res.status(400).json({ message: "Missing template id or slug" });
      return;
    }

    // Validate exportType
    const validExportTypes = Object.values(TEMPLATE_TYPE);
    if (!validExportTypes.includes(exportType)) {
      res.status(400).json({ message: "Giá trị export type không hợp lệ." });
      return;
    }

    // Lấy template theo id hoặc slug
    const query = id ? { _id: id } : { slug };
    const template = await Template.findOne(query);

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // Lấy brackets, mặc định ["{{", "}}"]
    const brackets: [string, string] =
      Array.isArray(template.brackets) && template.brackets.length === 2
        ? [template.brackets[0], template.brackets[1]]
        : ["{{", "}}"];

    // cho phép values là một object hoặc array
    const valuesArray = Array.isArray(values) ? values : [values || {}];

    // Fill giá trị vào html
    const renderSingleTemplate = (singleValues: Record<string, string>) => {
      const filledHtml = fillTemplateHtml(
        template.html,
        singleValues,
        brackets
      );
      return decodeURIComponent(filledHtml);
    };

    // const filledHtml = fillTemplateHtml(template.html, values || {}, brackets);
    // const decodedHtml = decodeURIComponent(filledHtml);
    const css = template.css || "";

    switch (exportType) {
      case TEMPLATE_TYPE.html: {
        const renderedHtmls = valuesArray.map(renderSingleTemplate);
        res.status(200).json({ html: renderedHtmls, css });
        break;
      }
      case TEMPLATE_TYPE["inline-html"]:
      case TEMPLATE_TYPE.email: {
        const renderedHtmls = valuesArray.map(renderSingleTemplate);
        const inlinedHtmls = renderedHtmls.map((html) =>
          exportInlineHtml({ html, css })
        );

        if (inlinedHtmls.every((html) => html))
          res.status(200).json({
            html: Array.isArray(values) ? inlinedHtmls : inlinedHtmls[0],
          });
        else res.status(500).json({ message: "Error processing inline HTML" });

        break;
      }
      case TEMPLATE_TYPE.pdf:
        {
          if (Array.isArray(values)) {
            // Với PDF, merge tất cả HTML thành 1 file
            const renderedHtmls = valuesArray.map(renderSingleTemplate);
            const wrappedHtmls = renderedHtmls.map(
              (html, index) => `
        <div style="position: relative; page-break-after: ${index === renderedHtmls.length - 1 ? "auto" : "always"};">
          ${html}
        </div>
      `
            );
            const combinedHtml = wrappedHtmls.join("");

            const result = await exportPdf({
              html: combinedHtml,
              css,
              orientation,
              pageSize,
            });

            if (!result) {
              res.status(500).json({ message: "Error generating PDF" });
            } else {
              res.setHeader("Content-Type", "application/pdf");
              res.setHeader(
                "Content-Disposition",
                `attachment; filename="${template.slug || "template"}.pdf"`
              );
              res.status(200).send(result);
            }
          } else {
            // Single PDF như cũ
            const decodedHtml = renderSingleTemplate(valuesArray[0]);
            const result = await exportPdf({
              html: decodedHtml,
              css,
              orientation,
              pageSize,
            });

            if (!result) {
              res.status(500).json({ message: "Error generating PDF" });
            } else {
              res.setHeader("Content-Type", "application/pdf");
              res.setHeader(
                "Content-Disposition",
                `attachment; filename="${template.slug || "template"}.pdf"`
              );
              res.status(200).send(result);
            }
          }
        }
        break;

      default:
        res.status(400).json({ message: "Invalid export type" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
