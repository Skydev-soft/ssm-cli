import { APP_NAME, PAT_FILENAME } from '@/constants/common';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
	decryptDataWithAES,
	decryptKeyManual,
	encryptDataWithAES,
	encryptKeyManual,
} from './encrypt-decrypt';

export const getAppDataPath = () => {
	const homeDir = os.homedir();

	switch (process.platform) {
		case 'win32':
			return path.join(homeDir, 'AppData', 'Roaming', APP_NAME);
		case 'darwin':
			return path.join(homeDir, 'Library', 'Application Support', APP_NAME);
		case 'linux':
		default:
			return path.join(homeDir, '.config', APP_NAME);
	}
};

const ensureDirectoryExistence = (filePath: string) => {
	const dirname = path.dirname(filePath);

	if (!fs.existsSync(dirname)) {
		fs.mkdirSync(dirname, { recursive: true });
	}
};

export const saveToken = async (token: string) => {
	const appDataPath = getAppDataPath();
	const tokenFilePath = path.join(appDataPath, PAT_FILENAME ?? '');

	ensureDirectoryExistence(tokenFilePath);

	const fileContent = await encryptDataWithAES(token);
	const encryptedFileContent = encryptKeyManual(JSON.stringify(fileContent));

	fs.writeFileSync(tokenFilePath, JSON.stringify(encryptedFileContent), {
		mode: 0o600,
	});
};

export const loadToken = async () => {
	const appDataPath = getAppDataPath();

	const tokenFilePath = path.join(appDataPath, PAT_FILENAME ?? '');

	if (!fs.existsSync(tokenFilePath)) {
		return null;
	}

	const encryptedFileContent = JSON.parse(
		fs.readFileSync(tokenFilePath, 'utf8'),
	);

	const fileContent = JSON.parse(decryptKeyManual(encryptedFileContent));

	const { encryptedData, iv, clientKey } = fileContent;

	const data = await decryptDataWithAES(encryptedData, iv, clientKey);

	return data;
};
