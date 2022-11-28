// required plugins
import fs from 'fs'
import { JSDOM }  from 'jsdom'

// read, dom manipulation and write setting social media
const socialMedia = () => {
    const socialData = JSON.parse(fs.readFileSync('../../src/data/component.json', 'utf8')).socialMedia
    const socialEl = socialData.filter(each => Object.values(each)[0].length !== 0).map(each => {
        switch(Object.keys(each)[0]) {
            case 'facebook': return `\t<div><a href="${Object.values(each)[0]}" class="color-facebook text-decoration-none"><i class="fab fa-facebook-square"></i> Facebook</a></div>`
            case 'twitter': return `\t<div><a href="${Object.values(each)[0]}" class="color-twitter text-decoration-none"><i class="fab fa-twitter"></i> Twitter</a></div>`
            case 'instagram': return `\t<div><a href="${Object.values(each)[0]}" class="color-instagram text-decoration-none"><i class="fab fa-instagram"></i> Instagram</a></div>`
            case 'linkedin': return `\t<div><a href="${Object.values(each)[0]}" class="color-linkedin text-decoration-none"><i class="fab fa-linkedin"></i> Linkedin</a></div>`
            case 'behance': return `\t<div><a href="${Object.values(each)[0]}" class="color-behance text-decoration-none"><i class="fab fa-behance"></i> Behance</a></div>`
            case 'whatsapp': return `\t<div><a href="${Object.values(each)[0]}" class="color-whatsapp text-decoration-none"><i class="fab fa-whatsapp"></i> Whatsapp</a></div>`
            case 'telegram': return `\t<div><a href="${Object.values(each)[0]}" class="color-telegram text-decoration-none"><i class="fab fa-telegram-plane"></i> Telegram</a></div>`
            case 'youtube': return `\t<div><a href="${Object.values(each)[0]}" class="color-youtube text-decoration-none"><i class="fab fa-youtube"></i> Youtube</a></div>`
        }
    }).join('\n')

    // file that contains element of social media tag
    fs.readFile('../../src/partials/components/component-social-media.hbs', 'utf8', (err, file) => {
        const headerComment = file.split('\n')[0]
        const htmlBody = new JSDOM(file)

        const socialMediaEl = htmlBody.window.document.querySelector('.social-media-list') !== null ? htmlBody.window.document.querySelector('.social-media-list') : false

        // social media jsdom
        if(socialMediaEl) {
            socialMediaEl.innerHTML = `\n${socialEl}\n`
        }

        const result = headerComment.concat('\n', htmlBody.window.document.documentElement.childNodes[1].innerHTML)
    
        fs.writeFileSync('../../src/partials/components/component-social-media.hbs', result)
    })
}

export default socialMedia;