import {
  createUserInDB,
  getAllVisitorPassesFromDB,
  getDashboardStatsFromDB,
  updateUserInDB,
  updateVisitorPassInDB,
} from "../repositories/adminRepository.js";
import AppError from "../utils/appError.js";
import { hashPassword } from "../utils/hash.js";

export const getAllVisitorPassesService = async ({
  page,
  limit,
  status,
  search,
}) => {
  return getAllVisitorPassesFromDB({
    page,
    limit,
    status,
    search,
  });
};

export const getDashboardStatsService = async () => {
  return getDashboardStatsFromDB();
};

export const updateUserService = async ({
  id,
  fullName,
  role,
  unit,
  email,
  phone,
  active,
}) => {
  return updateUserInDB({
    id,
    fullName,
    role,
    unit,
    email,
    phone,
    active,
  });
};

export const createUserService = async ({
  email,
  password,
  fullName,
  role,
  unit,
  phone,
}) => {
  const passwordHash = await hashPassword(password);

  let block = null;
  let floor = null;
  let normalizedUnit = null;

  if (role === "resident") {
    if (!unit) {
      throw new AppError("Unit is required for residents.", 400);
    }

    normalizedUnit = unit.trim().toUpperCase();

    const match = normalizedUnit.match(/^([A-Z])-(\d{3})$/);

    if (!match) {
      throw new AppError(
        "Invalid unit format. Expected format like B-304.",
        400,
      );
    }

    block = match[1];
    floor = Number(match[2].charAt(0));
  }

  return createUserInDB({
    email,
    passwordHash,
    fullName,
    role,
    phone,
    unit: normalizedUnit,
    block,
    floor,
  });
};
export const updateVisitorPassService = async (id, status) => {
  if (status !== "cancelled") {
    throw new AppError("Invalid visitor pass status.", 400);
  }

  const pass = await updateVisitorPassInDB(id, status);

  if (!pass) {
    throw new Error("Visitor pass not found.");
  }

  return pass;
};
