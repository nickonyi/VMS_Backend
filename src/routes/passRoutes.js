import { Router } from "express";
import { ensureAuth } from "../middlewares/authMiddleware.js";
import { createVisitorPass } from "../controllers/passController.js";
import { validateCreateVisitorPass } from "../middlewares/validators/passValidator.js";

const passRoutes = Router();

passRoutes.post("/", ensureAuth, validateCreateVisitorPass, createVisitorPass);

export default passRoutes;
