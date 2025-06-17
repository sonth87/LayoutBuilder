import { Router } from "express";
import { router as TemplateRouter } from "./template.routes";

export const router: Router = Router();

router.use("/template", TemplateRouter);
