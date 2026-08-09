import { getVisitHistoryFromDB } from "../repositories/guardRespository.js";
import { getPassByCodeFromDB } from "../repositories/residentRepository.js";

export const getVisitHistoryService = async () => {
  const visits = await getVisitHistoryFromDB();

  console.log(visits);

  return visits;
};

export const getPassByManualCodeService = async (code) => {
  return await getPassByCodeFromDB(code);
};
