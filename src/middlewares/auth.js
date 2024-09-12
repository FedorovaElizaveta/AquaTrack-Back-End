import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";
import { User } from "../db/models/user.js";

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (typeof authorization !== "string") {
    next(createHttpError(401, "Please provide Authorization header"));
    return;
  }

  const [bearer, accessToken] = authorization.split(" ", 2);

  if ((bearer !== "Bearer", typeof accessToken !== "string")) {
    next(createHttpError(401, "Auth header should be type of Bearer"));
    return;
  }

  const session = await Session.findOne({ accessToken });

  if (session === null) {
    next(createHttpError(404, "Session not found"));
    return;
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    next(createHttpError(401, "Access token is expired"));
    return;
  }

  const user = await User.findOne(session.userId);

  if (user === null) {
    next(createHttpError(404, "User not found"));
    return;
  }

  req.user = user;

  next();
};
