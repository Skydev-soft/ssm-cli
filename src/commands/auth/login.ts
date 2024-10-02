import { WEBSITE_URL } from '@/constants/common';
import authApi from '@/services/apis/auth';
import { addGitignoreRules, pollForToken } from '@/utils';
import { getEncryptionKeyConfig } from '@/utils/config';
import { logger } from '@/utils/logger';
import { saveToken } from '@/utils/os';
import chalk from 'chalk';
import open from 'open';
import ora from 'ora';

const login = async () => {
	const spinner = ora('Initiating login process...').start();

	// Validate the encryption key is set
	getEncryptionKeyConfig();

	try {
		const loginSession = await authApi.createCLILoginSession();
		const sectionId = loginSession.data.id ?? '';
		const loginUrl = `${WEBSITE_URL}/cli-sign-in?session-id=${sectionId}`;

		logger.info(`\nLogin URL: ${loginUrl}`);

		await open(loginUrl);
		logger.succeed('Login URL generated. Opening in your default browser...');
		spinner.succeed(
			chalk.yellow(' Please complete the login process in your browser.'),
		);

		const spinner2 = ora('Waiting for login to complete...').start();

		const accessToken = await pollForToken(sectionId);

		await saveToken(accessToken);

		logger.succeed('\n Successfully logged in!');
		spinner2.succeed().stop();

		addGitignoreRules();
	} catch (error) {
		spinner.fail('Login process failed');
		console.error('An error occurred during login:', error);
	}
};

export default login;
