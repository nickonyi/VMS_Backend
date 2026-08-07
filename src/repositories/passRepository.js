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
    INSERT INTO visitors (
      full_name,
      phone,
      vehicle_reg
    )
    VALUES (
      ${fullName},
      ${phone},
      ${vehicleReg}
    )
    RETURNING *;
  `;

  return visitor[0];
};

export const createVisitorPassInDB = async ({
  visitorId,
  residentId,
  apartmentId,
  purpose,
  numOfGuests,
  expectedArrivalAt,
  expiresAt,
}) => {
  const pass = await prisma.$queryRaw`
    INSERT INTO visitor_passes (
      visitor_id,
      resident_id,
      apartment_id,
      purpose,
      num_of_guests,
      expected_arrival_at,
      expires_at
    )
    VALUES (
      ${visitorId},
      ${residentId},
      ${apartmentId},
      ${purpose},
      ${numOfGuests},
      ${expectedArrivalAt},
      ${expiresAt}
    )
    RETURNING *;
  `;

  return pass[0];
};

export const getPassByIdFromDB = async (id) => {
  const result = await prisma.$queryRaw`
    SELECT
    vp.id,
    v.full_name AS guest_name,
    v.phone AS guest_phone,
    v.vehicle_reg,
    vp.purpose,
    vp.notes,
    vp.num_of_guests,
    vp.expected_arrival_at AS visit_date,
    vp.expires_at,
    vp.qr_token,
    vp.status,
    vp.created_at,
    a.unit_number,
    a.block,
    u.full_name AS resident_name
FROM visitor_passes vp
JOIN visitors v
    ON vp.visitor_id = v.id
JOIN apartments a
    ON vp.apartment_id = a.id
JOIN users u
    ON vp.resident_id = u.id
WHERE vp.id = ${id}
LIMIT 1;
  `;

  return result[0] ?? null;
};
