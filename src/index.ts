#! /usr/bin/env node
import {
	getCurrentVersion,
	getLogs,
	initRepo,
	login,
	pullEnv,
	pushEnv,
	revertEnv,
	syncRepo,
} from '@/commands';
import { packageJSON } from '@/utils/package-json.js';
import { renderTitle } from '@/utils/renderTitle.js';
import { Command } from 'commander';
import { config } from 'dotenv';
import { getConfig } from './commands/config/get-config';
import { setupConfig } from './commands/config/setup-config';
import { AuthMiddleware } from './middlewares';

config();

(async () => {
	renderTitle();

	const program = new Command();

	program
		.version(packageJSON.version, '-v, --version', 'display the version number')
		.description('An CLI for managing projects')
		.name('ssm-cli');

	program.command('login').description('Login to the SSM').action(login);

	const config = program.command('config').description('Configurations');

	config
		.command('set')
		.option('-pk, --private-key <key>', 'Set encryption key')
		.description('Set up config for SSM')
		.action(setupConfig);

	config.command('get').description('Get all configurations').action(getConfig);

	program
		.command('sync')
		.description(
			'Synchronize the current repository (GIT) from Gitlab to SSM Registry',
		)
		.action(AuthMiddleware(syncRepo));

	program
		.command('pull')
		.description('Pull Env')
		.option('-d, --develop', 'Pull env develop (default)')
		.option('-p, --production', 'Pull env production')
		.option('-s, --staging', 'Pull env staging')
		.option('-c, --cicd', 'Pull env ci cd')
		.option('-f, --force', 'Force pull env')
		.action(AuthMiddleware(pullEnv));

	program
		.command('push')
		.description('Push Env')
		.requiredOption('-m, --message <message>', 'Commit message')
		.option('-d, --develop', 'Push env develop (default)')
		.option('-p, --production', 'Push env production')
		.option('-s, --staging', 'Push env staging')
		.option('-c, --cicd', 'Push env ci cd')
		.action(AuthMiddleware(pushEnv));

	program
		.command('init')
		.description('Initialize repository')
		.option('-n, --name <repo-name>', 'Repository pathname')
		.argument(
			'<root-folder>',
			'Root folder of the repository, must be in last position',
		)
		.option(
			'--sync',
			'Synchronize the current repository (GIT) from Gitlab to SSM Registry',
		)
		.action(AuthMiddleware(initRepo));

	program
		.command('log')
		.option('--oneline', 'Get brief logs')
		.option('-d, --develop', 'Head env develop (default)')
		.option('-p, --production', 'Head env production')
		.option('-s, --staging', 'Head env staging')
		.option('-c, --cicd', 'Head env ci cd')
		.description('Get logs')
		.action(AuthMiddleware(getLogs));

	program
		.command('revert')
		.argument('<version>', 'Version of the env')
		.option('-d, --develop', 'Head env develop (default)')
		.option('-p, --production', 'Head env production')
		.option('-s, --staging', 'Head env staging')
		.option('-c, --cicd', 'Head env ci cd')
		.description('Revert Env to a specific version of environment')
		.action(AuthMiddleware(revertEnv));

	program
		.command('head')
		.option('-d, --develop', 'Head env develop (default)')
		.option('-p, --production', 'Head env production')
		.option('-s, --staging', 'Head env staging')
		.option('-c, --cicd', 'Head env ci cd')
		.description('Get the current version of ENV')
		.action(AuthMiddleware(getCurrentVersion));

	program.parse(process.argv);
})();
