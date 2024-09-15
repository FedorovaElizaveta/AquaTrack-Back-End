import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';
import { createSession } from '../utilts/createSession.js';

export async function registerUser(payload) {
  const maybeUser = await User.findOne({ email: payload.email });

  if (maybeUser) {
    throw createHttpError(409, 'Email already in use');
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
    ...createSession(),
  });
}

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshTokens = async (sessionId, refreshToken) => {
  const currentSession = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (currentSession === null) {
    throw createHttpError(404, 'Session not found');
  }

  if (new Date() > new Date(currentSession.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: currentSession._id });

  const newSession = await Session.create({
    userId: currentSession.userId,
    ...createSession(),
  });

  return newSession;
};

export const patchUser = async (userId, user, options = {}) => {
  const result = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    user,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!result || result.value === null) return null;

  return result.value;
};

export const getUserInfoService = async (id) => {
  const user = await User.findById(id);
  return user;
};
