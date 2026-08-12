import {
  getAllVisitorPassesService,
  getDashboardStatsService,
} from "../services/adminService.js";
import { getAllUsers } from "../services/guardService.js";

export const getAllVisitorPasses = async (req, res, next) => {
  try {
    const visits = await getAllVisitorPassesService();

    return res.status(200).json({
      success: true,
      visits,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();
    console.log(stats);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};
