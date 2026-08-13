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
} from "../repositories/residentRepository.js";
import { sendVisitorCodeEmail } from "./emailService.js";

export const createVisitorPassService = async (
  residentId,
  manualCode,
  data,
) => {
  const apartment = await getApartmentByResidentIdFromDB(residentId);

  if (!apartment) {
    throw new Error("Resident has no apartment assigned.");
  }

  const visitor = await createVisitorInDB({
    fullName: data.guestName,
    phone: data.guestPhone,
    vehicleReg: data.vehicleReg,
    email: data.guestEmail,
  });

  const pass = await createVisitorPassInDB({
    visitorId: visitor.id,
    residentId,
    apartmentId: apartment.id,
    purpose: data.purpose,
    manualCode,
    numOfGuests: data.numberOfGuests,
    expectedArrivalAt: data.expectedArrivalAt,
    expiresAt: data.expiresAt,
  });

  try {
    await sendVisitorCodeEmail({
      email: visitor.email,
      guestName: visitor.full_name,
      manualCode,
      visitDate: data.expectedArrivalAt,
      arrivalTime: data.expectedArrivalAt,
      expiryTime: data.expiresAt,
    });
  } catch (error) {
    console.error("Failed to send visitor pass email:", error);
  }

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
