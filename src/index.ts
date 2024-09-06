#! /usr/bin/env node
import { getProjectList, login, pullEnv, pushEnv } from '@/commands';
import { packageJSON } from '@/utils/package-json.js';
import { renderTitle } from '@/utils/renderTitle.js';
import { Command } from 'commander';

(async () => {
	renderTitle();

	const program = new Command();

	program
		.version(packageJSON.version, '-v, --version', 'display the version number')
		.description('An CLI for managing projects')
		.name('ssm');

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
		.command('project')
		.description('Project related commands')
		.option('-l, --list', 'List all projects')
		.action(getProjectList);

	program.parse(process.argv);

	program.opts();
})();
