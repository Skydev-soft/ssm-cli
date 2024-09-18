import { IRepoResponse } from '@/types/repo';
import axiosInstance from './axios-instance';

const repoApi = {
	getRepo: async (pathname: string): Promise<IRepoResponse> =>
		axiosInstance.get(`/repositories/${pathname}`),
};

export default repoApi;
