import "dotenv/config";
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: "./src/db/drizzle/drizzle.schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.PG_URL ?? "postgresql://postgres:password@localhost:5432/postgres",
  },
  verbose: true,
  strict: true,
})