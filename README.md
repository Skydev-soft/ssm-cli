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

# Push environment variables (environment is develop)
ssm-cli push -d

# Pull environment variables (environment is develop)
ssm-cli pull -d
```

## Commands

`login`
Login to the Skydev Secret Management system.

```sh
ssm-cli login
```

`sync`
Sync repository from Gitlab to SSM Registry.

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

## Contributors

<<<<<<< HEAD

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/TriThuc2321">
        <img src="https://github.com/TriThuc2321.png" width="50px;" style="border-radius: 50%;" alt="TriThuc2321"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/nxquan">
        <img src="https://github.com/nxquan.png" width="50px;" style="border-radius: 50%;" alt="nxquan"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/PhamDat328">
        <img src="https://github.com/PhamDat328.png" width="50px;" style="border-radius: 50%;" alt="TriThuc2321"/>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ntlong1801">
        <img src="https://github.com/ntlong1801.png" width="50px;" style="border-radius: 50%;" alt="TriThuc2321"/>
      </a>
    </td>
  </tr>
</table>
=======
- [@TriThuc2321](https://github.com/TriThuc2321)
- [@nxquan](https://github.com/nxquan)
- [@ntlong1801](https://github.com/ntlong1801)
>>>>>>> 57a917cf463b75083930507f3a3dd8a8cf90315c
