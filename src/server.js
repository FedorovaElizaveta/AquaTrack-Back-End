import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utilts/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import path from 'node:path';

const PORT = Number(env('PORT', '5108'));

export const setupServer = () => {
  const app = express();

  app.use('/avatars', express.static(path.resolve('src/public/avatars')));

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
