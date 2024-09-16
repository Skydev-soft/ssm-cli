export type CreateEnvFile = {
	data: {
		[key: string]: string;
	};
	fileName: string;
};

export interface IMessage {
	message: string;
	statusCode: number;
}
