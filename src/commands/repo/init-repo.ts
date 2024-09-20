import {
	REPO_ID_KEY,
	REPO_LINK_KEY,
	REPO_PATHNAME_KEY,
} from '@/constants/common';
import { ENV_VAULT } from '@/constants/envs';
import repoApi from '@/services/apis/repo';
import { IMessage } from '@/types/common';
import { IRepoInitProps } from '@/types/repo';
import { createEnvFile } from '@/utils';
import { getGitOrigin } from '@/utils/git';
import { logger } from '@/utils/logger';
import syncRepo from './sync-repo';

const initRepo = async (pathname: string, props: IRepoInitProps) => {
	const { sync } = props;

	try {
		if (sync) {
			await syncRepo();
		}

		if (!pathname) {
			const { namespace, path } = getGitOrigin();
			pathname = `${namespace}-${path}`;
		}

		const {
			data: { httpUrlToRepo, id },
		} = await repoApi.getRepo(pathname);

		createEnvFile({
			data: {
				[REPO_ID_KEY]: id,
				[REPO_PATHNAME_KEY]: pathname,
				[REPO_LINK_KEY]: httpUrlToRepo,
			},
			fileName: ENV_VAULT,
		});

		logger.info('Repository initialized');
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
		if (errorData.statusCode === 401) {
			logger.warn('You do not have permission, please login first');
		} else {
			logger.warn(
				'Note: Please check if you have synchronized the repository: ssm-cli sync',
			);
		}
	}
};

export default initRepo;
