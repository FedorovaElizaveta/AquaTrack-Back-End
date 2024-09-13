import { randomBytes } from 'crypto';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  //const accessTokenValidUntil = Date.now() + 15 * 60 * 1000; //15хв !!!
  const accessTokenValidUntil = Date.now() + 24 * 60 * 60 * 1000; //24год.
  const refreshTokenValidUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};
