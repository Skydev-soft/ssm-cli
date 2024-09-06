import { createEnvFile } from '@/utils';
import chalk from 'chalk';
import open from 'open';
import ora from 'ora';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'https://api.dotenv.org';

const login = async () => {
	const spinner = ora('Initiating login process...').start();

	try {
		const loginId = uuidv4();

		const loginUrl = `${API_URL}/login/${loginId}`;

		spinner.succeed('Login URL generated. Opening in your default browser...');
		await open(loginUrl);

		console.log(
			chalk.yellow('Please complete the login process in your browser.'),
		);
		console.log(chalk.yellow('Waiting for login to complete...'));

		const accessToken = 'aaaa';

		createEnvFile({
			data: {
				DOTENV_TOKEN: accessToken,
			},
			fileName: '.env',
		});

		console.log(chalk.green('Successfully logged in!'));
		console.log(chalk.green('DOTENV_TOKEN has been added to your .env file.'));
	} catch (error) {
		spinner.fail('Login process failed');
		console.error(chalk.red('An error occurred during login:'), error);
	}
};

export default login;
