export default function pageFormat(obj) {
	if (!obj.blog) {
		return (`---
        layout: ${obj.pageLayout}
        title: ${obj.pageTitle}
        breadcrumb: ${obj.breadcrumb}
        asBlog: ${obj.blog}
        ---
        <main>
        ${obj.listSections.map(list => `\t{{> ${list} }}`).join('\n')}
        </main>`).replace(/  +/g, '');
	}

	return ({
		layout: obj.pageLayout,
		title: obj.pageTitle,
		breadcrumb: obj.breadcrumb,
	});
}
