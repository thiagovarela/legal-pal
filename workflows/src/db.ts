import { PostgresJSDialect } from 'kysely-postgres-js';
import { Kysely } from 'kysely';
import postgres from 'postgres';
import { type DB } from '@gabo/schemas/db';

const url = process.env.DATABASE_URL;
if (!url) {
	throw new Error('DATABASE_URL is not set');
}
export const client = postgres(url);

export const db = new Kysely<DB>({
	dialect: new PostgresJSDialect({
		postgres: client
	})
});
