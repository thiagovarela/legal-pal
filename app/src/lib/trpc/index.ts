import type { Context } from '$lib/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import { WorkflowFailedError } from '@temporalio/client';

const t = initTRPC.context<Context>().create({
	errorFormatter(opts) {
		const { shape, error } = opts;		
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
export const publicProcedure = t.procedure.use(async (opts) => {
	const start = Date.now();
   
	const result = await opts.next();
   
	const durationMs = Date.now() - start;
	const meta = { path: opts.path, type: opts.type, durationMs };
   
	result.ok
	  ? console.log('OK request timing:', meta)
	  : console.error('Non-OK request timing', meta);

	  console.log(result)
   
	return result;
  });
export const protectedProcedure = t.procedure.use(auth);
