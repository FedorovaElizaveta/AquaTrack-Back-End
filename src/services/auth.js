import fs from 'node:fs';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';
import { createSession } from '../utilts/createSession.js';
import { sendMail } from '../utilts/sendEmail.js';
import { SMTP } from '../constants/index.js';
import { env } from '../utilts/env.js';

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

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    env('JWT_SECRET'),
    { expiresIn: '15m' }, //15 min
  );

  const templateSource = fs.readFileSync(
    path.resolve('src/templates/reset-password.hbs'),
    { encoding: 'UTF-8' },
  );

  const template = handlebars.compile(templateSource);

  const html = template({ name: user.name, resetToken });

  try {
    await sendMail({
      from: SMTP.FROM_EMAIL,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log('error >> ', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later',
    );
  }
};

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
    );
    await Session.findOneAndDelete({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid');
    }
    throw error;
  }

  console.log({ password, token });
}

export const getAllUsers = async () => {
  const users = await User.countDocuments();
  return users;
};
