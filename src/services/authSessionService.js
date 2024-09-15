import { randomBytes } from 'crypto';
import { Session } from '../db/models/session.js';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';

export const getSessionById = (id) => Session.findById(id);

export const isRefreshTokenExpired = (session) => {
  return new Date() > new Date(session.refreshTokenValidUntil);
};

export const getSessionObject = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  };
};

const getSessionByUserId = async (userId) => {
  const sessionObject = getSessionObject();
  const authUserSession = await Session.create({
    ...sessionObject,
    userId,
  });
  return authUserSession;
};

export const getSessionService = async (authUser) => {
  await Session.deleteOne({ userId: authUser._id });
  const session = await getSessionByUserId(authUser._id);
  return session;
};
