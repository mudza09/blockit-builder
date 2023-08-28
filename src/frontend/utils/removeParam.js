export default function removeParam(key, sourceURL) {
	let rtn = sourceURL.split('?')[0];
	let param;
	let paramsArr = [];
	const queryString = (sourceURL.indexOf('?') === -1) ? '' : sourceURL.split('?')[1];
	if (queryString !== '') {
		paramsArr = queryString.split('&');
		for (let i = paramsArr.length - 1; i >= 0; i -= 1) {
			param = paramsArr[i].split('=')[0];
			if (param === key) {
				paramsArr.splice(i, 1);
			}
		}

		if (paramsArr.length) {
			rtn = rtn + '?' + paramsArr.join('&');
		}
	}

	return rtn;
}
