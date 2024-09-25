import {
	ICreateEnv,
	ICreateEnvResponse,
	IGetEnvByVersionParams,
	IGetLatestEnvParams,
	IGetLogsParams,
	IUpdateEnv,
} from '@/types/env';
import { updateLocalEnvVersion } from '@/utils';
import {
	decryptDataWithAES,
	decryptDataWithRSA,
	encryptDataWithAES,
	encryptDataWithRSA,
	generateRSAKeyPair,
} from '@/utils/encrypt-decrypt';
import axiosInstance from './axios-instance';

const envApi = {
	getLatestEnv: async (
		params: IGetLatestEnvParams,
	): Promise<{ decryptedData: string | null; version: string }> => {
		const { publicKey, privateKey } = await generateRSAKeyPair();
		const response = await axiosInstance.get('key-values/latest', {
			params: { ...params, publicKey },
		});
		const { data } = response;

		if (!data?.aesKey || !data?.encryptedKeyValues) {
			return { decryptedData: null, version: '' };
		}

		const aesKey = await decryptDataWithRSA(data?.aesKey, privateKey);
		const decryptedData = await decryptDataWithAES(
			data?.encryptedKeyValues,
			aesKey.slice(0, 32),
			aesKey.slice(33),
		);

		return { decryptedData, version: data.version };
	},
	getEnvByIdOrVersion: async (
		params: IGetEnvByVersionParams,
	): Promise<string | null> => {
		const { publicKey, privateKey } = await generateRSAKeyPair();
		const response = await axiosInstance.get(
			`key-values/${params.idOrVersion}`,
			{
				params: { ...params, publicKey },
			},
		);

		const { data } = response;

		if (!data?.aesKey || !data?.encryptedKeyValues) {
			return null;
		}

		const aesKey = await decryptDataWithRSA(data?.aesKey, privateKey);
		const decryptedData = await decryptDataWithAES(
			data?.encryptedKeyValues,
			aesKey.slice(0, 32),
			aesKey.slice(33),
		);

		return decryptedData;
	},
	createEnv: async (payload: ICreateEnv) => {
		const { env, environment, repositoryId, commitMessage } = payload;

		const { statusCode, data } = (await axiosInstance.post('key-values', {
			environment,
			repositoryId,
		})) as ICreateEnvResponse;

		if (statusCode === 200) {
			const { encryptedData, clientKey, iv } = await encryptDataWithAES(env);

			const aesKey = await encryptDataWithRSA(
				[iv, clientKey].join(),
				data.publicKey,
			);
			const payload = {
				keys: encryptedData,
				aesKey,
				commitMessage,
			};

			const { data: updatedEnvData } = await axiosInstance.patch(
				`key-values/${data.id}`,
				payload,
			);

			updateLocalEnvVersion({
				version: updatedEnvData.version as string,
			});
		}
	},
	updateEnv: (id: string, data: IUpdateEnv): Promise<ICreateEnvResponse> =>
		axiosInstance.patch(`key-values/${id}`, data),
	getEnvLogs: (params: IGetLogsParams) =>
		axiosInstance.get('/key-values/histories', {
			params,
		}),
	getTotalOfForwardVersions: (version: string) =>
		axiosInstance.get(`key-values/forwards`, {
			params: { version },
		}),
};

export default envApi;
