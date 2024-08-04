import { env } from '$env/dynamic/private';
import { PostgresJSDialect } from 'kysely-postgres-js';
import { Kysely } from 'kysely';
import postgres from 'postgres';
import { type DB } from '@gabo/schemas/db';

export const client = postgres(env.DATABASE_URL);

export const db = new Kysely<DB>({
	dialect: new PostgresJSDialect({
		postgres: client
	})
});
