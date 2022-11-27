// required plugins
import fs from 'fs'
import clc from 'cli-color'

export default class Utils {
    constructor(gulpPlugin) {
        Object.assign(this, gulpPlugin)
    }

    //app info
    appInfo = (done) => {
        const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
        console.log(`\n${packageInfo.title} v${packageInfo.version} running on Node.js ${process.version}\n`)
        if(process.argv.pop() == 'blockit') {
            console.log(`  builder url:    ${clc.magenta('http://localhost:3001')}`)
            console.log(`  preview url:    ${clc.magenta('http://localhost:3000')}\n`)
            console.log(`${this.logTime(new Date())} - Waiting for ${clc.cyan('changes...')}`)
        }
        done()
    }

    // log time function
    logTime = (time) => {
        return `[${new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24' }).format(time)}]`
    }

    // error handler
    errHandler = (msg, task) => {
        switch(msg.name) {
            case task.buildHtml.name:
                const partialIntro = String(msg.error).split(' ').slice(5, -5).join(' ')
                const partialMissing = String(msg.error).split(' ').slice(5)[2]
                console.log(`${this.logTime(new Date())} - ${partialIntro == 'The partial' ? `HTML compile ${clc.red('an error occurred:')} The partial ${clc.yellow(`"${partialMissing}"`)} could not be found` : `HTML compile ${clc.red('an error occurred:')} ${msg.error}`}`)
                break
            case task.buildCss.name:
                const cssErr = String(msg.error.formatted).split(' ').slice(1, -4).join(' ')
                console.log(`${this.logTime(new Date())} - CSS compile ${clc.red('an error occurred:')} ${cssErr}`)
                break
            case task.buildJs.name:
                console.log(`${this.logTime(new Date())} - JS compile ${clc.red('an error occurred:')} ${msg.error}`)
                break
            case task.buildStatic.name:
                console.log(`${this.logTime(new Date())} - Static assets deliver ${clc.red('an error occurred:')} ${msg.error}`)
                break
            case task.buildImg.name:
                console.log(`${this.logTime(new Date())} - Image optimization ${clc.red('an error occurred:')} ${msg.error}`)
                break
            case task.name:
                console.log(`${this.logTime(new Date())} - ${clc.red('An error occurred:')} ${msg.error}`)
                break
        }
    }

    // hook search condition
    hookSearch = (done) => {
        if(fs.existsSync('../../src/hooks/blog/search-post.hbs') && fs.existsSync('../../src/hooks/blog/search-result.hbs')) {
            // if custom hooks is available
            hookSearchWrite('../../src/hooks/blog/search-post.hbs', '../../src/hooks/blog/search-result.hbs')
            done()
        } else {
            // if custom hooks is not available
            hookSearchWrite('hooks/blog/search-post.hbs', 'hooks/blog/search-result.hbs')
            done()
        }
    }

    // hook search process
    hookSearchWrite = (pathPost, pathResult) => {
        const postFormat = fs.readFileSync(pathPost, 'utf8')
        const resultFormat = fs.readFileSync(pathResult, 'utf8')
        
        fs.readFile('../../src/assets/js/utilities/blog.js', 'utf8', (err, file) => {
            const rawResultFormat = /(?<=notFoundDiv.innerHTML\s=\s\`)([^`]*)(?=\`)/
            const rawPostFormat = /(?<=return\s\`)([^`]*)(?=\`)/g

            const processedResultFormat = file.replace(rawResultFormat, resultFormat)
            const processedPostFormat = processedResultFormat.replace(rawPostFormat, postFormat)

            fs.writeFileSync('../../src/assets/js/utilities/blog.js', processedPostFormat)
        })
    }

    // hook preview process for add on sections preview
    hookSectionsPreview = () => {
        return this.src('../../src/hooks/sections/previews/*')
        .pipe(this.dest('./views/assets/img/sections'))
    }
}