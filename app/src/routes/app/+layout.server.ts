import type { LayoutServerLoad } from './$types';
import { db } from '$lib/db';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {};
	}

	const user = await db
		.selectFrom('users')
		.select(['first_name', 'last_name'])
		.executeTakeFirstOrThrow();

	return {
		user
	};
};
