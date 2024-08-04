import type { Context } from '$lib/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { WorkflowFailedError } from '@temporalio/client';

const t = initTRPC.context<Context>().create({
	errorFormatter(opts) {
		const { shape, error } = opts;
		console.log(error.cause instanceof WorkflowFailedError);
		return {
			...shape,
			data: {
				...shape.data,
				workflowError: error.cause instanceof WorkflowFailedError ? error.cause?.cause?.failure?.cause : null, // geez, do something clever later
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null
			}
		};
	}
});

export const auth = t.middleware(async ({ next, ctx }) => {
	if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(auth);
