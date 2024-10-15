import envApi from '@/services/apis/env';
import { IEnvironments } from '@/types/env';
import { getEnvInfoFromOptions, getEnvVersion } from '@/utils';
import { logger } from '@/utils/logger';
import chalk from 'chalk';

const getCurrentVersion = async (options: IEnvironments) => {
	try {
		const { environment } = getEnvInfoFromOptions(options);
		const version = getEnvVersion(environment);

		const { data } = await envApi.getTotalOfForwardVersions({
			version,
			environment,
		});

		logger.log(
			`\nCurrent ${environment.toLowerCase()} version: ` + chalk.cyan(version),
		);

		if (data?.forwardVersionTotal > 0) {
			logger.log(
				`Your version is behind by ${data?.forwardVersionTotal} commits, and can be fast-forwarded.\n`,
			);

			logger.log('(use "ssm-cli pull" to update your local)")');
		}
	} catch (error) {
		logger.error(error.message);
	}
};

export default getCurrentVersion;
