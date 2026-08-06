import { matchedData, validationResult } from "express-validator";
import passport from "../config/passportConfig.js";
import { registerUser } from "../services/authService.js";

export const postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const mappedErrors = {};

      errors.array().forEach((err) => {
        if (!mappedErrors[err.path]) {
          mappedErrors[err.path] = err.msg;
        }
      });

      return res.status(400).json({
        success: false,
        errors: mappedErrors,
      });
    }

    const { fullName, email, password } = matchedData(req);

    const { role, status, phone } = req.body;

    const user = await registerUser({
      fullName,
      email,
      phone,
      password,
      role,
      status,
    });

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.login(user, (err) => {
        if (err) return next(err);

        return res.status(201).json({
          success: true,
          message: "Account created successfully.",
          user,
        });
      });
    });
  } catch (err) {
    next(err);
  }
};

export const postSignin = (req, res, next) => {};
