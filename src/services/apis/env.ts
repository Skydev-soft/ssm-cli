import {
	ICreateEnv,
	ICreateEnvResponse,
	IGetLatestEnvParams,
	IUpdateEnv,
} from '@/types/env';
import {
	decryptDataWithAES,
	decryptDataWithRSA,
	encryptDataWithAES,
	encryptDataWithRSA,
	generateRSAKeyPair,
} from '@/utils/encrypt-decrypt';
import axiosInstance from './axios-instance';

const envApi = {
	getLatestEnv: async (params: IGetLatestEnvParams): Promise<string | null> => {
		const { publicKey, privateKey } = await generateRSAKeyPair();
		console.log({ publicKey });
		const response = await axiosInstance.get('key-values/latest', {
			params: { ...params, publicKey },
		});
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
		const { env, environment, repositoryId } = payload;

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
				commitMessage: 'Update env',
			};

			await axiosInstance.patch(`key-values/${data.id}`, payload);
		}
	},

	updateEnv: (id: string, data: IUpdateEnv): Promise<ICreateEnvResponse> =>
		axiosInstance.patch(`key-values/${id}`, data),
};

export default envApi;
