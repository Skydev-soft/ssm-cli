import { handleNextLogAction } from '@/commands/envs/get-logs';
import { IGetLogsOptionProps, IKeyValueLog } from '@/types/env';
import chalk from 'chalk';
import { Interface } from 'readline';
import readline from 'readline';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

export const logger = {
	info: (...text: unknown[]) => {
		console.log(chalk.cyan(...text));
	},
	warn: (...text: unknown[]) => {
		console.log(chalk.yellow(...text));
	},
	succeed: (...text: unknown[]) => {
		console.log(chalk.green(...text));
	},
	error: (...text: unknown[]) => {
		console.log(chalk.red(...text));
	},
	log: (...text: unknown[]) => {
		console.log(...text);
	},
};

export const getHeadVersion = (
	currentVersion: string | undefined,
	version: string,
) => {
	return version === currentVersion ? ` (${chalk.cyan('HEAD')})` : '';
};

export const logEnvHistory = async (
	props: Pick<IGetLogsOptionProps, 'oneline'> & {
		take: number;
		logsShown: number;
		currentEnvVersion: string | undefined;
	},
	data: IKeyValueLog,
	rl: Interface,
) => {
	const { oneline, take, logsShown, currentEnvVersion } = props;
	const { version, timestamp, commitMessage } = data;

	const hasAnimation = logsShown >= take;

	if (oneline) {
		await animateLog(
			`${version} ${commitMessage}`,
			chalk.yellow,
			hasAnimation,
			getHeadVersion(currentEnvVersion, version),
		);
	} else {
		await animateLog(
			`commit ${version}`,
			chalk.yellow,
			hasAnimation,
			getHeadVersion(currentEnvVersion, version),
		);
		await animateLog(
			`\tAuthor: ${timestamp.createdBy.username} <${timestamp.createdBy.email}>`,
			chalk.white,
			hasAnimation,
		);
		await animateLog(
			`\tDate: ${new Date(timestamp.createdAt)}`,
			chalk.white,
			hasAnimation,
		);
		await animateLog(`\tMessage: ${commitMessage}`, chalk.white, hasAnimation);
	}

	if (logsShown >= take) {
		await handleNextLogAction(rl);
	}
};

export const clearLine = () => {
	readline.cursorTo(process.stdout, 0);
	readline.clearLine(process.stdout, 0);
};

export const clearPreviousLine = () => {
	// Move cursor up one line
	process.stdout.write('\x1b[F');

	// Clear the line
	clearLine();
};

const animateLog = async (
	text: string,
	color = chalk.white,
	hasAnimation = false,
	postfix = '',
) => {
	for (const char of text) {
		process.stdout.write(color(char));
		if (hasAnimation) await sleep(8);
	}
	process.stdout.write(postfix);

	process.stdout.write('\n');
};
