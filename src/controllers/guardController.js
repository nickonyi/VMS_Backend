import { getVisitHistoryService } from "../services/guardService.js";

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
