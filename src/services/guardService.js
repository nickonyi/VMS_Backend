import { getVisitHistoryFromDB } from "../repositories/guardRespository.js";

export const getVisitHistoryService = async () => {
  const visits = await getVisitHistoryFromDB();

  console.log(visits);

  return visits;
};
