import { Router } from "express";
import { SidebarController } from "../app/controllers/sidebars.controller";
import { ZodValidator } from "../app/middlewares/zod.middleware";
import { SidebarRequest } from "../app/requests/sidebars.request";

const router = Router();
router.get("/", SidebarController.index);
router.post("/", ZodValidator(SidebarRequest), SidebarController.create);
router.delete("/:key", SidebarController.destroy);

export default router;
