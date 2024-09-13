import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';
import { createSession } from '../utilts/createSession.js';

export const findUserByEmail = (email) => User.findOne({ email });

// export const createUser = async (userData) => {
//   const encryptedPassword = await bcrypt.hash(userData.password, 10);
//   return User.create({
//     ...userData,
//     password: encryptedPassword,
//   });
// };

export async function registerUser(payload) {
  const maybeUser = await User.findOne({ email: payload.email });

  if (maybeUser) {
    throw createHttpError(409, 'Email already in user');
  }
  payload.password = await bcrypt.hash(payload.password, 10);
  return User.create(payload);
}

export async function loginUser(email, password) {
  const maybeUser = await User.findOne({ email });

  if (!maybeUser) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);

  if (isMatch === false) {
    throw createHttpError(401, 'User not authorized!');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  return Session.create({
    userId: maybeUser._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export const setupSession = async (userId) => {
  await Session.deleteOne({ userId });
  return Session.create({ userId, ...createSession() });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
