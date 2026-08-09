import { Router } from "express";
import { ensureAuth } from "../middlewares/authMiddleware.js";
import {
  cancelPass,
  checkInPass,
  checkOutPass,
  createVisitorPass,
  getMyVisitorPasses,
  getPass,
  getPassByToken,
} from "../controllers/residentController.js";
import { validateCreateVisitorPass } from "../middlewares/validators/passValidator.js";
import { requireRole } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/my-passes", getMyVisitorPasses);
router.get("/:id", getPass);

router.post("/", validateCreateVisitorPass, createVisitorPass);
router.post("/:id/check-in", checkInPass);
router.post("/:id/check-out", checkOutPass);
router.patch("/:passId/cancel", ensureAuth, cancelPass);

export default router;
