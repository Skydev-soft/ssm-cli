import { REPO_PATHNAME_KEY } from '@/constants/common';
import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import { PullPushEnvOptionProps } from '@/types/env';
import {
	createEnvFile,
	getEnvInfoFromOptions,
	getRepoInfoFromFile,
	updateLocalEnvVersion,
} from '@/utils';
import { logger } from '@/utils/logger';

const pullEnv = async (props: PullPushEnvOptionProps) => {
	try {
		const { environment, fileName } = getEnvInfoFromOptions(props);
		const repoInfo = getRepoInfoFromFile();
		if (!repoInfo) return;

		const { decryptedData, version } = await envApi.getLatestEnv({
			environment,
			pathWithNamespace: repoInfo[REPO_PATHNAME_KEY],
		});

		if (decryptedData) {
			createEnvFile({
				data: decryptedData,
				fileName,
			});

			updateLocalEnvVersion({ version });

			logger.info('Env initialized');
		}
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default pullEnv;
