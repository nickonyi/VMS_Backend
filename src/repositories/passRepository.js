import { prisma } from "../lib/prisma.js";

export const getApartmentByResidentIdFromDB = async (residentId) => {
  const apartment = await prisma.$queryRaw`
    SELECT *
    FROM apartments
    WHERE resident_id = ${residentId}
    LIMIT 1;
  `;

  return apartment[0] ?? null;
};

export const createVisitorInDB = async ({ fullName, phone, vehicleReg }) => {
  const visitor = await prisma.$queryRaw`
    INSERT INTO visitors
        (full_name, phone, vehicle_reg)
    VALUES
        (${fullName}, ${phone}, ${vehicleReg})
    RETURNING *;
  `;

  return visitor[0];
};

export const createVisitorPassInDB = async ({
  visitorId,
  residentId,
  apartmentId,
  purpose,
  notes,
  numOfGuests,
  expectedArrivalAt,
  expiresAt,
}) => {
  const pass = await prisma.$queryRaw`
    INSERT INTO visitor_passes
    (
      visitor_id,
      resident_id,
      apartment_id,
      purpose,
      notes,
      num_of_guests,
      expected_arrival_at,
      expires_at
    )
    VALUES
    (
      ${visitorId},
      ${residentId},
      ${apartmentId},
      ${purpose},
      ${notes},
      ${numOfGuests},
      ${expectedArrivalAt},
      ${expiresAt}
    )
    RETURNING *;
  `;

  return pass[0];
};
