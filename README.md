# SSM

Skydev Secret Management CLI (ssm-cli) is a command-line interface tool for managing project environments and secrets.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)

<a name="installation"></a>

## Installation

You can install the CLI globally using npm:

```sh
npm install -g ssm-cli
```

## Usage

After installation, you can use the `ssm-cli` command in your terminal.

```sh
ssm-cli [command] [options]
```

## Commands

`login`
Login to the Skydev Secret Management system.

```sh
ssm-cli login
```

`init`
Initialize a repository by pathname.

```sh
ssm-cli init <pathname>
```

`pull`
Pull environment variables.

```sh
ssm-cli pull [option]
```

- `-d, --develop` Pull env Develop (default)
- `-p, --production` Pull env Production
- `-s, --stagding` Pull env Stagding
- `-c, --cicd` Pull env CICD

`push`
Push environment variables.

```sh
ssm-cli push [option]
```

- `-d, --develop` Push env Develop (default)
- `-p, --production` Push env Production
- `-s, --stagding` Push env Stagding
- `-c, --cicd` Push env CICD
