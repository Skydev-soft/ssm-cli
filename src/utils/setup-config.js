/* eslint-disable prettier/prettier */
const crypto = require('crypto');
const figlet = require('figlet');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const APP_NAME = 'ssm-cli';

const getAppDataPath = () => {
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

const generateEncryptionKey = () => {
	const key = crypto.randomBytes(32);

	return key.toString('hex');
};

const handleInputEncryptionKey = (rl) => {
	const askForKey = () => {
		rl.question(
			'ENCRYPTION_KEY (Enter for auto-generate or Get it: https://web-ssm.skydev.vn/generate-encryption-key): ',
			(encryptionKey) => {
				if (encryptionKey?.length >= 1 && encryptionKey.length !== 64) {
					console.error(
						'ENCRYPTION_KEY must be 64 characters long. Please try again.',
					);
					return askForKey();
				}

				if (encryptionKey.length == 0) {
					encryptionKey = generateEncryptionKey();
				}

				config.ENCRYPTION_KEY = encryptionKey;

				const configPath = path.join(getAppDataPath(), 'config.json');

				fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

				console.log('Configuration saved successfully!');
				rl.close();
			},
		);
	};

	askForKey();
};

const main = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const text = figlet.textSync('SSM CLI', {
		font: 'Small',
	});

	console.info(text);
	console.warn(
		'Set up your package configuration (Must be done before running any command)',
	);

	handleInputEncryptionKey(rl);
};

const config = {
	ENCRYPTION_KEY: '',
};

main();
