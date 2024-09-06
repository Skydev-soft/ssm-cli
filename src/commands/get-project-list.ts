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
		console.log('Listing all projects:');
		console.table(projectList);
	} else {
		console.log('Use the --list or -l option to see all projects.');
	}
};

export default getProjectList;
