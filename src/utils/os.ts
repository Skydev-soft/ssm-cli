import { APP_NAME } from '@/constants/envs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { decryptDataWithAES, encryptDataWithAES } from './encrypt-decrypt';

const getAppDataPath = () => {
	const homeDir = os.homedir();

	switch (process.platform) {
		case 'win32':
			return path.join(process.env.APPDATA ?? '', APP_NAME);
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
	const tokenFilePath = path.join(appDataPath, 'me.token.enc');

	ensureDirectoryExistence(tokenFilePath);

	const fileContent = await encryptDataWithAES(token);

	fs.writeFileSync(tokenFilePath, JSON.stringify(fileContent), {
		mode: 0o600,
	});
};

export const loadToken = async () => {
	const appDataPath = getAppDataPath();

	const tokenFilePath = path.join(appDataPath, 'me.token.enc');

	if (!fs.existsSync(tokenFilePath)) {
		return null;
	}

	const { encryptedData, iv, clientKey } = JSON.parse(
		fs.readFileSync(tokenFilePath, 'utf8'),
	);

	return await decryptDataWithAES(encryptedData, iv, clientKey);
};
