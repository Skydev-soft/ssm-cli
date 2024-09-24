import fs from 'fs';
import { logger } from './logger';

export const readEnvFile = (filePath: string) => {
	try {
		return fs.readFileSync(filePath, 'utf8').split('\n');
	} catch (error) {
		console.error('Error reading .env file:', error);
		return [];
	}
};

export const isEmptyFile = (data: string[]) => {
	if (data.length === 0) {
		return true;
	}

	for (const line of data) {
		if (line.trim().length > 0) {
			return false;
		}
	}

	return true;
};

export const mergeEnvContents = (local: string[], remote: string[]) => {
	const merged = [];
	const remoteMap = new Map(
		remote.map((line, index) => {
			return [index, line];
		}),
	);

	if (isEmptyFile(local)) {
		for (const remoteLine of remoteMap.values()) {
			merged.push(remoteLine);
		}

		return merged;
	}

	let hasConflict = false;
	for (const [index, localLine] of local.entries()) {
		if (remoteMap.has(index)) {
			if (remoteMap.get(index) === localLine) {
				merged.push(localLine);
			} else {
				merged.push(
					`<<<<<<< Local\n${localLine}\n=======\n${remoteMap.get(
						index,
					)}\n>>>>>>> Remote`,
				);
				logger.log('CONFLICT on line', index);
				hasConflict = true;
			}

			remoteMap.delete(index);
		} else {
			merged.push(localLine);
		}
	}

	if (hasConflict) {
		logger.warn('Please resolve conflicts before pushing');
	}

	for (const remoteLine of remoteMap.values()) {
		merged.push(remoteLine);
	}

	return merged;
};
