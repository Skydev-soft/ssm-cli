import { IMessage } from '.';

export interface ICreateCLILoginSessionResponse extends IMessage {
	data: {
		id: string;
	};
}

export interface IVerifyCLILoginSessionResponse extends IMessage {
	data: {
		accessToken: string;
	};
}
