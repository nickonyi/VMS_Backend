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

export const createVisitorInDB = async ({
  fullName,
  phone,
  vehicleReg,
  email,
}) => {
  const visitor = await prisma.$queryRaw`
    INSERT INTO visitors (
      full_name,
      phone,
      vehicle_reg,
email
    )
    VALUES (
      ${fullName},
      ${phone},
      ${vehicleReg},
       ${email}
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
  manualCode,
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
      manual_code,
      num_of_guests,
      expected_arrival_at,
      expires_at
    )
    VALUES (
      ${visitorId},
      ${residentId},
      ${apartmentId},
      ${purpose},
      ${manualCode},
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
      vp.manual_code,
      vp.num_of_guests,

      vp.expected_arrival_at AT TIME ZONE 'UTC' AS visit_date,
      vp.expected_arrival_at AT TIME ZONE 'UTC' AS arrival_time,

      vp.expires_at AT TIME ZONE 'UTC' AS expiry_time,
      vp.expires_at AT TIME ZONE 'UTC' AS expires_at,

      vp.qr_token,
      vp.status,

      vp.created_at AT TIME ZONE 'UTC' AS created_at,

      a.unit_number,
      a.block,
      u.id AS resident_id,
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

export const getResidentPassesFromDB = async (residentId) => {
  return await prisma.$queryRaw`
    SELECT
      vp.id,
      v.full_name AS guest_name,
      v.phone AS guest_phone,
      v.vehicle_reg,
      a.unit_number,
      a.block,
      vp.purpose,
      vp.manual_code,
      vp.num_of_guests,
      vp.expected_arrival_at AT TIME ZONE 'UTC' AS visit_date,
      vp.expected_arrival_at AT TIME ZONE 'UTC' AS arrival_time,
      vp.expires_at AS expiry_time,
      vp.expires_at,
      vp.qr_token,
      vp.status,
      vp.created_at
    FROM visitor_passes vp
    INNER JOIN visitors v
      ON vp.visitor_id = v.id
    INNER JOIN apartments a
      ON vp.apartment_id = a.id
    WHERE vp.resident_id = ${residentId}
    ORDER BY vp.created_at DESC;
  `;
};

export const getPassByTokenFromDB = async (token) => {
  const result = await prisma.$queryRaw`
    SELECT
      vp.id,
      v.full_name AS guest_name,
      v.phone AS guest_phone,
      v.vehicle_reg,
      vp.purpose,
      vp.manual_code,
      vp.num_of_guests,

      vp.expected_arrival_at AT TIME ZONE 'UTC' AS visit_date,
      vp.expected_arrival_at AT TIME ZONE 'UTC' AS arrival_time,
      vp.expires_at AS expiry_time,

      vp.qr_token,
      vp.status,
      vp.created_at,

      -- Actual check-in time
      (
        SELECT vl.timestamp
        FROM visit_logs vl
        WHERE vl.visitor_pass_id = vp.id
          AND vl.action = 'check_in'
        ORDER BY vl.timestamp DESC
        LIMIT 1
      ) AS checked_in_at,

      -- Actual check-out time
      (
        SELECT vl.timestamp
        FROM visit_logs vl
        WHERE vl.visitor_pass_id = vp.id
          AND vl.action = 'check_out'
        ORDER BY vl.timestamp DESC
        LIMIT 1
      ) AS checked_out_at,

      u.id AS resident_id,
      u.full_name AS resident_name,
      u.phone AS resident_phone,

      a.unit_number,
      a.block,
      a.floor

    FROM visitor_passes vp

    JOIN visitors v
      ON vp.visitor_id = v.id

    JOIN users u
      ON vp.resident_id = u.id

    JOIN apartments a
      ON vp.apartment_id = a.id

    WHERE vp.manual_code = ${token}

    LIMIT 1;
  `;

  return result[0] ?? null;
};

export const checkInPassFromDB = async (passId, guardId) => {
  return await prisma.$transaction(async (tx) => {
    const updatedPass = await tx.$queryRaw`
      UPDATE visitor_passes
      SET
        status = 'checked_in',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${passId}
        AND status = 'pending'
      RETURNING
        id,
        visitor_id,
        resident_id,
        apartment_id,
        status,
        expected_arrival_at,
        expires_at,
        qr_token;
    `;

    if (updatedPass.length === 0) {
      return null;
    }

    await tx.$queryRaw`
      INSERT INTO visit_logs (
        visitor_pass_id,
        guard_id,
        action
      )
      VALUES (
        ${passId},
        ${guardId},
        'check_in'
      );
    `;

    return updatedPass[0];
  });
};

export const checkOutPassFromDB = async (passId, guardId) => {
  return await prisma.$transaction(async (tx) => {
    const updatedPass = await tx.$queryRaw`
      UPDATE visitor_passes
      SET
        status = 'checked_out',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${passId}
        AND status = 'checked_in'
      RETURNING
        id,
        visitor_id,
        resident_id,
        apartment_id,
        status,
        expected_arrival_at,
        expires_at,
        qr_token;
    `;

    if (updatedPass.length === 0) {
      return null;
    }

    await tx.$queryRaw`
      INSERT INTO visit_logs (
        visitor_pass_id,
        guard_id,
        action
      )
      VALUES (
        ${passId},
        ${guardId},
        'check_out'
      );
    `;

    return updatedPass[0];
  });
};

export const cancelVisitorPassFromDB = async (passId, residentId) => {
  const result = await prisma.$queryRaw`
    UPDATE visitor_passes
    SET
      status = 'cancelled',
      cancelled_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${passId}
      AND resident_id = ${residentId}
      AND status = 'pending'
    RETURNING *;
  `;

  return result[0] ?? null;
};
