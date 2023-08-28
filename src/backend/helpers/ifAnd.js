export default function (obj1, obj2, options) {
	if (obj1 === false && obj2 === false) {
		return options.inverse(this);
	}

	if (obj1 === true && obj2 === false) {
		return options.fn(this);
	}

	if (obj1 === false && obj2 === true) {
		return options.fn(this);
	}

	return options.fn(this);
}
