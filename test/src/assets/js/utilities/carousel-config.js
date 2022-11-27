/* carousel-config.js | https://www.indonez.com | Indonez | MIT License */
class CarouselConfig {
    constructor(settings) {
        this.carouselClass = 'carousel'
        this.carouselItems = document.querySelectorAll('.carousel-item')
        this.settings = settings
    }

    init() {
        if(document.querySelector(`.${this.carouselClass}`) !== null) {
            const carouselWrap = document.querySelector(`.${this.carouselClass}`)
            const carouselId = carouselWrap.getAttribute('id')

            new bootstrap.Carousel(carouselWrap, {
                interval: this.settings.interval
            })

            // give class active for first carousel item
            this.carouselItems[0].classList.add('active')

            // fade transition option
            if(this.settings.fadeTransition) {
                carouselWrap.classList.add('carousel-fade')
            }

            // dark mode carousel navigation
            if(this.settings.darkMode) {
                carouselWrap.classList.add('carousel-dark')
            }

            // hide control condition
            if(this.settings.control.hide) {
                document.querySelector('.carousel-control-prev').setAttribute('hidden', '')
                document.querySelector('.carousel-control-next').setAttribute('hidden', '')
            }

            if(this.settings.control.onHover) {
                carouselWrap.classList.add('control-hover')
            }

            // hide indicators condition
            if(this.settings.indicators.hide) {
                document.querySelector('.carousel-indicators').setAttribute('hidden', '')
            }

            if(this.settings.indicators.onHover) {
                carouselWrap.classList.add('indicators-hover')
            }

            // auto generate indicator buttons
            if(document.querySelector('.carousel-indicators') !== null) {
                const indicatorsWrap = document.querySelector('.carousel-indicators')
                this.carouselItems.forEach((each, index) => {
                    const btnIndicator = document.createElement('button')
                    btnIndicator.setAttribute('type', 'button')
                    btnIndicator.setAttribute('aria-label', 'carousel-button')
                    btnIndicator.setAttribute('data-bs-target', `#${carouselId}`)
                    btnIndicator.setAttribute('data-bs-slide-to', index)
                    if(index == 0) {
                        btnIndicator.classList.add('active')
                        btnIndicator.setAttribute('aria-current', true)
                    }

                    indicatorsWrap.appendChild(btnIndicator)
                })
            }

            // media query condition
            if(window.matchMedia('(min-width: 992px)').matches) {
                this.carouselItems.forEach(each => {
                    each.style.minHeight = this.settings.height.desktop
                })
            } else if(window.matchMedia('(min-width: 768px)').matches) {
                this.carouselItems.forEach(each => {
                    each.style.minHeight = this.settings.height.tablet
                })
            } else {
                this.carouselItems.forEach(each => {
                    each.style.minHeight = this.settings.height.phone
                })
            }
        }
        
    }
}