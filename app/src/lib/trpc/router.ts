import { router } from '$lib/trpc';
import { authRouter } from './routers/auth';

export const appRouter = router({
	auth: authRouter
});

export type AppRouter = typeof appRouter;
