import { getAllVisitorPassesFromDB } from "../repositories/adminRepository.js";

export const getAllVisitorPassesService = async () => {
  return await getAllVisitorPassesFromDB();
};
