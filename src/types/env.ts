import type { IMessage } from './common';
import type { IRepo } from './repo';

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

export interface IEnvDetail extends IKeyValue {
	name: string;
	url: string;
}

export interface IEnv extends IRepo {
	environment: string;
}

export interface IGetLatestEnvParams {
	pathWithNamespace: string;
	environment: string;
}

export interface ICreateEnv {
	repositoryId: string;
	environment: string;
	env: string;
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
