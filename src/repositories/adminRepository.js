import { prisma } from "../lib/prisma.js";

export const getAllVisitorPassesFromDB = async () => {
  const result = await prisma.$queryRaw`
  SELECT
    vp.id,
    vp.num_of_guests,
    vp.purpose,
    vp.expected_arrival_at AS visit_date,
    vp.expected_arrival_at::time AS arrival_time,
    vp.expires_at::time AS expiry_time,
    vp.status,
    vp.created_at,
    vp.cancelled_at,

    v.full_name AS guest_name,
    v.phone AS guest_phone,
    v.email AS guest_email,
    v.vehicle_reg,

    u.full_name AS resident_name,
    u.email AS resident_email,

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

  ORDER BY vp.created_at DESC
`;

  return result;
};

export const getDashboardStatsFromDB = async () => {
  const result = await prisma.$queryRaw`
    SELECT
      COUNT(*) FILTER (
        WHERE expected_arrival_at::date = CURRENT_DATE
      )::int AS visitorsToday,

      COUNT(*) FILTER (
        WHERE status = 'checked_in'
      )::int AS active,

      COUNT(*) FILTER (
        WHERE status = 'checked_out'
      )::int AS checkedOut,

      COUNT(*) FILTER (
        WHERE status = 'pending'
          AND expires_at > NOW()
      )::int AS pending,

      (
        SELECT COUNT(*)::int
        FROM users
        WHERE role = 'resident'
      ) AS totalResidents,

      (
        SELECT COUNT(*)::int
        FROM users
        WHERE role = 'guard'
      ) AS totalGuards

    FROM visitor_passes;
  `;

  return result[0];
};
