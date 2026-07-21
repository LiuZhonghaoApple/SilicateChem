import { neon } from "@neondatabase/serverless";

let databaseClient: ReturnType<typeof neon> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase(): ReturnType<typeof neon> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  databaseClient = databaseClient ?? neon(databaseUrl);
  return databaseClient;
}
