import {
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
