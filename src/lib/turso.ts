import { createClient } from '@libsql/client/web';

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.warn("VITE_TURSO_DATABASE_URL is not defined in environment variables.");
}

export const turso = createClient({
  url: url || "libsql://gghp-gghp.aws-us-east-2.turso.io", // fallback to prevent immediate crashes if env is missing
  authToken: authToken,
});
