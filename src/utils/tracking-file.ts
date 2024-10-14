import { CONFIG_FILES } from '@/constants/common';
import fs from 'fs';
import path from 'path';
import { loadUserConfig } from './config';
import { getHashValue } from './encrypt-decrypt';
import { ensureDirectoryExistence, getAppDataPath } from './os';

export const isChangeValue = (
	key: string,
	newData: string,
	isHashing = false,
) => {
	const trackingEnvData = loadUserConfig(CONFIG_FILES.TRACKING_DATA);
	const oldValue = trackingEnvData[key];

	return oldValue !== (isHashing ? getHashValue(newData) : newData);
};

export const handleChangeTrackingValue = (
	key: string,
	value: string,
	isHashing = false,
) => {
	const oldEnvDataPath = path.join(
		getAppDataPath(),
		CONFIG_FILES.TRACKING_DATA,
	);

	const trackingData = loadUserConfig(CONFIG_FILES.TRACKING_DATA);

	trackingData[key] = isHashing ? getHashValue(value) : value;

	ensureDirectoryExistence(oldEnvDataPath);

	fs.writeFileSync(oldEnvDataPath, JSON.stringify(trackingData, null, 2));
};
