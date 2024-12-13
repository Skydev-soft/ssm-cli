import { CONFIG_FILES } from '@/constants/common';
import { loadUserConfig, logger } from '@/utils';

// Check if the private key has been changed
export const checkChangeConfigAccessToken = async () => {
	const config = loadUserConfig();
	const trackingData = loadUserConfig(CONFIG_FILES.TRACKING_DATA);

	if (
		config.privateKey &&
		trackingData.privateKey &&
		config.privateKey !== trackingData.privateKey
	) {
		logger.warn('Your private key has been changed. Please re-login');
		process.exit(1);
	}
};

// Wrapping the action with middleware
export const AuthMiddleware = (action: (...args: any) => any) => {
	return async (...args: any) => {
		await checkChangeConfigAccessToken();
		await action(...args);
	};
};
