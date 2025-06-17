import { Router } from "express";
import {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  renderTemplateHtml,
} from "../controller/template.controler";

const router = Router();

router.post("/", createTemplate);
router.get("/", getAllTemplates);
router.get("/:id", getTemplateById);
router.put("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

// API fill giá trị vào html template
router.post("/export", renderTemplateHtml);

export { router };

// thêm api trả về html/pdf của template khi truyền giá trị vào
// cho chọn loại trả về là html hay pdf
