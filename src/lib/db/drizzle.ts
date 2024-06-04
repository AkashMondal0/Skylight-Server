import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if(!process.env.PG_URL) {
    throw new Error("PG_URL environment variable is not set")
}
const client = postgres(process.env.PG_URL)
const db = drizzle(client, { schema });
export default db;