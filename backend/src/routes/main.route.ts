import { Router } from "express";
import { AuthGuard } from "../app/middlewares/auth.middleware";
import auth from "./auth.route";
import users from "./users.route";
import profile from "./profile.route";
import group from "./groups.route";
import sidebars from "./sidebars.route";

const router = Router();
router.use("/auth", auth);
router.use("/profile", AuthGuard, profile);

router.use("/users", AuthGuard, users);
router.use("/groups", AuthGuard, group);
router.use("/sidebars", AuthGuard, sidebars);

export default router;
