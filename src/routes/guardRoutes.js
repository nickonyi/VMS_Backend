import { Router } from "express";
import { getVisitHistory } from "../controllers/guardController.js";

const router = Router();

router.get("/visit-logs", getVisitHistory);

export default router;
