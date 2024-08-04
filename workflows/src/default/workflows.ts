import type { SignUpInput, LoginInput } from '@gabo/schemas/input';
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const proxy = proxyActivities<typeof activities>({
	startToCloseTimeout: '10 seconds'
});

export async function signUpWf(input: SignUpInput): Promise<string> {
	const user = await proxy.signUp(input);
	await proxy.createOrganization({user_id: user.id, name: `${user.first_name}'s Personal`})
	return user.id
}

export async function loginWf(input: LoginInput): Promise<string> {
	return await proxy.login(input);
}
