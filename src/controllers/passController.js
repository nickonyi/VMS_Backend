import {
  createVisitorPassService,
  getPassById,
} from "../services/passService.js";
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

    return res.status(400).json({
      success: false,
      errors: mappedErrors,
    });
  }

  try {
    const pass = await createVisitorPassService(req.user.id, matchedData(req));
    console.log(pass);

    return res.status(201).json({
      success: true,
      message: "Visitor pass created successfully.",
      pass,
    });
  } catch (err) {
    next(err);
  }
};

export const getPass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pass = await getPassById(id);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Visitor pass not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: pass,
    });
  } catch (err) {
    next(err);
  }
};
