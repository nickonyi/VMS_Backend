import { Router } from "express";
import {
  getAllVisitorPasses,
  getDashboardStats,
} from "../controllers/adminController.js";

const router = Router();

router.get("/visitor-passes", getAllVisitorPasses);
router.get("/dashboard/stats", getDashboardStats);

export default router;
