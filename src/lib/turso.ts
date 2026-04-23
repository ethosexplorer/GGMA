import { createClient } from '@libsql/client/web';

const url = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TURSO_DATABASE_URL : process.env.VITE_TURSO_DATABASE_URL;
const authToken = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_TURSO_AUTH_TOKEN : process.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.warn("VITE_TURSO_DATABASE_URL is not defined in environment variables.");
}

export const turso = createClient({
  url: url || "libsql://gghp-gghp.aws-us-east-2.turso.io", // fallback to prevent immediate crashes if env is missing
  authToken: authToken,
});
