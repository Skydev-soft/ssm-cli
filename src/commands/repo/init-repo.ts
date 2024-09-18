import {
	REPO_ID_KEY,
	REPO_LINK_KEY,
	REPO_PATHNAME_KEY,
} from '@/constants/common';
import repoApi from '@/services/apis/repo';
import { IMessage } from '@/types/common';
import { createEnvFile } from '@/utils';
import { logger } from '@/utils/logger';

const initRepo = async (pathname: string) => {
	try {
		const {
			data: { httpUrlToRepo, id },
		} = await repoApi.getRepo(pathname);

		createEnvFile({
			data: {
				[REPO_ID_KEY]: id,
				[REPO_PATHNAME_KEY]: pathname,
				[REPO_LINK_KEY]: httpUrlToRepo,
			},
			fileName: '.env.vault',
		});

		logger.info('Repository initialized');
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
		if (errorData.statusCode === 401) {
			logger.warn('You do not have permission, please login first');
		}
	}
};

export default initRepo;
