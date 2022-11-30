// required plugins
import gulp from 'gulp'
import handler from 'gulp-task-err-handler'
import Compiler from './controllers/compiler.js'
import Server from './controllers/server.js'
import Utils from './controllers/utils.js'

// class and gulp init
const { src, dest, task, watch, series } = gulp
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