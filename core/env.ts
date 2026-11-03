import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export const testEnv = process.env.TEST_ENV ?? 'dev';

const envFile = path.resolve(__dirname, '..', 'env', `.env.${testEnv}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, quiet: true });
}

export const clientName = process.env.CLIENT ?? 'toolshop';

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function storageStatePath(client: string): string {
  return path.resolve(__dirname, '..', '.auth', `${client}.json`);
}
