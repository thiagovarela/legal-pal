import type { SignUpInput, LoginInput } from '@gabo/schemas/input';
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const proxy = proxyActivities<typeof activities>({
	startToCloseTimeout: '10 seconds'
});

export async function signUpWf(input: SignUpInput): Promise<string> {
	return await proxy.signUp(input);
}

export async function loginWf(input: LoginInput): Promise<string> {
	return await proxy.login(input);
}
