import { Router } from "express";
import {
  checkInPass,
  checkOutPass,
  getPassByCode,
  getVisitHistory,
} from "../controllers/guardController.js";
import { getPassByToken } from "../controllers/residentController.js";

const router = Router();

router.get("/visit-logs", getVisitHistory);
router.get("/verify", getPassByCode);
router.post("/:id/check-in", checkInPass);
router.post("/:id/check-out", checkOutPass);

export default router;
