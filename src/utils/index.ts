import authApi from '@/services/apis/auth';
import { CreateEnvFile } from '@/types';
import fs from 'fs';
import { logger } from './logger';

export const createEnvFile = ({ data, fileName }: CreateEnvFile) => {
	const content = Object.entries(data)
		.map(([key, value]) => `${key}=${value}`)
		.join('\n');

	fs.writeFile(fileName, content, (err) => {
		if (err) {
			logger.error(`Error creating ${fileName} file:`, err);
		} else {
			logger.succeed(`${fileName} file created`);
		}
	});
};

export const pollForToken = async (
	sectionId: string,
	maxAttempts = 300,
	interval = 2000,
): Promise<string> => {
	for (let i = 0; i < maxAttempts; i++) {
		try {
			const {
				data: { accessToken },
			} = await authApi.verify(sectionId);

			return accessToken;
		} catch (error) {
			//
		}
		await new Promise((resolve) => setTimeout(resolve, interval));
	}
	throw new Error('Login timed out. Please try again.');
};

export const addGitignoreRules = async (filePath = '.gitignore') => {
	const newRules = `
  # Env files
  .env*
  !.env.project
  !.env.vault
  `;

	try {
		let content = fs.readFileSync(filePath, 'utf8');

		if (!content.includes('# Env files')) {
			content += '\n' + newRules.trim() + '\n';
			fs.writeFileSync(filePath, content);
			logger.succeed(`${filePath} file updated with new rules`);
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			fs.writeFileSync(filePath, newRules.trim() + '\n');
			logger.succeed(`${filePath} file created with new rules`);
		} else {
			logger.error(`Error updating ${filePath} file:`, err);
		}
	}
};

export const convertToCookieString = (
	cookiesObj: Record<string, string>,
): string =>
	Object.entries(cookiesObj)
		.map(([key, value]) => `${key}=${value}`)
		.join('; ');
