/* page-loader.js | https://www.indonez.com | Indonez | MIT License */
class PageLoader {
    constructor() {
        this.animation = true
        this.class = 'loaded'
    }

    init() {
        if(this.animation) {
            window.addEventListener('load', () => document.querySelector('body').classList.add(this.class))
        }
    }
}

new PageLoader().init()