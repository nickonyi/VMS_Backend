import {
  createUserService,
  getAllVisitorPassesService,
  getDashboardStatsService,
  updateUserService,
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

export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { fullName, role, unit, phone, active } = req.body;

    const updates = await updateUserService({
      id,
      fullName,
      role,
      unit,
      phone,
      active,
    });

    return res.status(200).json({
      success: true,
      updates,
    });
  } catch (err) {
    return next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, fullName, role, unit, phone } = req.body;

    const user = await createUserService({
      email,
      password,
      fullName,
      role,
      unit,
      phone,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};
