#! /usr/bin/env node
import { initRepo, login, pullEnv, pushEnv } from '@/commands';
import { packageJSON } from '@/utils/package-json.js';
import { renderTitle } from '@/utils/renderTitle.js';
import { Command } from 'commander';

(async () => {
	renderTitle();

	const program = new Command();

	program
		.version(packageJSON.version, '-v, --version', 'display the version number')
		.description('An CLI for managing projects')
		.name('ssm-cli');

	program.command('login').description('Login to the SSM').action(login);

	program
		.command('env')
		.description('Env related commands')
		.addCommand(
			new Command().command('pull').description('Pull Env').action(pullEnv),
		)
		.addCommand(
			new Command().command('push').description('Push Env').action(pushEnv),
		);

	program
		.command('repo')
		.description('Repository related commands')
		.addCommand(
			new Command()
				.command('init')
				.description('Initialize repository')
				.argument('<pathname>', 'Repository pathname')
				.action(initRepo),
		);

	program.parse(process.argv);
})();
