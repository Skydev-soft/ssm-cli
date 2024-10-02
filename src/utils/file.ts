import {
	ACCESS_TOKEN_KEY,
	ENV_VAULT,
	ENV_VERSION,
	WORKING_DIR_KEY,
} from '@/constants/common';
import authApi from '@/services/apis/auth';
import {
	CreateEnvFile,
	EnvironmentEnum,
	IUpdateLocalEnvVersion,
} from '@/types/common';
import { PullPushEnvOptionProps } from '@/types/env';
import * as diff from 'diff';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export const getEnvFilePath = (fileName: string) => {
	const repoInfo = getRepoInfoFromFile();

	return path.resolve(repoInfo?.[WORKING_DIR_KEY] ?? '', fileName);
};

export const checkAndCreateFileIfNotExist = (filePath: string) => {
	const isExistFile = fs.existsSync(filePath);

	if (!isExistFile) {
		// Create file if not exist
		fs.writeFileSync(filePath, '', 'utf8');
	}
};

export const readEnvFile = (filePath: string) => {
	try {
		return fs.readFileSync(filePath, 'utf8').split('\n');
	} catch (error) {
		console.error('Error reading .env file:', error);
		return [];
	}
};

export const mergeEnvContents = (local: string, remote: string) => {
	const diffResults = diff.diffLines(local, remote);

	let mergedContent = '';
	let hasConflicts = false;

	for (let i = 0; i < diffResults.length; i++) {
		const part = diffResults[i];

		if (part.removed || part.added) {
			if (i == diffResults.length - 1) {
				mergedContent += part.value;
			} else if (i < diffResults.length - 1) {
				const nextPart = diffResults[i + 1];

				if (nextPart.added != part.added && nextPart.removed != part.removed) {
					const partEndLine = hasEndLineAtTheEndString(part.value);
					const nextPartEndLine = hasEndLineAtTheEndString(nextPart.value);

					if (nextPart.value.startsWith(part.value)) {
						mergedContent += nextPart.value;
					} else {
						hasConflicts = true;
						// Local value
						mergedContent += `${partEndLine ? '' : '\n'}<<<<<<< LOCAL\n`;
						mergedContent += part.value;
						mergedContent += `${partEndLine ? '' : '\n'}=======\n`;
						// Remote value
						mergedContent += nextPart.value;
						mergedContent += `${nextPartEndLine ? '' : '\n'}>>>>>>> REMOTE\n`;
					}

					i++;
				} else if (!nextPart.added && !nextPart.removed) {
					mergedContent += part.value;
				}
			}
		} else {
			mergedContent += part.value;
		}
	}

	return { mergedContent, hasConflicts };
};

export const hasEndLineAtTheEndString = (data: string) => {
	const endline = data.slice(-1);

	return endline === '\n';
};

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
		}
	});
};

export const updateLocalEnvVersion = ({
	version,
	fileName = ENV_VERSION ?? '',
}: IUpdateLocalEnvVersion) => {
	try {
		const content = isExistEnvVersionFile()
			? fs.readFileSync(fileName, 'utf8')
			: '';
		const lines = content.split('\n');
		if (lines[lines.length - 1] === '') lines.pop();

		let hasEnvVersionLine = false;

		const updatedLines = lines.map((line) => {
			if (line.startsWith('ENV_VERSION=')) {
				hasEnvVersionLine = true;
				return `ENV_VERSION=${version}`;
			}

			return line;
		});

		if (!hasEnvVersionLine) {
			updatedLines.push(`ENV_VERSION=${version}`);
		}

		const updatedContent = updatedLines.join('\n');

		fs.writeFile(fileName, updatedContent, (err) => {
			if (err) {
				logger.error(`Error updating ENV_VERSION in ${fileName}:`, err);
			}
		});
	} catch (err) {
		logger.error(`Error updating ENV_VERSION in ${fileName}:`, err);
	}
};

export const getEnvVersion = (fileName = ENV_VERSION ?? '') => {
	const content = fs.readFileSync(fileName, 'utf8');
	const lines = content.split('\n');

	return (
		lines.find((line) => line.startsWith('ENV_VERSION='))?.split('=')?.[1] ?? ''
	);
};

export const isExistEnvVersionFile = (fileName = ENV_VERSION ?? '') => {
	return fs.existsSync(fileName);
};

export const isExistFile = (fileName: string) => {
	return fs.existsSync(fileName);
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

export const getRepoInfoFromFile = (filePath = ENV_VAULT ?? '') => {
	try {
		const content = fs.readFileSync(filePath, 'utf8');

		const repoInfo: Record<string, string> = {};
		content.split('\n').forEach((line) => {
			const [key, value] = line.split('=');
			repoInfo[key] = value;
		});

		return repoInfo;
	} catch (err) {
		logger.warn('No repository found. Please run `ssm-cli init` first');
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
}: Omit<PullPushEnvOptionProps, 'message'>) => {
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
