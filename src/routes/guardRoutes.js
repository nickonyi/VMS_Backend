import { Router } from "express";
import {
  getPassByCode,
  getVisitHistory,
} from "../controllers/guardController.js";
import { getPassByToken } from "../controllers/residentController.js";

const router = Router();

router.get("/visit-logs", getVisitHistory);
router.get("/verify", getPassByCode);

export default router;
