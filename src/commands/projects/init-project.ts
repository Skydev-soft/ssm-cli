import { addGitignoreRules, createEnvFile } from '@/utils';
import { logger } from '@/utils/logger';

const initProject = (uuid: string) => {
	createEnvFile({
		data: {
			PROJECT_UUID: uuid,
		},
		fileName: '.env.vault',
	});

	logger.info('Project initialized');
	addGitignoreRules();
};

export default initProject;
