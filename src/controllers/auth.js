import fs from 'fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
  patchUser,
  getUserInfoService,
  sendResetEmail,
  resetPassword,
  getAllUsers,
  loginOrSignupWithGoogle,
} from '../services/auth.js';
import { setupCookie } from '../utilts/setupCookie.js';
import { uploadToCloudinary } from '../utilts/uploadToCloudinary.js';
import { env } from '../utilts/env.js';
import { generateAuthUrl } from '../utilts/googleOAuth2.js';

export async function registerUserController(req, res) {
  const payload = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.email.split('@')[0],
  };
  const registeredUser = await registerUser(payload);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
}

export async function loginUserController(req, res) {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  setupCookie(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    await logoutUser(sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  res.status(204).end();
};

export const refreshTokensController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshTokens(sessionId, refreshToken);

  setupCookie(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const patchUserController = async (req, res, next) => {
  let avatar = null;

  if (typeof req.file !== 'undefined') {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      avatar = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src/public/avatars', req.file.filename),
      );

      avatar = `http://localhost:5108/avatars/${req.file.filename}`;
    }
  }

  const userId = req.user._id;

  const user = {
    email: req.body.email,
    name: req.body.name,
    gender: req.body.gender,
    weight: req.body.weight,
    sportTime: req.body.sportTime,
    dailyWater: req.body.dailyWater,
    avatar,
  };

  const patchedUser = await patchUser(userId, user);

  if (patchedUser === null) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a user!',
    data: patchedUser,
  });
};

export const getUserInfoController = async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userInfo = await getUserInfoService(userId);

  if (!userInfo) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved user info!',
    data: userInfo,
  });
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;
  await sendResetEmail(email);

  res.send({
    status: 200,
    massage: 'Send email was send successfully!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;
  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password has been successfully reset',
    data: {},
  });
};

export const getAllUsersController = async (req, res) => {
  const users = await getAllUsers();

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved users count!',
    data: users,
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupCookie(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
