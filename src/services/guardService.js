import { Network } from "node:inspector/promises";
import {
  getVisitHistoryFromDB,
  markPassExpired,
} from "../repositories/guardRespository.js";
import {
  checkInPassFromDB,
  checkOutPassFromDB,
} from "../repositories/residentRepository.js";
import { getPassByCodeFromDB } from "../repositories/guardRespository.js";
import AppError from "../utils/appError.js";
import { getAllUsersFromDB } from "../repositories/adminRepository.js";

export const getVisitHistoryService = async () => {
  const visits = await getVisitHistoryFromDB();

  return visits;
};

export const getPassByManualCodeService = async (code) => {
  const pass = await getPassByCodeFromDB(code);

  if (!pass) {
    throw new AppError("Invalid visitor code", 404);
  }

  if (pass.status === "pending" && pass.expiry_time <= new Date()) {
    const expiredPass = await markPassExpired(pass.id);

    return {
      ...pass,
      status: expiredPass?.status ?? "expired",
    };
  }

  return pass;
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

export const getAllUsers = async () => {
  return getAllUsersFromDB();
};
