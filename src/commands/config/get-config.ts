import { loadUserConfig } from '@/utils/config';
import { logger } from '@/utils/logger';

export const getConfig = () => {
	const config = loadUserConfig();

	logger.info('Current Configurations:');
	console.log(config);

	return config;
};
