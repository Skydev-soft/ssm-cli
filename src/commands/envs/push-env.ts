import { REPO_ID_KEY } from '@/constants/common';
import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import { PullPushEnvOptionProps } from '@/types/env';
import {
	getEnvFromFile,
	getEnvInfoFromOptions,
	getRepoInfoFromFile,
} from '@/utils';
import { logger } from '@/utils/logger';

const pushEnv = async (props: PullPushEnvOptionProps) => {
	try {
		const { environment, fileName } = getEnvInfoFromOptions(props);

		const repoInfo = getRepoInfoFromFile();
		if (!repoInfo) return;

		const env = getEnvFromFile(fileName);

		if (!env) return;

		await envApi.createEnv({
			environment,
			repositoryId: repoInfo[REPO_ID_KEY],
			env,
		});

		logger.info(`Push env ${environment} successfully`);
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default pushEnv;
