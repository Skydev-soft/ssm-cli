import { WORKING_DIR_KEY } from '@/constants/common';
import * as diff from 'diff';
import fs from 'fs';
import path from 'path';
import { getRepoInfoFromFile } from '.';

export const getEnvFilePath = (fileName: string) => {
	const repoInfo = getRepoInfoFromFile();

	return path.resolve(repoInfo?.[WORKING_DIR_KEY] ?? '', fileName);
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
