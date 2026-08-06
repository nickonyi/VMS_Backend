import {
  createUsersInDB,
  getUserByEmailFromDb,
  getUserByIdFromDb,
} from "../repositories/userRepository.js";
import { hashPassword } from "../utils/hash.js";

export const registerUser = async ({
  fullName,
  email,
  phone,
  password,
  role,
  status,
}) => {
  if (!fullName || !email || !phone || !password || !role || !status) {
    throw Error("data required for registration");
  }

  try {
    const hashedPassword = await hashPassword(password);

    return await createUsersInDB({
      fullName,
      email,
      phone,
      hashedPassword,
      role,
      status,
    });
  } catch (err) {
    if (err === "23505") {
      throw new AppError(`email ${email} is already taken`, 409);
    }
    throw err;
  }
};

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
