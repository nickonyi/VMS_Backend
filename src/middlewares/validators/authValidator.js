import { body } from "express-validator";

export const signUpValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Full name must be between 2 and 30 characters")
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage("Full name can only contain letters, spaces and hiphens"),
  ,
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain atleast an lowercase letter"),
];

export const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
