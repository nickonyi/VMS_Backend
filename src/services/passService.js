import {
  cancelVisitorPassFromDB,
  checkInPassFromDB,
  checkOutPassFromDB,
  createVisitorInDB,
  createVisitorPassInDB,
  getApartmentByResidentIdFromDB,
  getPassByIdFromDB,
  getPassByTokenFromDB,
  getResidentPassesFromDB,
} from "../repositories/passRepository.js";

export const createVisitorPassService = async (residentId, data) => {
  const apartment = await getApartmentByResidentIdFromDB(residentId);

  if (!apartment) {
    throw new Error("Resident has no apartment assigned.");
  }

  const visitor = await createVisitorInDB({
    fullName: data.guestName,
    phone: data.guestPhone,
    vehicleReg: data.vehicleReg,
  });

  const pass = await createVisitorPassInDB({
    visitorId: visitor.id,
    residentId,
    apartmentId: apartment.id,
    purpose: data.purpose,
    numOfGuests: data.numberOfGuests,
    expectedArrivalAt: data.expectedArrivalAt,
    expiresAt: data.expiresAt,
  });

  return pass;
};

export const getPassById = async (id) => {
  return await getPassByIdFromDB(id);
};

export const getResidentPasses = async (residentId) => {
  return await getResidentPassesFromDB(residentId);
};

export const getPassByTokenService = async (token) => {
  return await getPassByTokenFromDB(token);
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

export const cancelVisitorPass = async (passId, residentId) => {
  const pass = await getPassByIdFromDB(passId);

  if (!pass) {
    const error = new Error("Visitor pass not found.");
    error.statusCode = 404;
    error.isOperational = true;
    throw error;
  }

  if (pass.resident_id !== residentId) {
    const error = new Error("You are not authorized to cancel this pass.");
    error.statusCode = 403;
    error.isOperational = true;
    throw error;
  }

  if (pass.status !== "pending") {
    const error = new Error(
      `This visitor pass cannot be cancelled because it is already ${pass.status}.`,
    );

    error.statusCode = 400;
    error.isOperational = true;
    throw error;
  }

  const cancelledPass = await cancelVisitorPassFromDB(passId, residentId);

  return cancelledPass;
};
