import {
	ICreateEnv,
	ICreateEnvResponse,
	IGetLatestEnvParams,
	IKeyValue,
	IUpdateEnv,
} from '@/types/env';
import {
	decryptDataWithAES,
	decryptDataWithRSA,
	generateRSAKeyPair,
} from '@/utils/encrypt-decrypt';
import axiosInstance from './axios-instance';

const envApi = {
	getLatestEnv: async (
		params: IGetLatestEnvParams,
	): Promise<IKeyValue | null> => {
		const { publicKey, privateKey } = await generateRSAKeyPair();

		try {
			const response = await axiosInstance.get('pair-keys/latest', {
				params: { ...params, publicKey },
			});
			const { data } = response;

			if (!data?.aesKey || !data?.keys) {
				return null;
			}

			const aesKey = await decryptDataWithRSA(data?.aesKey, privateKey);
			const decryptedData = await decryptDataWithAES(
				data?.keys,
				aesKey.slice(0, 32),
				aesKey.slice(33),
			);

			const formattedData: IKeyValue = {
				...data,
				keys: decryptedData,
			};
			return formattedData;
		} catch (error) {
			return null;
		}
	},
	createEnv: (data: ICreateEnv): Promise<ICreateEnvResponse> =>
		axiosInstance.post('pair-keys', data),
	updateEnv: (id: string, data: IUpdateEnv): Promise<ICreateEnvResponse> =>
		axiosInstance.patch(`pair-keys/${id}`, data),
};

export default envApi;
