export default function pageFormat(pageLayout, pageTitle, breadcrumb, blog, listSection) {
    if(!blog) {
        return (`---
        layout: ${pageLayout}
        title: ${pageTitle}
        breadcrumb: ${breadcrumb}
        as_blog: ${blog}
        ---

        <main>
        ${listSection.map(list => `\t{{> ${list} }}`).join('\n')}
        </main>`).replace(/  +/g, '')
    } else {
        return ({
            layout: pageLayout,
            title: pageTitle,
            breadcrumb: breadcrumb
        })
    }
}