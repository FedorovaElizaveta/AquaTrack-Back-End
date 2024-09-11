import express from "express";
import pino from "pino-http";
import cors from "cors";
import { env } from "./utilts/env.js";
import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import cookieParser from "cookie-parser";

const PORT = Number(env("PORT", "5187"));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use(router);

  app.use("*", notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
