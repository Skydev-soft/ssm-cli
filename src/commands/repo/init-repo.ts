import {
	REPO_ID_KEY,
	REPO_LINK_KEY,
	REPO_NAME_KEY,
	WORKING_DIR_KEY,
} from '@/constants/common';
import repoApi from '@/services/apis/repo';
import { IMessage } from '@/types/common';
import { IRepoInitProps } from '@/types/repo';
import { createEnvFile } from '@/utils';
import { getGitOrigin } from '@/utils/git';
import { logger } from '@/utils/logger';
import syncRepo from './sync-repo';

const initRepo = async (
	root: string,
	repo: { name: string },
	props: IRepoInitProps,
) => {
	const { sync } = props;
	let repoName = repo?.name;
	const workingDir = root;

	try {
		if (sync) {
			await syncRepo();
		}

		if (
			!repo?.name ||
			repo?.name?.includes('.') ||
			repo?.name?.includes('/') ||
			repo?.name?.includes('\\')
		) {
			const { namespace, path } = getGitOrigin();
			repoName = `${namespace}-${path}`;
		}

		const {
			data: { httpUrlToRepo, id },
		} = await repoApi.getRepo(repoName);

		createEnvFile({
			data: {
				[REPO_ID_KEY]: id,
				[REPO_NAME_KEY]: repoName,
				[REPO_LINK_KEY]: httpUrlToRepo,
				[WORKING_DIR_KEY]: workingDir,
			},
			fileName: process.env.ENV_VAULT ?? '',
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
