export default class Sockets {
	constructor(blockit) {
		this.blockit = blockit;
	}

	dashboardSocket = socket => {
		// Dashboard data
		socket.on('getDashboardData', () => this.blockit.createDashboardData());
	};

	pagesSocket = socket => {
		// Pages data
		socket.on('getPagesData', () => this.blockit.createPagesData());
		// Pages action data
		socket.on('getPagesActionData', () => this.blockit.createPagesActionData());
		// Pages delete data
		socket.on('deletePageData', (nameFile, sections) => this.blockit.pagesDeletePage(nameFile, sections));
		// Pages action save data
		socket.on('savePageActionData', options => this.blockit.pagesSavePage(options));
		// Pages action read content section json
		socket.on('readSectionData', nameFile => this.blockit.readSectionData(nameFile));
		socket.on('readSectionsEdit', sections => this.blockit.readSectionsEdit(sections));
		// Pages action write content section json
		socket.on('saveSectionData', (sections, deletedSections) => this.blockit.createSectionData(sections, deletedSections));
	};

	navigationSocket = socket => {
		// Navigation data
		socket.on('getNavigationData', () => this.blockit.createNavigationData());
		// Save navigation data
		socket.on('saveNavigation', data => this.blockit.saveNavigationData(data));
	};

	postsSocket = socket => {
		// Posts list
		socket.on('getPostsData', () => this.blockit.createPostsData());
		// Delete post data
		socket.on('deletePostData', (nameFile, dataTag) => this.blockit.postsDeletePost(nameFile, dataTag));
		// Post authors and categories data
		socket.on('getPostsActionData', nameFile => this.blockit.createPostsActionData(nameFile));
		// Save post content data
		socket.on('savePostContent', (nameFile, dataPost, dataTag) => this.blockit.postsSaveContent(nameFile, dataPost, dataTag));
		// Editor post content data
		socket.on('getEditorData', nameFile => this.blockit.createEditorData(nameFile));
		// Tag sources
		socket.on('triggerTagSources', () => this.blockit.postsTagSources());
	};

	componentsSocket = socket => {
		// Read component.json
		socket.on('getComponentsData', () => this.blockit.createComponentsData());
		// Save components data into json
		socket.on('saveComponents', data => this.blockit.saveComponentsData(data));
		// Read slide-item data
		socket.on('getSlideItem', slideID => this.blockit.createSlideItem(slideID));
		// Read component-header.hbs
		socket.on('getHeaderData', () => this.blockit.createHeaderData());
		// Save component-header.hbs
		socket.on('saveHeaderEditor', data => this.blockit.saveHeaderEditor(data));
		// Read component-footer.hbs
		socket.on('getFooterData', () => this.blockit.createFooterData());
		// Save component-footer.hbs
		socket.on('saveFooterEditor', data => this.blockit.saveFooterEditor(data));
	};

	settingsSocket = socket => {
		// Read setting.json
		socket.on('getSettingsData', () => this.blockit.createSettingsData());
		// Save settings.json
		socket.on('saveSettingsData', (data, dataTag) => this.blockit.saveSettingsData(data, dataTag));
		// Assets upload process
		socket.on('assetsUpload', (buffer, nameFile, typeFile) => this.blockit.assetsUpload(buffer, nameFile, typeFile));
		// Assets delete process
		socket.on('assetsDelete', nameFile => this.blockit.assetsDelete(nameFile));
	};
}
