import { Router } from "express";
import { ensureAuth } from "../middlewares/authMiddleware.js";
import {
  signUpValidator,
  loginValidator,
} from "../middlewares/validators/authValidator.js";
import { postSignup, postSignin } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/signup", signUpValidator, postSignup);
authRoutes.post("/signin", ensureAuth, loginValidator, postSignin);

export default authRoutes;
