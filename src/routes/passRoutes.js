import { Router } from "express";
import { ensureAuth } from "../middlewares/authMiddleware.js";
import {
  checkInPass,
  checkOutPass,
  createVisitorPass,
  getMyVisitorPasses,
  getPass,
  getPassByToken,
} from "../controllers/passController.js";
import { validateCreateVisitorPass } from "../middlewares/validators/passValidator.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const passRoutes = Router();

passRoutes.get("/my-passes", ensureAuth, getMyVisitorPasses);
passRoutes.get("/verify", ensureAuth, getPassByToken);
passRoutes.get("/:id", ensureAuth, getPass);

passRoutes.post("/", ensureAuth, validateCreateVisitorPass, createVisitorPass);
passRoutes.post("/:id/check-in", ensureAuth, requireRole("guard"), checkInPass);

passRoutes.post(
  "/:id/check-out",
  ensureAuth,
  requireRole("guard"),
  checkOutPass,
);

export default passRoutes;
