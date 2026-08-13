import { Router } from "express";
import {
  getAllVisitorPasses,
  getDashboardStats,
  getUsers,
  updateUser,
} from "../controllers/adminController.js";

const router = Router();

router.get("/visitor-passes", getAllVisitorPasses);
router.get("/dashboard/stats", getDashboardStats);
router.get("/users", getUsers);
router.patch("/:id", updateUser);

export default router;
