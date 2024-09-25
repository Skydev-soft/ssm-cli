# Skydev Secret Management

Skydev Secret Management CLI (ssm-cli) is a command-line interface tool for managing project environments and secrets.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Authors](#authors)

## Installation

You can install the CLI using npm for your project:

```sh
npm install ssm-cli
```

but we recommend you to install it globally:

```sh
npm install -g ssm-cli
```

## Prerequisites

- SSM system have linked to your Gitlab repository, so you need to have a Gitlab account and a project on Gitlab.
- You have installed and configured Git on your local machine.

In the future, we will support more Git providers such as Github, Bitbucket,...

## Usage

After installation, you can use the `ssm-cli` command in your terminal.

```sh
ssm-cli [command] [options]
```

#### Example

```sh
# Prerequisites: Your project have version controls (GIT) to a Gitlab repository

# Login to the Skydev Secret Management system
ssm-cli login

# Sync repository from Gitlab to SSM Registry
ssm-cli sync

# Initialize a repository by pathname (default is current repository)
ssm-cli init

# Short command: ssm-cli init --sync

# Push environment variables (default is develop)
ssm-cli push -m "commit message"

# Pull environment variables (default is develop)
ssm-cli pull
```

## Commands

`login`
Login to the Skydev Secret Management system.

```sh
ssm-cli login
```

`sync`
Synchronize repository from Gitlab to SSM Registry.

```sh
ssm-cli sync
```

`init`
Initialize a repository by pathname.

```sh
ssm-cli init [pathname] [option]
```

- `pathname` The pathname of the repository to sync. If not specified, the current repository (GIT) will be used.
- `--sync` Sync repository from Gitlab to SSM Registry

`pull`
Pull environment variables.

```sh
ssm-cli pull [option]
```

- `-f, --force` Force pull env

- `-d, --develop` Pull env Develop (default)
- `-p, --production` Pull env Production
- `-s, --stagding` Pull env Stagding
- `-c, --cicd` Pull env CICD

`push`
Push environment variables.

```sh
ssm-cli push -m "commit message" [option]
```

- `-d, --develop` Push env Develop (default)
- `-p, --production` Push env Production
- `-s, --stagding` Push env Stagding
- `-c, --cicd` Push env CICD

`head`
Show the current version of environment variables

```sh
ssm-cli head
```

`log`
Log the history of the changes of environment variables

```sh
ssm-cli log
```

- `--oneline` Show in one line

`revert`
Revert to any previous version of environment variables

```sh
ssm-cli revert <version>
```

## Contributors

<p>
    <tr>
      <td align="center" valign="top" width="0.33%"><a href="https://github.com/TriThuc2321"><img src="https://images.weserv.nl/?url=https://avatars.githubusercontent.com/u/71278156?v=4&h=50&w=50&fit=cover&mask=circle&maxage=3d" alt="TriThuc2321"/></td>
      <td align="center" valign="top" width="0.33%"><a href="https://github.com/nxquan"><img src="https://images.weserv.nl/?url=https://avatars.githubusercontent.com/u/99462521?v=4&h=50&w=50&fit=cover&mask=circle&maxage=3d" alt="nxquan"/></td>
      <td align="center" valign="top" width="0.33%"><a href="https://github.com/ntlong1801"><img src="https://images.weserv.nl/?url=https://avatars.githubusercontent.com/u/101699049?v=4&h=50&w=50&fit=cover&mask=circle&maxage=3d" alt="nxquan"/></td>
      <td align="center" valign="top" width="0.33%"><a href="https://github.com/PhamDat328"><img src="https://images.weserv.nl/?url=https://avatars.githubusercontent.com/u/92577783?v=4&h=50&w=50&fit=cover&mask=circle&maxage=3d" alt="nxquan"/></td>
    </tr>
</p>
