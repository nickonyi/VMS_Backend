import { prisma } from "../lib/prisma.js";

export const getVisitHistoryFromDB = async () => {
  const result = await prisma.$queryRaw`
    SELECT
      vp.id,

      v.full_name AS guest_name,
      v.phone AS guest_phone,
      v.vehicle_reg,
      vp.expected_arrival_at AS visit_date,
      vp.status,

      a.unit_number,
      a.block,

      resident.full_name AS resident_name,

      MIN(
        CASE
          WHEN vl.action = 'check_in'
          THEN vl.timestamp
        END
      ) AS checked_in_at,

      MAX(
        CASE
          WHEN vl.action = 'check_out'
          THEN vl.timestamp
        END
      ) AS checked_out_at

    FROM visitor_passes vp

    JOIN visitors v
      ON vp.visitor_id = v.id

    JOIN apartments a
      ON vp.apartment_id = a.id

    JOIN users resident
      ON vp.resident_id = resident.id

    JOIN visit_logs vl
      ON vp.id = vl.visitor_pass_id

    GROUP BY
      vp.id,
      v.full_name,
      v.phone,
      v.vehicle_reg,
      a.unit_number,
      a.block,
      resident.full_name

    ORDER BY
      checked_in_at DESC;
  `;

  return result;
};

export const getPassByCodeFromDB = async (token) => {
  const result = await prisma.$queryRaw`
    SELECT
      vp.id,
      v.full_name AS guest_name,
      v.phone AS guest_phone,
      v.vehicle_reg,
      vp.purpose,
     
      vp.num_of_guests,

      vp.expected_arrival_at AS visit_date,
      vp.expected_arrival_at AS arrival_time,

      vp.expires_at AS expires_at,
      vp.expires_at expiry_time,

    vp.manual_code,
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

export const markPassExpired = async (passId) => {
  const result = await prisma.$queryRaw`
  UPDATE visitor_passes
  SET status = 'expired'
  WHERE id=${passId}
   AND status ='pending'
   AND expires_at <= NOW()
   RETURNING  *
  `;

  console.log(result[0]);

  return result[0] ?? null;
};
