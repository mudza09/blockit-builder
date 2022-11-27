/* bigger-picture-plugin.js | https://www.indonez.com | Indonez | MIT License */
class PicturePlugin {
    constructor() {
        this.galleryWrap = document.querySelectorAll('.bigger-picture')
    }

    init() {
        if(this.galleryWrap.length !== 0) {
            this.plugin = BiggerPicture({ target: document.body }) 

            this.galleryWrap.forEach(eachWrap => {
                const imageLinks = eachWrap.querySelectorAll('a')
                imageLinks.forEach(each => {
                    each.addEventListener('click', (event) => this.openPicture(event, this.plugin, imageLinks))
                })
            })
        }
    }

    openPicture(event, plugin, images) {
        event.preventDefault()
        plugin.open({
            items: images,
            el: event.currentTarget
        })
    }
}

new PicturePlugin().init()