import type { IMessage } from './common';
import type { IRepo } from './repo';

export enum EnvironmentEnum {
	Production = 'production',
	Develop = 'develop',
	Staging = 'staging',
	CICD = 'cicd',
}
export interface IEnvironments {
	production?: boolean;
	develop?: boolean;
	staging?: boolean;
	cicd?: boolean;
}

export interface IEnvQuery {
	pathWithNamespace: string;
	environment: string;
}
export interface IEnvResponse extends IMessage {
	data: IKeyValue;
}

export interface IKeyValue {
	id: string;
	projectId: string;
	pathWithNamespace: string;
	version: string;
	privateKey: string;
	aesKey: string;
	keys: string;
	commitMessage: string;
}

export interface IKeyValueLog {
	id: string;
	repositoryId: string;
	version: string;
	environment: string;
	commitMessage: string;
	timestamp: {
		createdAt: string;
		createdBy: {
			id: string;
			username: string;
			email: string;
		};
	};
}

export interface IEnvDetail extends IKeyValue {
	name: string;
	url: string;
}

export interface IEnv extends IRepo {
	environment: string;
}

export type IGetLatestEnvParams = IEnvQuery;

export interface IGetEnvByVersionParams {
	idOrVersion: string;
	environment: string;
}

export interface ICreateEnv {
	repositoryId: string;
	environment: string;
	env: string;
	commitMessage: string;
}

export interface ICreateEnvResponse extends IMessage {
	data: {
		id: string;
		publicKey: string;
	};
}

export interface IUpdateEnv {
	keys: string;
	aesKey: string;
	commitMessage: string;
}

export interface PullPushEnvOptionProps extends IEnvironments {
	force?: boolean;
	message: string;
}

export interface IGetLogsParams extends IEnvQuery {
	take: number;
	page: number;
}

export interface IGetLogsOptionProps extends IEnvironments {
	oneline: boolean;
}

export interface IGetForwardVersions {
	version: string;
	environment: string;
}
