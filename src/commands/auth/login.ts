import { API_URL, WEBSITE_URL } from '@/constants/envs';
import authApi from '@/services/apis/auth';
import { createEnvFile, pollForToken } from '@/utils';
import { logger } from '@/utils/logger';
import chalk from 'chalk';
import open from 'open';
import ora from 'ora';

const login = async () => {
	console.log({ API_URL });
	const spinner = ora('Initiating login process...').start();

	try {
		const loginSession = await authApi.createCLILoginSession();
		const sectionId = loginSession.data.id;
		const loginUrl = `${WEBSITE_URL}/cli-sign-in?session-id=${sectionId}`;

		await open(loginUrl);
		logger.succeed('Login URL generated. Opening in your default browser...');
		logger.info(
			chalk.yellow('Please complete the login process in your browser.'),
		);
		logger.warn('Waiting for login to complete...');

		const accessToken = await pollForToken(sectionId);

		createEnvFile({
			data: {
				DOTENV_TOKEN: accessToken,
			},
			fileName: '.env.me',
		});

		logger.succeed('Successfully logged in!');
		spinner.succeed('SSM_TOKEN has been added to your .env.me file.');
	} catch (error) {
		spinner.fail('Login process failed');
		console.error('An error occurred during login:', error);
	}
};

export default login;
