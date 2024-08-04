import { Lucia, TimeSpan } from 'lucia';
import { dev } from '$app/environment';
import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { client } from '$lib/db';

const adapter = new PostgresJsAdapter(client, { user: 'users', session: 'sessions' });

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(2, 'w'),
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}
