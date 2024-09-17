import createHttpError from 'http-errors';

export const isValidDate = (req, res, next) => {
  const { date } = req.params;

  const validatedDate = new Date(`${date}T00:00:00`).getTime();

  if (isNaN(validatedDate)) {
    throw createHttpError(400, 'Invalid date format');
  }
  next();
};
