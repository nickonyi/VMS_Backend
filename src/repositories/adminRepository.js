import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/hash.js";

export const getAllVisitorPassesFromDB = async ({
  page = 1,
  limit = 10,
  status = "all",
  search = "",
}) => {
  const offset = (page - 1) * limit;
  const normalizedSearch = search.trim();

  const passes = await prisma.$queryRaw`
    SELECT
      vp.id,
      vp.num_of_guests,
      vp.purpose,

      vp.expected_arrival_at AS visit_date,
      vp.expected_arrival_at AS arrival_time,

      vp.expires_at AS expires_at,
      vp.expires_at AS expiry_time,

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
      a.floor,

      vl.checked_in_at,

      CASE
        WHEN vp.status = 'pending'
             AND vp.expires_at < NOW()
          THEN 'expired'
        ELSE vp.status::text
      END AS effective_status

    FROM visitor_passes vp

    JOIN visitors v
      ON vp.visitor_id = v.id

    JOIN users u
      ON vp.resident_id = u.id

    JOIN apartments a
      ON vp.apartment_id = a.id

    LEFT JOIN (
      SELECT
        visitor_pass_id,
        MAX(timestamp) AS checked_in_at
      FROM visit_logs
      WHERE action = 'check_in'
      GROUP BY visitor_pass_id
    ) vl
      ON vl.visitor_pass_id = vp.id

    WHERE
      (
        CAST(${status} AS TEXT) = 'all'
        OR (
          CASE
            WHEN vp.status = 'pending'
                 AND vp.expires_at < NOW()
              THEN 'expired'
            ELSE vp.status::text
          END
        ) = CAST(${status} AS TEXT)
      )

      AND (
        CAST(${normalizedSearch} AS TEXT) = ''
        OR v.full_name ILIKE '%' || ${normalizedSearch} || '%'
        OR a.unit_number ILIKE '%' || ${normalizedSearch} || '%'
      )

    ORDER BY vp.created_at DESC

    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [{ total }] = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS total

    FROM visitor_passes vp

    JOIN visitors v
      ON vp.visitor_id = v.id

    JOIN apartments a
      ON vp.apartment_id = a.id

    WHERE
      (
        CAST(${status} AS TEXT) = 'all'
        OR (
          CASE
            WHEN vp.status = 'pending'
                 AND vp.expires_at < NOW()
              THEN 'expired'
            ELSE vp.status::text
          END
        ) = CAST(${status} AS TEXT)
      )

      AND (
        CAST(${normalizedSearch} AS TEXT) = ''
        OR v.full_name ILIKE '%' || ${normalizedSearch} || '%'
        OR a.unit_number ILIKE '%' || ${normalizedSearch} || '%'
      )
  `;

  return {
    passes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDashboardStatsFromDB = async () => {
  const result = await prisma.$queryRaw`
    SELECT
      COUNT(*) FILTER (
        WHERE expected_arrival_at::date = CURRENT_DATE
      )::int AS "visitorsToday",

      COUNT(*) FILTER (
        WHERE status = 'checked_in'
      )::int AS active,

      COUNT(*) FILTER (
        WHERE status = 'checked_out'
      )::int AS "checkedOut",

      COUNT(*) FILTER (
        WHERE status = 'pending'
          AND expires_at > NOW()
      )::int AS pending,

      (
        SELECT COUNT(*)::int
        FROM users
        WHERE role = 'resident'
      ) AS "totalResidents",

      (
        SELECT COUNT(*)::int
        FROM users
        WHERE role = 'guard'
      ) AS "totalGuards"

    FROM visitor_passes;
  `;

  return result[0];
};

export const getAllUsersFromDB = async () => {
  const result = await prisma.$queryRaw`
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.phone,
      u.role,
      u.status,
      u.created_at,

      a.unit_number,
      a.block,
      a.floor

    FROM users u

    LEFT JOIN apartments a
      ON a.resident_id = u.id

    ORDER BY u.created_at DESC
  `;

  return result;
};

export const updateUserInDB = async ({
  id,
  fullName,
  role,
  unit,
  phone,
  active,
}) => {
  const result = await prisma.$queryRaw`
    UPDATE users
    SET
      full_name = ${fullName},
      role = ${role},
      phone = ${phone},
      status = ${active ? "active" : "disabled"},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0] ?? null;
};

export const createUserInDB = async ({
  email,
  password,
  fullName,
  role,
  phone,
}) => {
  const passwordHash = await hashPassword(password);

  const result = await prisma.$queryRaw`
    INSERT INTO users (
      email,
      password_hash,
      full_name,
      role,
      phone,
      status
    )
    VALUES (
      ${email},
      ${passwordHash},
      ${fullName},
      ${role},
      ${phone},
      'active'
    )
    RETURNING
      id,
      email,
      full_name,
      role,
      phone,
      status,
      created_at;
  `;

  return result[0] ?? null;
};

export const updateVisitorPassInDB = async (id, status) => {
  const result = await prisma.$queryRaw`
    UPDATE visitor_passes
    SET
      status = ${status},
      cancelled_at = CASE
        WHEN ${status} = 'cancelled' THEN NOW()
        ELSE cancelled_at
      END
    WHERE id = ${id}
    RETURNING *;
  `;

  return result[0] ?? null;
};
