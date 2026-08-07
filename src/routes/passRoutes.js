import { Router } from "express";
import { ensureAuth } from "../middlewares/authMiddleware.js";
import { createVisitorPass, getPass } from "../controllers/passController.js";
import { validateCreateVisitorPass } from "../middlewares/validators/passValidator.js";

const passRoutes = Router();

passRoutes.post("/", ensureAuth, validateCreateVisitorPass, createVisitorPass);
passRoutes.get("/:id", ensureAuth, getPass);

export default passRoutes;
