import { body } from "express-validator";

export const signUpValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Full name must be between 2 and 30 characters")
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage("Full name can only contain letters, spaces and hyphens"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
