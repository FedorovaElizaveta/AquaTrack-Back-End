import { OAuth2Client } from 'google-auth-library';
import { GOOGLE } from '../constants/google.js';

const googleOAuthClient = new OAuth2Client({
  clientId: GOOGLE.AUTH_CLIENT_ID,
  clientSecret: GOOGLE.AUTH_CLIENT_SECRET,
  redirectUri: GOOGLE.AUTH_JSON.web.redirect_uris[0],
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  const token = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return token;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }
  return fullName;
};
