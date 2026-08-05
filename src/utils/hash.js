import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  if (!password) {
    throw Error("Password is required for hashing!");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;

  return bcrypt.compare(password, hashedPassword);
};
