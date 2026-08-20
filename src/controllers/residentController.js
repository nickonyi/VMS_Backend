import {
  cancelVisitorPass,
  createVisitorPassService,
  getPassById,
  getPassByTokenService,
  getResidentPasses,
} from "../services/residentService.js";
import { matchedData, validationResult } from "express-validator";
import { generateManualCode } from "../utils/util.js";

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

  const { guestId } = matchedData(req);

  const manualCode = generateManualCode(guestId);

  try {
    const pass = await createVisitorPassService(
      req.user.id,
      manualCode,
      matchedData(req),
    );

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

export const getMyVisitorPasses = async (req, res, next) => {
  try {
    const residentId = req.user.id;

    const passes = await getResidentPasses(residentId);

    res.status(200).json({
      success: true,
      data: passes,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelPass = async (req, res, next) => {
  try {
    const { passId } = req.params;

    const pass = await cancelVisitorPass(passId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Visitor pass cancelled successfully.",
      pass,
    });
  } catch (err) {
    next(err);
  }
};

export const getPassByToken = async (req, res, next) => {
  try {
    const { t } = req.query;

    if (!t) {
      return res.status(400).json({
        success: false,
        message: "QR token is required.",
      });
    }

    const pass = await getPassByTokenService(t);
    console.log(pass);

    if (!pass) {
      return res.status(404).json({
        success: false,
        message: "Visitor pass not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: pass,
    });
  } catch (err) {
    next(err);
  }
};
