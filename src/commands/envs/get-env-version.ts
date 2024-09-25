import envApi from '@/services/apis/env';
import { getEnvVersion } from '@/utils';
import { logger } from '@/utils/logger';
import chalk from 'chalk';

const getCurrentVersion = async () => {
	const version = getEnvVersion();

	try {
		const { data } = await envApi.getTotalOfForwardVersions(version);

		logger.log('\nCurrent version: ' + chalk.cyan(version));

		if (data?.forwardVersionTotal > 0) {
			logger.log(
				`Your version is behind by ${data?.forwardVersionTotal} commits, and can be fast-forwarded.\n`,
			);
			logger.log('(use "ssm-cli pull" to update your local)")');
		}
	} catch (error) {
		logger.error('Error fetching current version', error.message);
	}
};

export default getCurrentVersion;
