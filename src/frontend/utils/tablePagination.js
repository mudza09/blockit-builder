const slicePage = (data, page, rowsPerPage) => data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

const calcPage = (data, rowsPerPage) => {
	const range = [];
	const num = Math.ceil(data.length / rowsPerPage);
	for (let i = 1; i <= num; i++) {
		range.push(i);
	}

	return range;
};

const startPage = (pageSize, pageNr) => pageSize * pageNr;

const entryProcess = (total, pageSize, pageNr) => {
	const start = Math.max(
		startPage(pageSize, pageNr),
		0,
	);
	const end = Math.min(
		startPage(pageSize, pageNr + 1),
		total,
	);

	return `${start + 1} to ${end}`;
};

const entryPage = dataLength => Array.from({length: Math.ceil(dataLength / 10)}, (_, i) => entryProcess(dataLength, 10, i));

export {slicePage, calcPage, entryProcess, entryPage};
