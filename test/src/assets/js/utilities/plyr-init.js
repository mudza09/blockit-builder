/* plyr-init.js | https://www.indonez.com | Indonez | MIT License */
class Plyr {
    constructor() {
        this.elementName = 'media'
    }

    init() {
        if(document.querySelector(`.${this.elementName}`) !== null) Plyr.setup('.media')
    }
}

new Plyr().init()