import { Router } from "express";
import { getAllVisitorPasses } from "../controllers/adminController.js";

const router = Router();

router.get("/visitor-passes", getAllVisitorPasses);

export default router;
