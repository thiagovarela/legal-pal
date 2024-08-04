import { Connection, Client } from '@temporalio/client';
import { env } from '$env/dynamic/private';

const globalTemporal = global as unknown as { client: Client };

export const getClient = async () => {
	if (globalTemporal.client) {
		return globalTemporal.client;
	}
	console.log(`Attempting to connect with temporal ${env.TEMPORAL_URL}`)
	const connection = await Connection.connect({address: env.TEMPORAL_URL});
	console.log(connection)
	
	globalTemporal.client = new Client({
		connection,
		namespace: 'default'
	});	
	console.log("oh well")
	return globalTemporal.client;
};
