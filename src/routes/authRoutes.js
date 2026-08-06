import { Router } from "express";
import { ensureAuth } from "../middlewares/authMiddleware.js";
import {
  signUpValidator,
  loginValidator,
} from "../middlewares/validators/authValidator.js";
import {
  postSignup,
  postSignin,
  getSignout,
} from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/signup", signUpValidator, postSignup);
authRoutes.post("/signin", loginValidator, postSignin);
authRoutes.post("/signout", getSignout);

export default authRoutes;
