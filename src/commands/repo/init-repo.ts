import { REPO_LINK_KEY, REPO_PATHNAME_KEY } from '@/constants/common';
import repoApi from '@/services/apis/repo';
import { IMessage } from '@/types/common';
import { createEnvFile } from '@/utils';
import { logger } from '@/utils/logger';

const initRepo = async (pathname: string) => {
	try {
		const detailRepo = await repoApi.getRepo(pathname);

		createEnvFile({
			data: {
				[REPO_PATHNAME_KEY]: pathname,
				[REPO_LINK_KEY]: detailRepo.data.httpUrlToRepo,
			},
			fileName: '.env.vault',
		});

		logger.info('Repository initialized');
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default initRepo;
