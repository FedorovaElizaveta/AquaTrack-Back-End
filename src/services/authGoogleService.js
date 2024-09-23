import {
  validateCode,
  getFullNameFromGoogleTokenPayload,
} from '../utilts/googleOAuth2.js';
import { getRandomPassword } from '../utilts/password.js';
import { getSessionService } from './authSessionService.js';
import createHttpError from 'http-errors';
import {
  createAuthUserService,
  getAuthUserByEmail,
} from './authUserService.js';

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  const { email } = payload;

  let authUser = await getAuthUserByEmail(email);
  if (!authUser) {
    const password = await getRandomPassword();

    authUser = await createAuthUserService({
      name: getFullNameFromGoogleTokenPayload(payload),
      email: payload.email,
      password,
    });
  }
  const session = await getSessionService(authUser);
  return session;
};
