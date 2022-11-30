// required plugins
import fs from 'fs'

export default class Utils {
    constructor(gulpPlugin) {
        Object.assign(this, gulpPlugin)
    }

    //app info
    appInfo = (done) => {
        const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
        console.log(`\n${packageInfo.title} v${packageInfo.version} running on Node.js ${process.version}\n`)
        if(process.argv.pop() == 'blockit') {
            console.log('  builder url:    http://localhost:3001')
            console.log('  preview url:    http://localhost:3000\n')
            console.log(`${this.logTime(new Date())} - Waiting for changes...`)
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
                console.log(`${this.logTime(new Date())} - ${partialIntro == 'The partial' ? `HTML compile a problem occurred: The partial ${partialMissing} could not be found` : `HTML compile a problem occurred: ${msg.error}`}`)
                break
            case task.buildCss.name:
                const cssErr = String(msg.error.formatted).split(' ').slice(1, -4).join(' ')
                console.log(`${this.logTime(new Date())} - CSS compile a problem occurred: ${cssErr}`)
                break
            case task.buildJs.name:
                console.log(`${this.logTime(new Date())} - JS compile a problem occurred: ${msg.error}`)
                break
            case task.buildStatic.name:
                console.log(`${this.logTime(new Date())} - Static assets deliver a problem occurred: ${msg.error}`)
                break
            case task.buildImg.name:
                console.log(`${this.logTime(new Date())} - Image optimization a problem occurred: ${msg.error}`)
                break
            case task.name:
                console.log(`${this.logTime(new Date())} - a problem occurred: ${msg.error}`)
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