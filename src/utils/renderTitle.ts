import figlet from 'figlet';

export const renderTitle = () => {
	const text = figlet.textSync('SSM CLI', {
		font: 'Small',
	});
	console.log(`\n${text}\n`);
};
