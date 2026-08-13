import {
  createUserInDB,
  getAllVisitorPassesFromDB,
  getDashboardStatsFromDB,
  updateUserInDB,
  updateVisitorPassInDB,
} from "../repositories/adminRepository.js";

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
  return createUserInDB({
    email,
    password,
    fullName,
    role,
    phone,
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
