import figlet from 'figlet';
import { logger } from './logger';

export const renderTitle = () => {
	const text = figlet.textSync('SSM CLI', {
		font: 'Small',
	});
	logger.info(`\n${text}\n`);
};
