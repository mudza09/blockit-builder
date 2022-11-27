/* timeline.js | https://www.indonez.com | Indonez | MIT License */
class Timeline {
    constructor() {
        this.elementName = 'timeline-vertical'
    }

    init() {
        if(document.querySelector(`.${this.elementName}`) !== null) {
            const timelineArray = Array.from(document.querySelector(`.${this.elementName}`).children)
            const oddElement = timelineArray.filter(function (e, i) {
                return i % 2 == 1
            })

            oddElement.forEach(function (e) {
                e.children[0].classList.add('float-end')
            })
        }
    }
}

new Timeline().init()