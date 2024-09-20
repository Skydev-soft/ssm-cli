import { getEnvVersion } from '@/utils';
import chalk from 'chalk';

const getCurrentVersion = () => {
	const version = getEnvVersion();

	console.log('Current version: ' + chalk.cyan(version));
};

export default getCurrentVersion;
