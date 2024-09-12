import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const validateMongoId =
  (idName = 'id') =>
  (req, res, next) => {
    const id = req.params[idName];

    if (!id) {
      throw new Error('id in validateMongoId is not provided');
    }

    if (!isValidObjectId(id)) {
      next(createHttpError(400, 'Invalid id'));
      return;
    }

    return next();
  };