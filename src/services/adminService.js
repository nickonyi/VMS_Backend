import {
  createUserInDB,
  getAllVisitorPassesFromDB,
  getDashboardStatsFromDB,
  updateUserInDB,
  updateVisitorPassInDB,
} from "../repositories/adminRepository.js";
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
  phone,
  active,
}) => {
  return updateUserInDB({
    id,
    fullName,
    role,
    unit,
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
      throw new Error("Unit is required for residents.");
    }

    normalizedUnit = unit.trim().toUpperCase();

    const match = normalizedUnit.match(/^([A-Z])-(\d{3})$/);

    if (!match) {
      throw new Error("Invalid unit format. Expected format like B-304.");
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
    throw new Error("Invalid visitor pass status.");
  }

  const pass = await updateVisitorPassInDB(id, status);

  if (!pass) {
    throw new Error("Visitor pass not found.");
  }

  return pass;
};
