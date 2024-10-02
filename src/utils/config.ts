import fs from 'fs';
import path from 'path';
import { logger } from './logger';
import { getAppDataPath } from './os';

export const loadUserConfig = () => {
	if (!fs.existsSync(path.join(getAppDataPath(), 'config.json'))) {
		return {};
	}

	return JSON.parse(
		fs.readFileSync(path.join(getAppDataPath(), 'config.json'), 'utf8'),
	);
};

export const getEncryptionKeyConfig = () => {
	const config = loadUserConfig();

	if (!config?.ENCRYPTION_KEY) {
		logger.error(
			'Encryption key is not set. Please set it using `ssm-cli config set encryption-key <key>`',
		);
	}

	return config.ENCRYPTION_KEY;
};
