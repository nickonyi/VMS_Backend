import { prisma } from "../lib/prisma.js";

export const createUsersInDB = async ({
  fullName,
  email,
  phone,
  hashedPassword,
  role,
  status,
}) => {
  const users = await prisma.$queryRaw`
    INSERT INTO users (
      full_name,
      email,
      phone,
      password_hash,
      role,
      status
    )
    VALUES (
      ${fullName},
      ${email},
      ${phone},
      ${hashedPassword},
      ${role},
      ${status}
    )
    RETURNING *;
  `;

  return users[0] ?? null;
};

export const getUserByEmailFromDb = async (email) => {
  const users = await prisma.$queryRaw`
    SELECT 
    users.*,
    apartments.id AS apartment_id,
    apartments.unit_number AS unit
    FROM users
    LEFT JOIN apartments
     ON apartments.resident_id = users.id
     WHERE email = ${email}
    LIMIT 1
  `;

  return users[0] ?? null;
};

export const getUserByIdFromDb = async (id) => {
  const users = await prisma.$queryRaw`
    SELECT 
    users.*,
    apartments.id AS apartment_id,
    apartments.unit_number AS unit
    FROM users
    LEFT JOIN apartments
     ON apartments.resident_id = users.id
    WHERE users.id = ${id}
    LIMIT 1
  `;

  return users[0] ?? null;
};
