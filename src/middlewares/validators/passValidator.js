import { body } from "express-validator";

export const validateCreateVisitorPass = [
  body("guestName")
    .trim()
    .notEmpty()
    .withMessage("Guest name is required.")
    .isLength({ max: 100 })
    .withMessage("Guest name cannot exceed 100 characters."),

  body("guestPhone")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Guest phone cannot exceed 20 characters."),
  body("guestEmail")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .isLength({ max: 255 })
    .withMessage("Email cannot exceed 255 characters."),
  body("numberOfGuests")
    .isInt({ min: 1 })
    .withMessage("Number of guests must be at least 1."),

  body("vehicleReg")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage("Vehicle registration cannot exceed 20 characters."),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required.")
    .isIn(["family", "friend", "delivery", "maintenance", "business", "other"])
    .withMessage("Invalid purpose."),

  body("expectedArrivalAt")
    .isISO8601()
    .withMessage("Expected arrival time is invalid."),

  body("expiresAt")
    .isISO8601()
    .withMessage("Expiry time is invalid.")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.expectedArrivalAt)) {
        throw new Error("Expiry time must be after the expected arrival time.");
      }

      return true;
    }),
];
