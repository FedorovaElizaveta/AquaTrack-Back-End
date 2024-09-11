import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (isValidObjectId(contactId) !== true) {
    return next(createHttpError(400, "ID is not valid"));
  }

  next();
};
