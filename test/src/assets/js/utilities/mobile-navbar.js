/* mobile-navbar.js | https://www.indonez.com | Indonez | MIT License */
class MobileNavbar {
    constructor(settings) {
        this.addonButtons = settings.addonButtons
        this.buttons = settings.buttons

        // required variables
        this.navbar = document.querySelector('.navbar-nav') !== null ? document.querySelector('.navbar-nav') : false
        this.cloneNavbar = this.navbar !== false ? this.navbar.cloneNode(true) : false
        this.optionalNav = document.querySelector('.optional-link')
    }

    async init() {
        if (this.navbar !== false) {
            await this.createMobileNav(this.cloneNavbar)
            this.createButtonListener()
        }
    }

    createMobileNav(navbar) {
        // cloned navbar manipulation
        Array.from(navbar.children).forEach(each => {
            each.querySelector('a').classList.add('px-0')
            if(each.classList.contains('dropdown')) {
                each.classList.remove('dropdown')
                each.children[0].classList.remove('dropdown-toggle')
                each.children[0].classList.add('accordion-button', 'collapsed')
                each.children[0].removeAttribute('id')
                each.children[0].setAttribute('data-bs-toggle', 'collapse')
                each.children[0].setAttribute('data-bs-target', `#${each.children[0].textContent.toLowerCase().replace(/\s/g, '-')}`)

                each.children[1].classList.remove('dropdown-menu', 'dropdown-large-menu', 'd-flex')
                each.children[1].classList.add('list-unstyled', 'accordion-collapse', 'collapse')
                each.children[1].removeAttribute('aria-labelledby')
                each.children[1].setAttribute('id', each.children[0].textContent.toLowerCase().replace(/\s/g, '-'))
                each.children[1].setAttribute('data-bs-parent', '#mobile-navbar')

                Array.from(each.children[1].children).forEach(li => {
                    // dropdown child text manipulation
                    if(!li.children[0].classList.contains('dropdown-item')) {
                        const parentChildren = (li.parentElement)
                        const childrenCloned = li.children[0].querySelector('.list-unstyled').cloneNode(true)

                        Array.from(childrenCloned.children).forEach(li => {
                            li.children[0].classList.remove('dropdown-item')
                            li.children[0].classList.add('nav-link')
                        })

                        childrenCloned.classList.add('accordion-collapse', 'collapse')
                        childrenCloned.setAttribute('id', li.closest('.nav-item').querySelector('a').textContent.toLowerCase().replace(/\s/g, '-'))
                        childrenCloned.setAttribute('data-bs-parent', '#mobile-navbar')

                        li.closest('.nav-item').appendChild(childrenCloned)
                        parentChildren.remove()
                    }
                    li.children[0].classList.remove('dropdown-item')
                    li.children[0].classList.add('nav-link')
                })
            }
        })

        // button open modal
        const btnOpen = document.createElement('button')
        btnOpen.classList.add('btn', 'btn-mobile-navbar', 'd-lg-none')
        btnOpen.setAttribute('type', 'button')
        btnOpen.setAttribute('data-bs-toggle', 'modal')
        btnOpen.setAttribute('data-bs-target', '#navbarModal')
        btnOpen.innerHTML = '<i class="fas fa-bars"></i>'

        // modal wrapper
        const modalWrapper = document.createElement('div')
        modalWrapper.classList.add('modal', 'fade')
        modalWrapper.setAttribute('id', 'navbarModal')
        modalWrapper.setAttribute('tabindex', '-1')
        modalWrapper.setAttribute('data-bs-backdrop', 'static')
        modalWrapper.setAttribute('aria-hidden', 'true')
        modalWrapper.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-transparent border-0">
                <div class="modal-body">
                    <ul id="mobile-navbar" class="nav flex-column mb-1">
                        ${navbar.innerHTML}
                    </ul>
                    ${this.createAddonBtn()}
                </div>
            </div>
        </div>`

        // check previous mobile button and remove if exist
        if(document.querySelector('.btn-mobile-navbar') !== null) {
            document.querySelector('.btn-mobile-navbar').remove()
        }

        // append offcanvas element into navbar
        this.navbar.closest('.container').appendChild(btnOpen)
        this.navbar.closest('.container').appendChild(modalWrapper)
    }

    createButtonListener() {
        const btnModal = document.querySelectorAll('.btn-mobile-navbar')

        btnModal.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = document.querySelector('.loaded')
                const sticky = document.querySelector('.sticky-nav')
                const toggle = parent.classList.toggle('show')

                if (toggle) {
                    btn.classList.add('show')
                    btn.classList.remove('d-lg-none')
                    btn.innerHTML = '<i class="fas fa-xmark"></i>'

                    sticky.children[0].classList.add('d-flex', 'justify-content-end')
                    sticky.setAttribute('style', 'background-color: transparent; backdrop-filter: blur(0px); box-shadow: none;')
                    sticky.querySelector('.navbar-brand').hidden = true
                } else {
                    btn.classList.remove('show')
                    btn.classList.add('d-lg-none')
                    btn.innerHTML = '<i class="fas fa-bars"></i>'

                    sticky.children[0].classList.remove('d-flex', 'justify-content-end')
                    sticky.removeAttribute('style')
                    sticky.querySelector('.navbar-brand').hidden = false
                }
            })
        })
    }

    createAddonBtn() {
        const optionalNav = this.optionalNav
        const methodUrl = this.addonBtnUrl
        const methodName = this.addonBtnName
        const methodIcon = this.addonBtnIcon

        let signinBtn = ''
        if (this.addonButtons && this.optionalNav !== null && this.optionalNav.children.length > 0) {
            this.buttons.forEach(function(e) {
                signinBtn += `<a href="${methodUrl(e, optionalNav)}" class="btn btn-${e.type} w-100 mt-1">${methodName(e, optionalNav)}${methodIcon(e)}</a>`
            })
        }
        return signinBtn
    }

    addonBtnUrl(data, element) {
        let urlValue
        data.url.length > 0 
            ? urlValue = data.url
            : urlValue = element.querySelector('a').href
        return urlValue
    }

    addonBtnName(data, element) {
        let nameValue
        data.name.length > 0 
            ? nameValue = data.name 
            : nameValue = element.querySelector('a').innerText
        return nameValue
    }

    addonBtnIcon(data) {
        let iconValue
        data.icon !== undefined && data.icon.length > 0 
            ? iconValue = `<i class="fas fa-${data.icon} ms-1"></i>` 
            : iconValue = ''
        return iconValue
    }
}

new MobileNavbar({
    addonButtons: true,                 // options to use addon buttons, set it "false" if you won't use addon buttons
    buttons: [
        {
            name: 'Sign in',            // button name
            url: '',                    // button url
            type: 'primary',            // button type (default, primary, secondary, danger, text)
            icon: 'right-to-bracket'    // button icon, you can use all icons from here : https://fontawesome.com/icons?d=gallery&s=solid&m=free
        },
    ]
}).init()