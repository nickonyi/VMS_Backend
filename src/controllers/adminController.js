import { getAllVisitorPassesService } from "../services/adminService.js";

export const getAllVisitorPasses = async (req, res, next) => {
  try {
    const passes = await getAllVisitorPassesService();

    return res.status(200).json({
      success: true,
      passes,
    });
  } catch (err) {
    return next(err);
  }
};
