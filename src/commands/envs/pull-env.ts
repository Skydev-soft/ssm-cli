import { REPO_NAME_KEY } from '@/constants/common';
import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import { PullPushEnvOptionProps } from '@/types/env';
import {
	getEnvInfoFromOptions,
	getEnvVersion,
	getRepoInfoFromFile,
	isExistEnvVersionFile,
	updateLocalEnvVersion,
} from '@/utils';
import {
	getEnvFilePath,
	isExistFile,
	mergeEnvContents,
	readEnvFile,
} from '@/utils/file';
import { logger } from '@/utils/logger';
import fs from 'fs';

export const updateEnvFileWhenPulling = async (
	remoteEnv: string,
	fileName: string,
	props: PullPushEnvOptionProps,
) => {
	const { force } = props;

	if (force || !isExistFile(fileName)) {
		// if pull force, it will overwrite the local .env file with the remote .env file
		fs.writeFileSync(fileName, remoteEnv, 'utf-8');
	} else {
		// pull and merge with the local .env file. If there is a conflict, it will show a warning message.
		const localEnv = readEnvFile(fileName).join('\n');

		const { mergedContent, hasConflicts } = mergeEnvContents(
			localEnv,
			remoteEnv,
		);

		if (hasConflicts) {
			logger.warn(
				'Conflicts detected in .env file. Please resolve them before pushing.',
			);
		}

		fs.writeFileSync(fileName, mergedContent, 'utf-8');
	}
};

const pullEnv = async (props: PullPushEnvOptionProps) => {
	try {
		const { environment, fileName } = getEnvInfoFromOptions(props);
		const repoInfo = getRepoInfoFromFile();

		if (!repoInfo) return;

		const { decryptedData, version } = await envApi.getLatestEnv({
			environment,
			pathWithNamespace: repoInfo[REPO_NAME_KEY],
		});

		if (isExistEnvVersionFile() && isExistFile(fileName)) {
			const currentEnvVersion = getEnvVersion(environment);

			if (currentEnvVersion === version) {
				logger.log('Already up to date.');
				return;
			}
		}

		if (decryptedData) {
			updateEnvFileWhenPulling(decryptedData, getEnvFilePath(fileName), props);

			updateLocalEnvVersion({ version, environment });

			logger.info(
				`.env file updated successfully${props?.force ? ' with force' : ''}.`,
			);
		}
	} catch (error) {
		const errorData = error as IMessage;

		logger.error(errorData.message);
	}
};

export default pullEnv;
