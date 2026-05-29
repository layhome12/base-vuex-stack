import { Router } from "express";
import { AuthGuard } from "../app/middlewares/auth.middleware";
import auth from "./auth.route";
import users from "./users.route";
import profile from "./profile.route";
import group from "./groups.route";
import sidebars from "./sidebars.route";
import AccessGuard from "../app/middlewares/access.middleware";

const router = Router();
router.use("/auth", auth);
router.use("/profile", AuthGuard, profile);

router.use("/users", AuthGuard, AccessGuard("users"), users);
router.use("/groups", AuthGuard, AccessGuard("groups"), group);
router.use("/sidebars", AuthGuard, AccessGuard("sidebars"), sidebars);

export default router;
