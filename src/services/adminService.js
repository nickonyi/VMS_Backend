import {
  getAllVisitorPassesFromDB,
  getDashboardStatsFromDB,
} from "../repositories/adminRepository.js";

export const getAllVisitorPassesService = async () => {
  return getAllVisitorPassesFromDB();
};

export const getDashboardStatsService = async () => {
  return getDashboardStatsFromDB();
};
