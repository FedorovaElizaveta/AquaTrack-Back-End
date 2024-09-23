import createHttpError from 'http-errors';

export const isValidMonth = (req, res, next) => {
  const { date } = req.params;

  const validatedDate = new Date(`${date}-01T00:00:00`).getTime();

  if (isNaN(validatedDate)) {
    throw createHttpError(400, 'Invalid date format');
  }
  next();
};
