import { Router } from "express";
import { GroupsController } from "../app/controllers/groups.controller";
import { ZodValidator } from "../app/middlewares/zod.middleware";
import { GroupRequest } from "../app/requests/groups.request";

const router = Router();
router.get("/", GroupsController.index);
router.put("/:id", ZodValidator(GroupRequest), GroupsController.access);

export default router;
