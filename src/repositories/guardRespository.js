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
