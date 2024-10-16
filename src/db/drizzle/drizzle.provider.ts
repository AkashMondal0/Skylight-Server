// import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
// import { Client } from 'pg';
import "dotenv/config";
import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './drizzle.schema';

if (!process.env.PG_URL) throw new Error("PG_URL is not defined in .env file");
const sql = postgres(process.env.PG_URL);

@Injectable()
export class DrizzleProvider {
    // db: NodePgDatabase<typeof schema>;

    // async onModuleInit() {
    // const url = process.env.PG_URL?.toString()
    // if(!url) return;
    // const client = new Client({
    //     connectionString: url,
    // });
    // await client.connect();
    // this.db = drizzle(client, { schema });
    // }

    db: PostgresJsDatabase<typeof schema> = drizzle(sql, {
        schema: schema
    });
}