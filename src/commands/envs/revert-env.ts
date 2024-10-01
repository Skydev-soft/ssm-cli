import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import {
	createEnvFile,
	getEnvInfoFromOptions,
	getEnvVersion,
	getRepoInfoFromFile,
	updateLocalEnvVersion,
} from '@/utils';
import { getEnvFilePath } from '@/utils/file';
import { logger } from '@/utils/logger';

const revertEnv = async (version: string) => {
	try {
		const { environment, fileName } = getEnvInfoFromOptions({ develop: true });
		const repoInfo = getRepoInfoFromFile();

		if (!repoInfo) return;

		const currentEnvVersion = getEnvVersion();

		if (currentEnvVersion === version) {
			logger.log('Already in this version.');
			return;
		}

		const env = await envApi.getEnvByIdOrVersion({
			environment,
			idOrVersion: version,
		});

		if (env) {
			createEnvFile({
				data: env,
				fileName: getEnvFilePath(fileName),
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
