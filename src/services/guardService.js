import { getVisitHistoryFromDB } from "../repositories/guardRespository.js";
import {
  checkInPassFromDB,
  checkOutPassFromDB,
  getPassByCodeFromDB,
} from "../repositories/residentRepository.js";

export const getVisitHistoryService = async () => {
  const visits = await getVisitHistoryFromDB();

  return visits;
};

export const getPassByManualCodeService = async (code) => {
  return await getPassByCodeFromDB(code);
};

export const checkInVisitorPass = async (passId, guardId) => {
  const pass = await checkInPassFromDB(passId, guardId);

  if (!pass) {
    const error = new Error(
      "Visitor pass cannot be checked in. It may already be checked in, expired, cancelled, or completed.",
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  return pass;
};

export const checkOutVisitorPass = async (passId, guardId) => {
  const pass = await checkOutPassFromDB(passId, guardId);

  if (!pass) {
    const error = new Error(
      "Visitor pass cannot be checked out because it is not currently checked in.",
    );

    error.statusCode = 400;
    error.isOperational = true;

    throw error;
  }

  return pass;
};
