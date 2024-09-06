import chalk from 'chalk';
import fs from 'fs';
import { API_URL } from '../constants/envs';
import { CreateEnvFile } from '../types';

export const createEnvFile = ({ data, fileName }: CreateEnvFile) => {
	const content = Object.entries(data)
		.map(([key, value]) => `${key}=${value}`)
		.join('\n');

	fs.writeFile(fileName, content, (err) => {
		if (err) {
			console.log(chalk.red(`Error creating ${fileName} file:`, err));
		} else {
			console.log(chalk.green(`${fileName} file created`));
		}
	});
};

export const pollForToken = async (
	loginId: string,
	maxAttempts = 30,
	interval = 2000,
): Promise<string> => {
	for (let i = 0; i < maxAttempts; i++) {
		try {
			const response = await fetch(`${API_URL}/login_status/${loginId}`);
			if (response.ok) {
				const data = (await response.json()) as { token: string };
				if (data.token) {
					return data.token;
				}
			}
		} catch (error) {
			console.error('Error checking login status:', error);
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
	throw new Error('Login timed out. Please try again.');
};
