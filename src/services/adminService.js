import {
  createUserInDB,
  getAllVisitorPassesFromDB,
  getDashboardStatsFromDB,
  updateUserInDB,
} from "../repositories/adminRepository.js";

export const getAllVisitorPassesService = async () => {
  return getAllVisitorPassesFromDB();
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
