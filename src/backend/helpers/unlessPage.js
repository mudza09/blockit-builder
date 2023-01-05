export default function (pageName) {
	return function () {
		const params = Array.prototype.slice.call(arguments);
		const pages = params.slice(0, -1);
		const options = params[params.length - 1];

		for (const i in pages) {
			if (pages[i] === pageName) {
				return '';
			}
		}

		return options.fn(this);
	};
}
