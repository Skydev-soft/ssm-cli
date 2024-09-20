import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import {
	createEnvFile,
	getEnvInfoFromOptions,
	getRepoInfoFromFile,
	updateLocalEnvVersion,
} from '@/utils';
import { logger } from '@/utils/logger';

const revertEnv = async (version: string) => {
	try {
		const { environment, fileName } = getEnvInfoFromOptions({ develop: true });
		const repoInfo = getRepoInfoFromFile();

		if (!repoInfo) return;

		const env = await envApi.getEnvByIdOrVersion({
			environment,
			idOrVersion: version,
		});

		if (env) {
			createEnvFile({
				data: env,
				fileName,
			});

			updateLocalEnvVersion({ version });

			logger.info('Revert env successfully');
		}
	} catch (error) {
		const errorData = error as IMessage;

		logger.error(errorData.message);
	}
};

export default revertEnv;
