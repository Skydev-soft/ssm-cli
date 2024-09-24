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

	let namespace = '';
	let path = '';
	let pathWithNamespace = '';

	if (origin.includes('https://')) {
		// HTTPS
		const splittedOrigin = origin.split('/');
		const length = splittedOrigin.length;
		namespace = splittedOrigin[length - 2];
		path = splittedOrigin[length - 1].split('.git')[0];
		pathWithNamespace = `${namespace}/${path}`;
	} else {
		// SSH
		pathWithNamespace = origin.split(':')[1].split('.git')[0];
		namespace = pathWithNamespace.split('/')[0];
		path = pathWithNamespace.split('/')[1];
	}

	return {
		namespace,
		path,
		pathWithNamespace,
		origin,
	};
};
