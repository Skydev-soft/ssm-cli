import { ACCESS_TOKEN_KEY } from '@/constants/common';
import authApi from '@/services/apis/auth';
import { CreateEnvFile, EnvironmentEnum } from '@/types/common';
import { PullPushEnvOptionProps } from '@/types/env';
import fs from 'fs';
import { logger } from './logger';

export const createEnvFile = ({ data, fileName }: CreateEnvFile) => {
	let content;
	if (typeof data === 'string') {
		content = data;
	} else {
		content = Object.entries(data)
			.map(([key, value]) => `${key}=${value}`)
			.join('\n');
	}

	fs.writeFile(fileName, content, (err) => {
		if (err) {
			logger.error(`Error creating ${fileName} file:`, err);
		} else {
			logger.succeed(`${fileName} file created`);
		}
	});
};

export const getAccessTokenFromFile = (filePath = '.env.me'): string => {
	try {
		const content = fs.readFileSync(filePath, 'utf8');

		const accessTokenLine = content
			.split('\n')
			.find((line) => line.startsWith(ACCESS_TOKEN_KEY));
		return accessTokenLine?.split('=')[1] || '';
	} catch (err) {
		return '';
	}
};

export const getEnvFromFile = (filePath = '.env'): string => {
	try {
		const content = fs.readFileSync(filePath, 'utf8');

		return content;
	} catch (err) {
		logger.warn(`No ${filePath} file found.`);
		return '';
	}
};

export const getRepoInfoFromFile = (filePath = '.env.vault') => {
	try {
		const content = fs.readFileSync(filePath, 'utf8');

		const repoInfo: Record<string, string> = {};
		content.split('\n').forEach((line) => {
			const [key, value] = line.split('=');
			repoInfo[key] = value;
		});

		return repoInfo;
	} catch (err) {
		logger.warn('No repository found. Please run `ssm-cli repo init` first');
		return null;
	}
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

export const getEnvInfoFromOptions = ({
	production,
	develop,
	cicd,
	staging,
}: PullPushEnvOptionProps) => {
	if (production)
		return {
			environment: EnvironmentEnum.PRODUCTION,
			fileName: '.env.production',
		};

	if (develop)
		return {
			environment: EnvironmentEnum.DEVELOPMENT,
			fileName: '.env',
		};

	if (cicd)
		return {
			environment: EnvironmentEnum.CI_CD,
			fileName: '.env.cicd',
		};

	if (staging)
		return {
			environment: EnvironmentEnum.STAGING,
			fileName: '.env.staging',
		};

	return {
		environment: EnvironmentEnum.DEVELOPMENT,
		fileName: '.env',
	};
};
