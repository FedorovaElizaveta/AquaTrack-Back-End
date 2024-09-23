import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      data: err,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: process.env.NODE_ENV === 'development' ? err.stack : err.message,
    });
  }
};
