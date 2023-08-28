// Required plugins
import fs from 'fs';

export default function (value, options) {
	if (fs.existsSync(`./src/data/blog/posts/${value}.json`)) {
		const postBlocks = JSON.parse(fs.readFileSync(`./src/data/blog/posts/${value}.json`, 'utf-8')).blocks;

		return postBlocks.map(item => options.fn(item)).join('');
	}

	return `<small><mark>ERROR</mark></small> &nbsp; <small>»</small> &nbsp; post with the title "${value}" does not exist!`;
}
