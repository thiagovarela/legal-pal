import {z} from 'zod';

export const SignUpInput = z.object({ first_name: z.string(), last_name: z.string(), email: z.string().email().toLowerCase(), password: z.string() })
export type SignUpInput = z.infer<typeof SignUpInput>;

export const LoginInput = z.object({ email: z.string().email().toLowerCase(), password: z.string() })
export type LoginInput = z.infer<typeof LoginInput>;