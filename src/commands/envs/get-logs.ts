import { REPO_ID_KEY } from '@/constants/common';
import {
	DEFAULT_TAKE_LOGS,
	DEFAULT_TAKE_ONE_LINE_LOGS,
} from '@/constants/envs';
import envApi from '@/services/apis/env';
import { IMessage } from '@/types/common';
import { IGetLogsOptionProps, IKeyValueLog } from '@/types/env';
import {
	getEnvInfoFromOptions,
	getEnvVersion,
	getRepoInfoFromFile,
} from '@/utils';
import {
	clearLine,
	clearPreviousLine,
	logEnvHistory,
	logger,
} from '@/utils/logger';
import readline from 'readline';

const logKeystrokesListeners = (
	rl: readline.Interface,
	currentPage: number,
) => {
	if (currentPage === 1) {
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding('utf8');
	}

	process.stdin.on('data', (key: string) => {
		if (key === 'q') {
			clearLine();
			process.exit();
		}
	});

	rl.on('SIGINT', () => {
		clearLine();
		rl.close();
	});
};

export const handleNextLogAction = async (rl: readline.Interface) => {
	process.stdout.write(':');

	await new Promise<void>((resolve) => {
		rl.once('line', () => {
			clearPreviousLine();
			resolve();
		});
	});
};

export const getLogs = async (props: IGetLogsOptionProps) => {
	try {
		const { oneline } = props;
		const take = oneline ? DEFAULT_TAKE_ONE_LINE_LOGS : DEFAULT_TAKE_LOGS;

		const repoInfo = getRepoInfoFromFile();
		if (!repoInfo) return;

		const { environment } = getEnvInfoFromOptions({ develop: true });

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		let currentPage = 1;
		let logsShown = 0;
		let hasMoreLogs = true;
		const currentEnvVersion = getEnvVersion();

		// Handle input events
		logKeystrokesListeners(rl, currentPage);

		while (hasMoreLogs) {
			const { data } = await envApi.getEnvLogs({
				page: currentPage,
				take,
				repositoryId: repoInfo[REPO_ID_KEY],
				environment,
			});

			const logs: IKeyValueLog[] = data.data;
			hasMoreLogs = logs.length === take;

			for (const log of logs) {
				await logEnvHistory(
					{ oneline, take, logsShown, currentEnvVersion },
					log,
					rl,
				);
				logsShown++;
			}

			if (hasMoreLogs) currentPage++;
			else break;

			if (logsShown >= take) {
				await handleNextLogAction(rl);
			}
		}

		rl.close();
	} catch (error) {
		const { message = '' } = error as IMessage;

		logger.error(message);
	}
};

export default getLogs;
