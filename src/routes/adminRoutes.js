import { Router } from "express";
import {
  getAllVisitorPasses,
  getDashboardStats,
  getUsers,
} from "../controllers/adminController.js";

const router = Router();

router.get("/visitor-passes", getAllVisitorPasses);
router.get("/dashboard/stats", getDashboardStats);
router.get("/users", getUsers);

export default router;
