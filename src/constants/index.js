import { env } from '../utilts/env.js';
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ACCESS_TOKEN_TTL = 15 * 60 * 1000;
export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  SERVER: env('SMTP_SERVER'),
  PORT: env('SMTP_PORT'),
  USER: env('SMTP_USER'),
  PASSWORD: env('SMTP_PASSWORD'),
  FROM_EMAIL: env('SMTP_FROM_EMAIL'),
};
