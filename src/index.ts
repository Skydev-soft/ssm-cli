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
		.command('pull')
		.description('Pull Env')
		.option('-d, --develop', 'Pull env develop (default)')
		.option('-p, --production', 'Pull env production')
		.option('-s, --staging', 'Pull env staging')
		.option('-c, --cicd', 'Pull env ci cd')
		.action(pullEnv);

	program
		.command('push')
		.description('Push Env')
		.option('-d, --develop', 'Push env develop (default)')
		.option('-p, --production', 'Push env production')
		.option('-s, --staging', 'Push env staging')
		.option('-c, --cicd', 'Push env ci cd')
		.action(pushEnv);

	program
		.command('init')
		.description('Initialize repository')
		.argument('<pathname>', 'Repository pathname')
		.action(initRepo),
		program.parse(process.argv);
})();
