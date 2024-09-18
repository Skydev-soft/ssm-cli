import { REPO_PATHNAME_KEY } from '@/constants/common';
import envApi from '@/services/apis/env';
import { EnvironmentEnum, IMessage } from '@/types/common';
import { createEnvFile, getRepoInfoFromFile } from '@/utils';
import { logger } from '@/utils/logger';

const pullEnv = async () => {
	try {
		const repoInfo = getRepoInfoFromFile();
		if (!repoInfo) return;

		const env = await envApi.getLatestEnv({
			environment: EnvironmentEnum.DEVELOPMENT,
			pathWithNamespace: repoInfo[REPO_PATHNAME_KEY],
		});

		if (env) {
			createEnvFile({
				data: env,
				fileName: '.env',
			});

			logger.info('Env initialized');
		}
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default pullEnv;
