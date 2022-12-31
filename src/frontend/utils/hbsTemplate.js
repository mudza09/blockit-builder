import bs from './bs';

export default function hbsTemplate() {
	const string = {};

	// Send trigger to host
	bs.socket.emit('triggerTagSources', 'empty');

	// Receive syntax source data
	bs.socket.once('tagSourcesData', async data => {
		const result = await data;
		Object.assign(string, result);
	});

	return string;
}
