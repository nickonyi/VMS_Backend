import { prisma } from "../lib/prisma";

export const getUserByEmailFromDb = async (email) => {
  const users = await prisma.$queryRaw`
    SELECT *
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return users[0] ?? null;
};

export const getUserByIdFromDb = async (id) => {
  const users = await prisma.$queryRaw`
    SELECT *
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

  return users[0] ?? null;
};
