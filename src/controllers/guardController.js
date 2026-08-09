import {
  getPassByManualCodeService,
  getVisitHistoryService,
} from "../services/guardService.js";

export const getVisitHistory = async (req, res, next) => {
  try {
    const visits = await getVisitHistoryService();

    return res.status(200).json({
      success: true,
      visits,
    });
  } catch (err) {
    next(err);
  }
};

export const getPassByCode = async (req, res, next) => {
  try {
    const { t } = req.query;

    if (!t) {
      return res.status(400).json({
        success: false,
        message: "Manual code is required.",
      });
    }

    const pass = await getPassByManualCodeService(t);
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

export const checkInPass = async (req, res, next) => {
  try {
    const passId = req.params.id;

    // Passport gives us the authenticated user.
    const guardId = req.user.id;

    const pass = await checkInVisitorPass(passId, guardId);

    return res.status(200).json({
      success: true,
      message: "Visitor checked in successfully.",
      data: pass,
    });
  } catch (err) {
    next(err);
  }
};

export const checkOutPass = async (req, res, next) => {
  try {
    const passId = req.params.id;

    const guardId = req.user.id;

    const pass = await checkOutVisitorPass(passId, guardId);

    return res.status(200).json({
      success: true,
      message: "Visitor checked out successfully.",
      data: pass,
    });
  } catch (err) {
    next(err);
  }
};
