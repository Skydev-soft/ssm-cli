import { createEnvFile } from '@/utils';
import { logger } from '@/utils/logger';
import chalk from 'chalk';
import open from 'open';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'https://api.dotenv.org';

export const login = async () => {
	const spinner = ora('Initiating login process...').start();

	try {
		const loginId = uuidv4();

		const loginUrl = `${API_URL}/login/${loginId}`;

		spinner.succeed('Login URL generated. Opening in your default browser...');
		await open(loginUrl);

		logger.info(
			chalk.yellow('Please complete the login process in your browser.'),
		);
		logger.warn('Waiting for login to complete...');

		const accessToken = 'aaaa';

		createEnvFile({
			data: {
				DOTENV_TOKEN: accessToken,
			},
			fileName: '.env',
		});

		logger.succeed('Successfully logged in!');
		logger.succeed('DOTENV_TOKEN has been added to your .env file.');
	} catch (error) {
		spinner.fail('Login process failed');
		logger.error('An error occurred during login:', error);
	}
};
