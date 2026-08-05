import {
  getUserByEmailFromDb,
  getUserByIdFromDb,
} from "../repositories/userRepository";

export const getUserById = async (id) => {
  const user = await getUserByIdFromDb(id);
  return user;
};

export const validateUser = async (email, password, verifyFn) => {
  if (!email || !password) return null;

  const user = await getUserByEmailFromDb(email);

  if (!user) return null;

  const isValid = verifyFn(password, user.password_hash);

  return isValid ? user : null;
};
