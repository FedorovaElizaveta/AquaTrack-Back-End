export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

//export const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds;
export const ACCESS_TOKEN_TTL = 24 * 60 * 60 * 1000; // 24год  in milliseconds;
export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds;

export const SMTP = {
  SERVER: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
};
