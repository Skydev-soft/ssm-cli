import { Command } from 'commander';
import fs from 'fs';
import os from 'os';
import path from 'path';

interface AutocompleteOption {
	command: string;
	suggestions: string[];
	subcommand?: string;
}

export const autoComplete = (program: Command) => {
	const shell = process.env.SHELL!;

	const autocompleteSuggestions: AutocompleteOption[] = program.commands.map(
		(cmd) => ({
			command: 'ssm-cli',
			subcommand: cmd.name(),
			// @ts-ignore
			suggestions: cmd.options.map((opt) => opt.flags),
		}),
	);

	// Add some predefined suggestions
	autocompleteSuggestions.push({
		command: 'ssm-cli',
		suggestions: program.commands.map((cmd) => cmd.name()),
	});

	// Generate a shell function to handle completions
	const completionScript = `
# Autocomplete for ssm-cli
_ssm_cli_completion() {
  local cur prev words cword
  _init_completion || return

  # Global suggestions
  local global_suggestions="${
		autocompleteSuggestions.find((s) => !s.subcommand)?.suggestions.join(' ') ||
		''
	}"

  # Suggestions for specific subcommands
  declare -A subcommand_suggestions=(
    ${autocompleteSuggestions
			.filter((s) => s.subcommand)
			.map((s) => `["${s.subcommand}"]="${s.suggestions.join(' ')}"`)
			.join('\n    ')}
  )

  # First level completion (main commands)
  if [ $cword -eq 1 ]; then
    COMPREPLY=( $(compgen -W "$global_suggestions" -- "$cur") )
    return 0
  fi

  # Subcommand-specific completions
  local subcommand="\${words[1]}"
  local subcommand_opts="\${subcommand_suggestions[$subcommand]}"

  if [ -n "$subcommand_opts" ]; then
    COMPREPLY=( $(compgen -W "$subcommand_opts" -- "$cur") )
    return 0
  fi
}

complete -F _ssm_cli_completion ssm-cli
  `;

	const shellRcFile = shell.includes('zsh')
		? path.join(os.homedir(), '.zshrc')
		: shell.includes('bash')
		? path.join(os.homedir(), '.bashrc')
		: null;

	if (shellRcFile) {
		fs.appendFileSync(shellRcFile, completionScript, { flag: 'a' });
		console.log(`Tab completion installed! Please restart your terminal or run:
  source ${shellRcFile}`);
	} else {
		console.log(
			'Unsupported shell. Please add the following script to your shell config manually:',
		);
		console.log(completionScript);
	}
};
