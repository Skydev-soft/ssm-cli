import { API_URL } from '@/constants/common';
import { IMessage } from '@/types/common';
import { convertToCookieString, logger } from '@/utils';
import { loadToken } from '@/utils/os';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { config } from 'dotenv';

config();

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

axiosInstance.interceptors.request.use(async (config) => {
	try {
		if (config.url?.includes('cli/login-session')) {
			return config;
		}

		const accessToken = await loadToken();

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	} catch {
		logger.warn(
			'May be you change private key for decrypting access token. Please re-login',
		);
	}

	return config;
});

export const setCookies = (cookies: string) => {
	axiosInstance.defaults.headers.Cookie = convertToCookieString({
		access_token: cookies,
	});
};

export default axiosInstance;
