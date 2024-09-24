import { REPO_PATHNAME_KEY } from '@/constants/common';
import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import { PullPushEnvOptionProps } from '@/types/env';
import {
	getEnvInfoFromOptions,
	getRepoInfoFromFile,
	updateLocalEnvVersion,
} from '@/utils';
import { mergeEnvContents, readEnvFile } from '@/utils/file';
import { logger } from '@/utils/logger';
import fs from 'fs';

async function updateEnvFile(remoteEnv: string, fileName: string) {
	const localEnv = readEnvFile(fileName);
	const mergedContent = mergeEnvContents(localEnv, remoteEnv.split('\n'));

	fs.writeFileSync(fileName, mergedContent.join('\n'), {
		encoding: 'utf-8',
		flag: 'w',
	});
}

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
			updateEnvFile(decryptedData, fileName);

			updateLocalEnvVersion({ version });

			logger.info('.env file updated successfully.');
		}
	} catch (error) {
		const errorData = error as IMessage;
		logger.error(errorData.message);
	}
};

export default pullEnv;
