/* active-menu.js | https://www.indonez.com | Indonez | MIT License */
class ActiveMenu {
    constructor() {
        this.activeClass = 'active',                      // active class css name
        this.navbarClass = 'navbar-nav',                  // navbar class name in your HTML
        this.dropdownClass = 'dropdown-menu'              // dropdown class name in your HTML

        // required variables
        this.path = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
        this.navbar = document.querySelector(`.${this.navbarClass}`) !== null ? document.querySelector(`.${this.navbarClass}`).querySelectorAll('a') : false
        this.dropdown = document.querySelectorAll(`.${this.dropdownClass}`)
        this.blogPath = 'blog.html'
    }

    init() {
        if(document.querySelector(`.${this.navbarClass}`) !== null) {
            this.addActive(this.navbar)
            this.addActiveParent(this.dropdown)
            this.addActiveBlog(this.navbar, this.blogPath)
            this.addDropdownHover()
        }
    }

    addActive(navbarParam) {
        location.pathname[location.pathname.length - 1] == '/' ?
            navbarParam[0].classList.add(this.activeClass) :
                navbarParam.forEach(e => {
                    if(e.attributes[1].value.includes('../') && e.attributes[1].value.slice(3) == this.path) e.classList.add(this.activeClass)
                    if(e.attributes[1].value == this.path) e.classList.add(this.activeClass)
                })
    }

    addActiveParent(dropdownParam) {
        dropdownParam.forEach(e => {            
            if(e.querySelector(`.${this.activeClass}`) !== null) {
                e.previousElementSibling.classList.add(this.activeClass)
            }
        })
    }

    addActiveBlog(navbarPath, blogPath) {
        const urlParams = window.location.href.split( '/' )

        if(urlParams[urlParams.length - 2] == 'blog') {
            navbarPath.forEach(e => {
                if(e.pathname.split('/').at(-1) == blogPath) {
                    e.classList.add(this.activeClass)
                    if(e.closest('.dropdown-menu') !== null) {
                        e.closest('.dropdown-menu').previousElementSibling.classList.add(this.activeClass)
                    }
                }
            })
        }
    }

    // for bootstrap only
    async addDropdownHover() {
        const dropdown = await this.waitForSticky(`.${this.dropdownClass}`)

        dropdown.forEach(each => {
            each.previousElementSibling.onclick = () => this.hoverAction(each, 'click')
            each.previousElementSibling.onmouseover = () => this.hoverAction(each, 'enter')
            each.previousElementSibling.onmouseout = () => this.hoverAction(each, 'leave')
            each.onmouseover = () => this.hoverAction(each, 'enter')
            each.onmouseout = () => this.hoverAction(each, 'leave')
        })
    }

    hoverAction(elem, mouse) {
        if(mouse == 'click') {
            location.assign(elem.parentElement.children[0].getAttribute('href'))
        }
        if(mouse == 'enter') {
            elem.classList.add('show')
            elem.previousElementSibling.classList.add('show')
            elem.previousElementSibling.setAttribute('aria-expanded', true)
        }
        if(mouse == 'leave') {
            elem.classList.remove('show')
            elem.previousElementSibling.classList.remove('show')
            elem.previousElementSibling.setAttribute('aria-expanded', false)
        }
    }

    waitForSticky(selector) {
        return new Promise(resolve => {
            const observer = new MutationObserver(mutations => {
                if(document.querySelectorAll(selector)) {
                    resolve(document.querySelectorAll(selector))
                    observer.disconnect()
                }
            })
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            })
        })
    }
}

new ActiveMenu().init()