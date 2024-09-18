import { IMessage } from '@/types/common';
import { logger } from '@/utils/logger';

const pullEnv = async () => {
	try {
		// const detailRepo = await repoApi.getRepo(pathname);

		// createEnvFile({
		// 	data: {
		// 		[REPO_PATHNAME_KEY]: pathname,
		// 		[REPO_LINK_KEY]: detailRepo.data.httpUrlToRepo,
		// 	},
		// 	fileName: '.env.vault',
		// });

		logger.info('Env initialized');
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default pullEnv;
