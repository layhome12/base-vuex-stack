import { Router } from "express";
import { GroupsController } from "../app/controllers/groups.controller";

const router = Router();
router.get("/", GroupsController.index);

export default router;
