// gulp
import gulp from 'gulp'
import handler from 'gulp-task-err-handler'

// required plugins
import * as compiler from './controllers/compiler.mjs'
import Utils from './controllers/utils.mjs'
import runBlockit from './controllers/server.mjs'

const { task, series } = gulp
const utils = new Utils()

// gulp task
task('build', handler(series(utils.appInfo, compiler.buildClean, compiler.buildHtml, compiler.buildCss, compiler.buildJs, compiler.buildStatic, compiler.buildImg), msg => utils.errHandler(msg)))
task('blockit', handler(series(utils.appInfo, runBlockit), msg => utils.errHandler(msg)))
task('compileCss', compiler.buildCss)
task('minifyCss', compiler.minifyCss)
task('compileJs', compiler.buildJs)
task('minifyJs', compiler.minifyJs)