import { GENERATE_PRIVATE_KEY_URL } from '@/constants/common';
import { getAppDataPath } from '@/utils/os';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export const loadUserConfig = () => {
	if (!fs.existsSync(path.join(getAppDataPath(), 'config.json'))) {
		return {};
	}

	const data = fs.readFileSync(
		path.join(getAppDataPath(), 'config.json'),
		'utf8',
	);

	return JSON.parse(data.length === 0 || data === '\n' ? '{}' : data);
};

export const getEncryptionKeyConfig = () => {
	const config = loadUserConfig();

	if (!config?.privateKey) {
		logger.warn(
			`Encryption key is not set. Please set it using 'ssm-cli config set --private-key <key>'. Get key from ${GENERATE_PRIVATE_KEY_URL}`,
		);
		process.exit(1);
	}

	return config.privateKey;
};
