import { User } from '../db/models/user.js';

export const getUserInfoService = async (id) => {
  const user = await User.findById(id);
  return user;
};
