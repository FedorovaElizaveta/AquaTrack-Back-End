import bcrypt from 'bcrypt';

import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

import { createSession } from '../utilts/createSession.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const createUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return User.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const setupSession = async (userId) => {
  await Session.deleteOne({ userId });
  return Session.create({ userId, ...createSession() });
};

export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};
