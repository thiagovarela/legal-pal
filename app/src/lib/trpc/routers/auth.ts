import { router, publicProcedure } from '$lib/trpc';
import { getClient } from '$lib/temporal';
import { lucia } from '$lib/lucia';
import { nanoid } from 'nanoid/non-secure'
import {SignUpInput, LoginInput} from '@gabo/schemas/input'


export const authRouter = router({
	signUp: publicProcedure.input(SignUpInput).mutation(async ({ input }) => {
		const client = await getClient();
		const handle = await client.workflow.start("signUpWf", {
			workflowId: `sign-up-with-email-${nanoid()}`,
			args: [input],
			taskQueue: 'default',
			workflowRunTimeout: '5 seconds',
			
		});
		const userId = await handle.result()
		return { userId };
	}),
	login: publicProcedure
		.input(LoginInput)
		.mutation(async ({ input, ctx }) => {
			const client = await getClient();
			const handle = await client.workflow.start("loginWf", {
				workflowId: `login-with-email-${nanoid()}`,
				args: [input],
				taskQueue: 'default',
				workflowRunTimeout: '5 seconds',
				retry: {
					maximumAttempts: 1
				}
			});
			const userId = await handle.result();
			const session = await lucia.createSession(userId, {}, {sessionId: crypto.randomUUID()})
			const sessionCookie = lucia.createSessionCookie(session.id);
			ctx.event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return { success: true };
		})
});
