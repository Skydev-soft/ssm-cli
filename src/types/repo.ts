import { IMessage, ITimestamp } from './common';

export interface IRepo {
	id: string;
	code: string;
	name: string;
	nameWithNamespace: string;
	pathWithNamespace: string;
	gitlabId: string;
	avatarUrl: string | null;
	description: string | null;
	timestamp: ITimestamp;
	httpUrlToRepo: string;
	sshUrlToRepo: string;
	webUrl: string;
	color: 'green' | 'blue' | 'red' | 'orange' | 'purple' | 'gray';
}
export interface IRepoResponse extends IMessage {
	data: IRepo;
}
