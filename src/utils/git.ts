import { execSync } from 'child_process';
import { logger } from './logger';

export const getGitOrigin = () => {
	const origin = execSync('git config --get remote.origin.url')
		.toString()
		.trim();

	if (!origin) {
		logger.error(
			`You are not in a git repository: 
    1. Check if Git origin is added to your project. 
    2. Your project must be pushed to the GITLAB remote repository.`,
		);
		process.exit(1);
	}

	const pathWithNamespace = origin.split(':')[1].split('.git')[0];
	const namespace = pathWithNamespace.split('/')[0];
	const path = pathWithNamespace.split('/')[1];

	return {
		namespace,
		path,
		pathWithNamespace,
		origin,
	};
};
