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
