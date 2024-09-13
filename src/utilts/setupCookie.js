//for refresh & login
export const setupCookie = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: 1000 * 60 * 60 * 24 * 30, //скільки живе токен - 30днів
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: 1000 * 60 * 60 * 24 * 30,
  });
};
