import {
	ICreateCLILoginSessionResponse,
	IVerifyCLILoginSessionResponse,
} from '@/types/auth';
import axiosInstance from './axios-instance';

const authApi = {
	createCLILoginSession: (): Promise<ICreateCLILoginSessionResponse> => {
		console.log('axiosInstance', axiosInstance);

		return axiosInstance.post('/cli/login-session');
	},

	verify: (id: string): Promise<IVerifyCLILoginSessionResponse> =>
		axiosInstance.get(`/cli/login-session/${id}`),
};

export default authApi;
