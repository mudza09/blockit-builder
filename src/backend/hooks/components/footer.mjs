// required plugins
import fs from 'fs'
import { JSDOM }  from 'jsdom'

// read, dom manipulation and write component footer
const configFooter = () => {
    const footerData = JSON.parse(fs.readFileSync('../../src/data/component.json', 'utf8')).footer
    fs.readFile('../../src/partials/components/component-footer.hbs', 'utf8', (err, file) => {
        const headerComment = file.split('\n')[0]
        const htmlBody = new JSDOM(file)

        const copyrightEl = htmlBody.window.document.querySelector('.copyright-text')
        const footerLogoEl = htmlBody.window.document.querySelector('.footer-logo')

        // footer logo jsdom
        if(footerData.siteLogo.enabled) {
            footerLogoEl.children[0].classList.add('d-lg-inline-block')
            footerLogoEl.children[0].classList.remove('d-none')
            footerLogoEl.children[0].setAttribute('src', `{{root}}${footerData.siteLogo.logo.src}`)
            footerLogoEl.children[0].setAttribute('width', footerData.siteLogo.logo.width)
            footerLogoEl.children[0].setAttribute('height', footerData.siteLogo.logo.height)
        } else {
            footerLogoEl.children[0].classList.add('d-none')
            footerLogoEl.children[0].classList.remove('d-lg-inline-block')
        }

        // footer copyright text jsdom
        copyrightEl.innerHTML = footerData.copyrightText

        const hbsFix = htmlBody.window.document.documentElement.childNodes[1].innerHTML.replace(/&gt;/g, '>')
        const result = headerComment.concat('\n', hbsFix)
        fs.writeFileSync('../../src/partials/components/component-footer.hbs', result)
    })
}

export default configFooter;