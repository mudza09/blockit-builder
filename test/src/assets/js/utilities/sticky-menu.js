/* sticky-menu.js | https://www.indonez.com | Indonez | MIT License */
class StickyMenu {
    constructor() {
        this.navbarName = 'navbar'            // navbar class name as sticky reference element
        this.paddingName = 'py-2'             // usually bootstrap padding class name, use to remove it in sticky mode
        this.hideOther = true                 // remove other navbar element
        this.showOnUp = true                  // true mean sticky only active when mouse sroll up
    }

    init() {
        if (document.querySelector(`.${this.navbarName}`) !== null) {
            // required variables
            this.navbarEl = document.querySelector(`.${this.navbarName}`)
            this.clonedNav = this.navbarEl.children[0].cloneNode(true)
            this.parentNav = this.navbarEl.parentElement
            this.stickyNav = document.createElement('nav')
            this.stickyNav.appendChild(this.clonedNav)

            // manipulate cloned navbar
            this.parentNav.insertBefore(this.stickyNav, this.navbarEl.nextSibling)
            this.stickyNav.classList.add('sticky-nav', 'navbar', 'navbar-expand-xl', 'navbar-light')
            this.stickyNav.children[0].classList.remove(this.paddingName)
            this.stickyNav.children[0].children[1].removeAttribute('id')
            this.stickyNav.children[0].children[3].remove()

            // hide optional nav element condition
            if(this.hideOther && this.stickyNav.querySelector('.navbar-nav').nextElementSibling !== null) {
                this.stickyNav.querySelector('.navbar-nav').nextElementSibling.remove()
            }

            // scroll event action
            let oldValue = 0
            let newValue = 0
            window.addEventListener('scroll', () => {
                if (this.showOnUp) {
                    newValue = window.pageYOffset
                    if (oldValue > newValue) this.stickyNav.classList.add('active')
                    if (oldValue < newValue) this.stickyNav.classList.remove('active')
                    if (window.scrollY < 350) this.stickyNav.classList.remove('active')
                    oldValue = newValue
                } else {
                    window.scrollY > 350 ? this.stickyNav.classList.add('active') : this.stickyNav.classList.remove('active')
                }
            })
        }
    }
}

new StickyMenu().init()