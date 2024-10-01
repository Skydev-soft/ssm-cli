import { IMessage } from '@/types/common';
import { convertToCookieString } from '@/utils';
import { loadToken } from '@/utils/os';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { config } from 'dotenv';

config();

const axiosInstance = axios.create({
	baseURL: `${process.env.API_URL}/api`,
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

axiosInstance.interceptors.request.use(async (config) => {
	if (config.url?.includes('cli/login-session')) {
		return config;
	}

	const accessToken = await loadToken();

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
