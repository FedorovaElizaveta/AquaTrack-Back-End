import { randomBytes } from 'crypto';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + ACCESS_TOKEN_TTL;
  const refreshTokenValidUntil = Date.now() + REFRESH_TOKEN_TTL;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};
