// required plugins
import gulp from 'gulp'
import handler from 'gulp-task-err-handler'
import Compiler from './controllers/compiler.mjs'
import Server from './controllers/server.mjs'
import Utils from './controllers/utils.mjs'

const compiler = new Compiler(gulp)
const blockit = new Server(compiler)
const utils = new Utils(gulp)

const { task, series } = gulp

// gulp task
task('build', handler(series(utils.appInfo, compiler.buildClean, compiler.buildHtml, compiler.buildCss, compiler.buildJs, compiler.buildStatic, compiler.buildImg), msg => utils.errHandler(msg, compiler)))
task('blockit', handler(series(utils.appInfo, blockit.serverInit), msg => utils.errHandler(msg, blockit.serverInit)))
task('compileCss', compiler.buildCss)
task('minifyCss', compiler.minifyCss)
task('compileJs', compiler.buildJs)
task('minifyJs', compiler.minifyJs)