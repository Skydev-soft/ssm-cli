import { CONFIG_FILES } from '@/constants/common';
import { ISetupConfigOptionsProps } from '@/types/auth';
import { loadUserConfig } from '@/utils/config';
import { logger } from '@/utils/logger';
import { ensureDirectoryExistence, getAppDataPath } from '@/utils/os';
import { handleChangeTrackingValue } from '@/utils/tracking-file';
import fs from 'fs';
import path from 'path';

const handleChangeConfig = (data: ISetupConfigOptionsProps) => {
	const configFilePath = path.join(getAppDataPath(), 'config.json');

	const { privateKey } = data;

	if (privateKey?.length > 0) {
		if (privateKey.length != 64) {
			logger.error('Invalid encryption key. Key must be 64 characters long.');
			return;
		}

		const config = loadUserConfig();

		config.privateKey = privateKey;

		ensureDirectoryExistence(configFilePath);

		fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

		// Store the private key in the tracking file, for tracking change it later
		const trackingData = loadUserConfig(CONFIG_FILES.TRACKING_DATA);

		if (!trackingData?.privateKey) {
			handleChangeTrackingValue('privateKey', privateKey, false);
		}

		logger.succeed(
			'Config set successfully. Change encryption key, you must login again.',
		);
	}
};

export const setupConfig = (data: ISetupConfigOptionsProps) => {
	handleChangeConfig(data);
};
