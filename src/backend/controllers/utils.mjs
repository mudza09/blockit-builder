// required plugins
import fs from 'fs'
import clc from 'cli-color'
import * as compiler from './compiler.mjs'
import runBlockit from './server.mjs'

export default class Utils {
    //app info
    appInfo = (done) => {
        const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
        console.log(`\n${packageInfo.title} v${packageInfo.version} running on ${clc.green(`Node.js ${process.version}`)}\n`)
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
    errHandler = (msg) => {
        switch(msg.name) {
            case compiler.buildHtml.name:
                const partialIntro = String(msg.error).split(' ').slice(5, -5).join(' ')
                const partialMissing = String(msg.error).split(' ').slice(5)[2]
                console.log(`${this.logTime(new Date())} - ${partialIntro == 'The partial' ? `HTML compile an ${clc.red('error occurred:')} The partial "${partialMissing}" could not be found` : `${msg.error}`}`)
                break
            case compiler.buildCss.name:
                const cssErr = String(msg.error.formatted).split(' ').slice(1, -4).join(' ')
                console.log(`${this.logTime(new Date())} - CSS compile an ${clc.red('error occurred:')} ${cssErr}`)
                break
            case compiler.buildJs.name:
                const jsErr = String(msg.error).split(' ').slice(1, -7).join(' ')
                console.log(`${this.logTime(new Date())} - JS compile an ${clc.red('error occurred:')} ${jsErr}`)
                break
            case compiler.buildStatic.name:
                const staticErr = String(msg.error).split(' ').slice(1, -7).join(' ')
                console.log(`${this.logTime(new Date())} - Static assets deliver an ${clc.red('error occurred:')} ${staticErr}`)
                break
            case compiler.buildImg.name:
                console.log(`${this.logTime(new Date())} - ${msg.error}`)
                break
            case runBlockit.name:
                console.log(`${this.logTime(new Date())} - ${msg.error}`)
                break
        }
    }
}