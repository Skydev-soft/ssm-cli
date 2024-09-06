import figlet from 'figlet';

export const renderTitle = () => {
	const text = figlet.textSync('My Node.js App 2222', {
		font: 'Small',
	});
	console.log(`\n${text}\n`);
};
