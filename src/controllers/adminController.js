import {
  createUserService,
  getAllVisitorPassesService,
  getDashboardStatsService,
  updateUserService,
  updateVisitorPassService,
} from "../services/adminService.js";
import { getAllUsers } from "../services/guardService.js";

export const getAllVisitorPasses = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const status = req.query.status || "all";
    const search = req.query.search?.trim() || "";

    const result = await getAllVisitorPassesService({
      page,
      limit,
      status,
      search,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();

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

    const { fullName, role, unit, email, phone, active } = req.body;

    const updates = await updateUserService({
      id,
      fullName,
      role,
      unit,
      email,
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

export const updateVisitorPass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const pass = await updateVisitorPassService(id, status);

    return res.status(200).json({
      success: true,
      pass,
    });
  } catch (err) {
    next(err);
  }
};
