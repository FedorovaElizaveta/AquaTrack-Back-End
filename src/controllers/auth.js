//import bcrypt from 'bcrypt';
//import createHttpError from 'http-errors';
// import {
//   createUser,
//   findUserByEmail,
//   setupSession,
//   logoutUser,
// } from '../services/auth.js';

import { registerUser, loginUser, logoutUser } from '../services/auth.js';

//import { setupCookie } from '../utilts/setupCookie.js';

// export const registerUserController = async (req, res) => {
//   const { email } = req.body;

//   const user = await findUserByEmail(email);
//   if (user) {
//     throw createHttpError(409, 'Email in use');
//   }
//   await createUser(req.body);
//   res.status(201).json({
//     status: 201,
//     message: 'Successfully registered a user!',
//     data: {
//       email,
//     },
//   });
// };

export async function registerUserController(req, res) {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };
  const registeredUser = await registerUser(payload);
  res.send({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
}

// export const loginUserController = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await findUserByEmail(email);
//   if (!user) {
//     //throw createHttpError(401, 'User not authorized!');
//     throw createHttpError(404, 'User not found!');
//   }

//   const isEqualPassword = await bcrypt.compare(password, user.password);
//   if (!isEqualPassword) {
//     throw createHttpError(401, 'User not authorized!');
//   }

//   const userSession = await setupSession(user._id); // засетапити інф-ю про наші куки
//   setupCookie(res, userSession);
//   res.status(200).json({
//     status: 200,
//     message: 'Successfully logged in an user!',
//     data: {
//       accessToken: userSession.accessToken,
//     },
//   });
// };

export async function loginUserController(req, res) {
  const { email, password } = req.body;

  const session = await loginUser(email, password);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.send({
    status: 200,
    message: 'Successfully logged in an user!',
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
