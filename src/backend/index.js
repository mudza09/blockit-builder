// required plugins
const { src, dest, task, watch, series } = require('gulp')
const handler = require('gulp-task-err-handler')
const Compiler = require('./controllers/compiler')
const Server = require('./controllers/server')
const Utils = require('./controllers/utils')

// class init
const compiler = new Compiler({ src, dest, task, watch, series })
const server = new Server(compiler)
const utils = new Utils({ src, dest, task, watch, series })

// gulp task
task('build', handler(series(utils.appInfo, compiler.buildClean, compiler.buildHtml, compiler.buildCss, compiler.buildJs, compiler.buildStatic, compiler.buildImg), msg => utils.errHandler(msg, compiler)))
task('blockit', handler(series(utils.appInfo, server.run), msg => utils.errHandler(msg, server.run)))
task('compileCss', compiler.buildCss)
task('minifyCss', compiler.minifyCss)
task('compileJs', compiler.buildJs)
task('minifyJs', compiler.minifyJs)