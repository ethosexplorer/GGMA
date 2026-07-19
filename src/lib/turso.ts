import { createClient } from '@libsql/client/web';

const url = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TURSO_DATABASE_URL : process.env.VITE_TURSO_DATABASE_URL;
const authToken = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TURSO_AUTH_TOKEN : process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("FATAL: VITE_TURSO_DATABASE_URL is not defined. Cannot start without a live database connection.");
}

if (!authToken) {
  throw new Error("FATAL: VITE_TURSO_AUTH_TOKEN is not defined. Cannot start without authentication.");
}

export const turso = createClient({
  url,
  authToken,
});

