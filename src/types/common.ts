export type CreateEnvFile = {
	data:
		| {
				[key: string]: string;
		  }
		| string;
	fileName: string;
};

export interface IUpdateLocalEnvVersion {
	version: string;
	environment: string;
	fileName?: string;
}

export interface IMessage {
	message: string;
	statusCode: number;
}

export interface ITimestamp {
	createdAt: string;
	createdById: string;
	updatedAt: string;
	updatedById: string | null;
	deletedAt: string | null;
	deletedById: string | null;
}

export enum EnvironmentEnum {
	DEVELOPMENT = 'Development',
	STAGING = 'Staging',
	PRODUCTION = 'Production',
	CI_CD = 'CI/CD',
}
