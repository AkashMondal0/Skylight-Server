import { Injectable, OnModuleInit } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './drizzle.schema';
import { Pool } from 'pg';
import configuration from 'src/configs/configuration';

@Injectable()
export class DrizzleProvider implements OnModuleInit {
    db: NodePgDatabase<typeof schema>;

    async onModuleInit() {
        const client = new Pool({
            connectionString: configuration().PG_URL,
        });
        await client.connect();
        this.db = drizzle(client, { schema });
        // migrate(this.db, { migrationsFolder: './src/db/migrations' }); // Uncomment if you need to run migrations
    }
}