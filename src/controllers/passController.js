import { createVisitorPassService } from "../services/passService.js";
import { matchedData, validationResult } from "express-validator";

export const createVisitorPass = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mappedErrors = {};

    errors.array().forEach((err) => {
      if (!mappedErrors[err.path]) {
        mappedErrors[err.path] = err.msg;
      }
    });

    console.log(mappedErrors);

    return res.status(400).json({
      success: false,
      errors: mappedErrors,
    });
  }

  try {
    console.log(req.user.id);

    const pass = await createVisitorPassService(req.user.id, matchedData(req));

    return res.status(201).json({
      success: true,
      message: "Visitor pass created successfully.",
      pass,
    });
  } catch (err) {
    next(err);
  }
};
