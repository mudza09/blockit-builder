export default function trimTitle(string) {
	const cut = string.indexOf(' ', 70);
	if (cut === -1) {
		return string;
	}

	return string.substring(0, cut) + ' ...';
}
