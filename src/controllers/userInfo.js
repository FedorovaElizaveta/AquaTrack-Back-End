import createHttpError from 'http-errors';
import { getUserInfoService } from '../services/userInfo.js';

export const getUserInfoController = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userInfo = await getUserInfoService(userId);

  if (!userInfo) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    data: userInfo,
  });
};
