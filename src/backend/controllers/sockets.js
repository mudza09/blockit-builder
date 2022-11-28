// blockit socket library class
module.exports = class Sockets {
    constructor(blockit) {
        this.blockit = blockit
    }

    dashboardSocket = socket => {
        // dashboard data
        socket.on('getDashboardData', () => this.blockit.createDashboardData())
    }
    
    pagesSocket = socket => {
        // pages data
        socket.on('getPagesData', () => this.blockit.createPagesData())
        // pages action data
        socket.on('getPagesActionData', () => this.blockit.createPagesActionData())
        // pages delete data
        socket.on('deletePageData', (nameFile, sections) => this.blockit.pagesDeletePage(nameFile, sections))
        // pages action save data
        socket.on('savePageActionData', (nameFile, blogStatus, data) => this.blockit.pagesSavePage(nameFile, blogStatus, data))
        // pages action read content section json
        socket.on('readSectionData', nameFile => this.blockit.readSectionData(nameFile))
        // pages action write content section json
        socket.on('saveSectionData', (sections, deletedSections) => this.blockit.createSectionData(sections, deletedSections))
    }

    navigationSocket = socket => {
        // navigation data
        socket.on('getNavigationData', () => this.blockit.createNavigationData())
        // save navigation data
        socket.on('saveNavigation', data => this.blockit.saveNavigationData(data))
    }

    postsSocket = socket => {
        // posts list
        socket.on('getPostsData', () => this.blockit.createPostsData())
        // delete post data
        socket.on('deletePostData', (nameFile, dataTag) => this.blockit.postsDeletePost(nameFile, dataTag))
        // post authors and categories data
        socket.on('getPostsActionData', nameFile => this.blockit.createPostsActionData(nameFile))
        // save post content data
        socket.on('savePostContent', (nameFile, dataPost, dataTag) => this.blockit.postsSaveContent(nameFile, dataPost, dataTag))        
        // editor post content data
        socket.on('getEditorData', nameFile => this.blockit.createEditorData(nameFile))
        // tag sources
        socket.on('triggerTagSources', () => this.blockit.postsTagSources())
    }

    componentsSocket = socket => {
        // read component.json
        socket.on('getComponentsData', data => this.blockit.createComponentsData())
        // save components data into json
        socket.on('saveComponents', data => this.blockit.saveComponentsData(data))
        // read slide-item data
        socket.on('getSlideItem', slideID => this.blockit.createSlideItem(slideID))
    }

    settingsSocket = socket => {
        // read setting.json
        socket.on('getSettingsData', data => {
            this.blockit.createSettingsData()
        })
        // read footer.json
        socket.on('getFooterData', data => {
            this.blockit.createFooterData()
        })
        // save footer.json
        socket.on('saveFooterEditor', data => {
            this.blockit.saveFooterEditor(data)
        })
        // save settings.json
        socket.on('saveSettingsData', (data, dataTag) => {
            this.blockit.saveSettingsData(data, dataTag)
        })
        
        // assets upload process
        socket.on('assetsUpload', (buffer, nameFile) => {
            this.blockit.assetsUpload(buffer, nameFile)
        })
        // assets delete process
        socket.on('assetsDelete', (nameFile) => {
            this.blockit.assetsDelete(nameFile)
        })
    }
}