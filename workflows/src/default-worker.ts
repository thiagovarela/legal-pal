import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './default/activities';
import { URL, fileURLToPath } from 'url';
import path from 'path';

const workflowsPathUrl = new URL(
	`./default/workflows${path.extname(import.meta.url)}`,
	import.meta.url
);

async function run() {
	const connection = await NativeConnection.connect({
		address: process.env.TEMPORAL_URL
	});
	const w = await Worker.create({
		connection,
		namespace: 'default',
		taskQueue: 'default',
		activities,
		workflowsPath: fileURLToPath(workflowsPathUrl)
	});
	await w.run();
}

run().catch((err) => {
	console.error(err);
	process.exit(1);
});
