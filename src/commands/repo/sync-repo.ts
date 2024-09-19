import repoApi from '@/services/apis/repo';
import { IMessage } from '@/types/common';
import { getGitOrigin } from '@/utils/git';
import { logger } from '@/utils/logger';
import chalk from 'chalk';
import ora from 'ora';

const syncRepo = async () => {
	try {
		const { namespace, path, pathWithNamespace } = getGitOrigin();

		const spinner = ora('Initiating sync repository from Gitlab...').start();

		await repoApi.syncRepo(namespace, path);

		spinner.succeed(
			` Repository ${chalk.green(pathWithNamespace)} synced successfully`,
		);

		console.log('You can now use this repository for managing secrets: ');
		console.log(`\t1. Push ENV: ${chalk.green('ssm-cli push')}`);
		console.log(`\t2. Pull ENV: ${chalk.green('ssm-cli pull')}`);
		console.log(
			`${chalk.yellow(
				'Note:',
			)} If this is your first time using the CLI, you need to login and push your ENV first before pulling from the registry`,
		);
	} catch (error) {
		const { statusCode } = error as IMessage;

		if (statusCode === 401) {
			logger.warn('Your access token is invalid, please login again');
		} else {
			logger.error('Error syncing repo:', error);
		}
	}
};

export default syncRepo;
