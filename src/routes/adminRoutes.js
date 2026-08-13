import { Router } from "express";
import {
  createUser,
  getAllVisitorPasses,
  getDashboardStats,
  getUsers,
  updateUser,
  updateVisitorPass,
} from "../controllers/adminController.js";

const router = Router();

router.get("/visitor-passes", getAllVisitorPasses);
router.get("/dashboard/stats", getDashboardStats);
router.get("/users", getUsers);

router.post("/users", createUser);

router.patch("/visitor-passes/:id", updateVisitorPass);
router.patch("/:id", updateUser);

export default router;
