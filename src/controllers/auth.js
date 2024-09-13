import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import {
  createUser,
  findUserByEmail,
  setupSession,
  logoutUser,
} from '../services/auth.js';

import { setupCookie } from '../utilts/setupCookie.js';

export const registerUserController = async (req, res) => {
  const { name, email } = req.body;

  const user = await findUserByEmail(email);
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  await createUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name,
      email,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  console.log('loginUserController - user: >> ', user);
  if (!user) {
    throw createHttpError(401, 'User not authorized!');
  }

  const isEqualPassword = await bcrypt.compare(password, user.password);
  if (!isEqualPassword) {
    throw createHttpError(401, 'User not authorized!');
  }

  const userSession = await setupSession(user._id); // треба засетапити інф-ю про наші куки
  setupCookie(res, userSession);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (typeof sessionId === 'string') {
    //if (typeof req.cookies.sessionId === 'string')
    await logoutUser(sessionId);
  } // видалили сесію

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');
  //console.log(req.cookies);
  //res.send('Logout'); //перевірили чи немає помилок для роута
  res.status(204).end(); //нема що повертати користувачу
};
