import { REPO_ID_KEY } from '@/constants/common';
import envApi from '@/services/apis/env';
import { EnvironmentEnum, IMessage } from '@/types/common';
import { getEnvFromFile, getRepoInfoFromFile } from '@/utils';
import { logger } from '@/utils/logger';

const pushEnv = async () => {
	try {
		const repoInfo = getRepoInfoFromFile();
		if (!repoInfo) return;

		const env = getEnvFromFile();

		if (!env) return;

		await envApi.createEnv({
			environment: EnvironmentEnum.DEVELOPMENT,
			repositoryId: repoInfo[REPO_ID_KEY],
			env,
		});

		logger.info('Push env successfully');
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default pushEnv;
