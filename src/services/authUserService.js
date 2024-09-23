import { User } from '../db/models/user.js';
import { getEncryptedPassword } from '../utilts/password.js';

export const getAuthUserByEmail = (email) => User.findOne({ email });

export const createAuthUserService = async (userData) => {
  const encryptedPassword = await getEncryptedPassword(userData.password);
  return await User.create({
    ...userData,
    password: encryptedPassword,
  });
};
