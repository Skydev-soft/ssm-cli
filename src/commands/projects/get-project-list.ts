import { logger } from '@/utils/logger';

const projectList = [
	{
		name: 'project1',
		description: 'Project 1',
	},
	{
		name: 'project2',
		description: 'Project 2',
	},
];

const getProjectList = (options: { list?: boolean }) => {
	if (options.list) {
		logger.info('Listing all projects:');
		console.table(projectList);
	} else {
		logger.info('Use the --list or -l option to see all projects.');
	}
};

export default getProjectList;
