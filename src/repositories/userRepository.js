import { prisma } from "../lib/prisma.js";

export const createUserInDB = async ({
  fullName,
  phone,
  ascribeResidentId,
  role,
  status,
}) => {
  const result = await prisma.$queryRaw`
    INSERT INTO users (
      full_name,
      phone,
      ascribe_resident_id,
      role,
      status
    )
    VALUES (
      ${fullName},
      ${phone},
      ${ascribeResidentId},
      ${role},
      ${status}
    )
    RETURNING
      id,
      full_name,
      phone,
      ascribe_resident_id,
      role,
      status,
      created_at,
      updated_at
  `;

  return result[0] ?? null;
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

export const findUserByPhone = async (phone) => {
  const result = await prisma.$queryRaw`
    SELECT *
    FROM users
    WHERE phone = ${phone}
    LIMIT 1
  `;

  return result[0] || null;
};

export const findUserByAscribeResidentId = async (ascribeResidentId) => {
  const result = await prisma.$queryRaw`
    SELECT
      id,
      full_name,
      phone,
      ascribe_resident_id,
      role,
      status,
      created_at,
      updated_at
    FROM users
    WHERE ascribe_resident_id = ${ascribeResidentId}
    LIMIT 1
  `;

  return result[0] || null;
};
