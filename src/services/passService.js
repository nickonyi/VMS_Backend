import {
  createVisitorInDB,
  createVisitorPassInDB,
  getApartmentByResidentIdFromDB,
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
