import { API_URL } from '@/constants/envs';
import { IMessage } from '@/types/common';
import { convertToCookieString, getAccessTokenFromFile } from '@/utils';
import type { AxiosError } from 'axios';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: `${API_URL}/api`,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response.data;
	},
	async (error: AxiosError) => {
		const errorData = error.response?.data as IMessage;

		return Promise.reject(errorData);
	},
);

axiosInstance.interceptors.request.use((config) => {
	const accessToken = getAccessTokenFromFile();
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

export const setCookies = (cookies: string) => {
	axiosInstance.defaults.headers.Cookie = convertToCookieString({
		access_token: cookies,
	});
};

export default axiosInstance;
