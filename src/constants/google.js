import path from 'node:path';
import { readFile } from 'fs/promises';
import { env } from '../utilts/env.js';

const PATH_JSON = path.join(
  process.cwd(),
  'src',
  'constants',
  'google-oauth.json',
);
const oauth_json = JSON.parse(await readFile(PATH_JSON, { encoding: 'utf-8' }));

export const GOOGLE = {
  AUTH_CLIENT_ID: env('GOOGLE_AUTH_CLIENT_ID'),
  AUTH_CLIENT_SECRET: env('GOOGLE_AUTH_CLIENT_SECRET'),
  AUTH_JSON: oauth_json,
};
