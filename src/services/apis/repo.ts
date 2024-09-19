import { IRepoResponse } from '@/types/repo';
import axiosInstance from './axios-instance';

const repoApi = {
	getRepo: async (pathname: string): Promise<IRepoResponse> =>
		axiosInstance.get(`/repositories/${pathname}`),
	// Gitlab APIs
	syncRepo: (namespace: string, path: string) =>
		axiosInstance.post(`/gitlab/repositories/sync-one`, { namespace, path }),
};

export default repoApi;
