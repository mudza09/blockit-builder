// required plugins
import fs from 'fs'
import clc from 'cli-color'
import del from 'del'
import panini from 'panini'
import rename from 'gulp-rename'
import beautify from 'gulp-jsbeautifier'
import minify from 'gulp-minifier'
import merge from 'merge-stream'
import newer from 'gulp-newer'
import concat from 'gulp-concat'
import babel from 'gulp-babel'
import postcss from 'gulp-postcss'
import purgecss from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'
import shorthand from 'postcss-merge-longhand'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import Utils from './utils.mjs'

export default class Compiler {
    constructor(gulpPlugin) {
        Object.assign(this, gulpPlugin)
        this.utils = new Utils()
    }

    /*
    Theme compiler section
    using for compile HTML template using panini
    */

    // panini reload cache
    reloadPanini = async () => {
        await panini.refresh()
    }

    // clean dist folder
    buildClean = () => {
        return del(['../../dist/**', '../../dist/img/*', '!../../dist/blog', '!../../dist/blog/data', '!../../dist/img', '!../../dist/img/user'], {force: true})
    }

    // html compile task
    buildHtml = () => {
        const minifyHtml = JSON.parse(fs.readFileSync('../../src/data/setting.json', 'utf-8')).optimization.minifyAssets.html
        this.reloadPanini()

        return this.src('../../src/pages/**/*.hbs')
        .pipe(panini({
            root: '../../src/pages',
            layouts: '../../src/layouts',
            partials: '../../src/partials',
            data: '../../src/data',
            helpers: './helpers'
        }))
        .pipe(rename(path => path.extname = '.html'))
        .pipe(beautify({
            html: {
                file_types: ['.html'],
                max_preserve_newlines: 0,
                preserve_newlines: true,
            }
        }))
        .pipe(minifyHtml ? minify({minify: true, minifyHTML: {collapseWhitespace: true, removeComments: true}}) : minify({minify: false}))
        .pipe(this.dest('../../dist'))
        .on('end', () => console.log(`${this.utils.logTime(new Date())} - HTML compiled ${clc.green('successfully.')}`))
    }

    // css compile task
    buildCss = () => {
        const sass = gulpSass(dartSass)

        return this.src('../../src/assets/scss/main.scss')
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(beautify({css: {file_types: ['.css']}}))
        .pipe(postcss([autoprefixer(), shorthand()]))
        .pipe(this.dest('../../dist/css'))
        .on('end', () => console.log(`${this.utils.logTime(new Date())} - CSS compiled ${clc.green('successfully.')}`))
    }

    // js compile task
    buildJs = () => {
        return merge(
            // config-theme.js
            this.src('../../src/assets/js/*.js')
            .pipe(beautify({js: {file_types: ['.js']}}))
            .pipe(this.dest('../../dist/js')),

            // utilities.min.js
            this.src('../../src/assets/js/utilities/*.js')
            .pipe(newer('../../dist/js/vendors/utilities.min.js'))
            .pipe(babel({
                presets: [['@babel/preset-env', {
                    'targets': '> 0.25%, not dead',
                    'exclude': ['babel-plugin-transform-async-to-generator', 'babel-plugin-transform-regenerator']
                }]]
            }))
            .pipe(concat('utilities.min.js', {newLine: '\r\n\r\n'}))
            .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
            .pipe(this.dest('../../dist/js')),

            // js vendors
            this.src('../../src/assets/js/vendors/*.js')
            .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
            .pipe(this.dest('../../dist/js/vendors'))
            .on('end', () => console.log(`${this.utils.logTime(new Date())} - JS compiled ${clc.green('successfully.')}`))
        )
    }

    // image optimization task
    buildImg = () => {
        return this.src('../../src/assets/img/**/*')
        .pipe(newer('../../dist/img'))
        .pipe(imagemin([
            gifsicle({interlaced: true}),
            mozjpeg({quality: 80, progressive: true}),
            optipng({optimizationLevel: 5}),
            svgo({
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: true
                    },
                    {
                        name: 'cleanupIDs',
                        active: false
                    }
                ]
            })
        ], {
            verbose: false,
            silent: true
        }))
        .pipe(this.dest('../../dist/img'))
        .on('end', () => console.log(`${this.utils.logTime(new Date())} - Images optimized ${clc.green('successfully.')}`))
    }

    // static assets task
    buildStatic = () => {
        return merge(
            // webfonts
            this.src('../../src/assets/fonts/*')
            .pipe(this.dest('../../dist/fonts')),

            // fontAwesome icons
            this.src([
                '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf',
                '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2',
                '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
                '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'
            ])
            .pipe(this.dest('../../dist/fonts')),

            // favicon
            this.src('../../src/assets/favicon/favicon.ico')
            .pipe(this.dest('../../dist/img')),

            // apple touch icon
            this.src('../../src/assets/favicon/apple-touch-icon.png')
            .pipe(this.dest('../../dist/img')),

            // sendmail.php
            this.src('../../src/assets/php/sendmail.php')
            .pipe(this.dest('../../dist')),

            // bootstrap.bundle.min.js
            this.src('../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
            .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
            .pipe(rename('bootstrap.min.js'))
            .pipe(this.dest('../../dist/js/vendors')),

            // isotope.js
            this.src('../../node_modules/isotope-layout/dist/isotope.pkgd.min.js')
            .pipe(rename('isotope.min.js'))
            .pipe(this.dest('../../dist/js/vendors')),

            // bigger-picture.js
            this.src('../../node_modules/bigger-picture/dist/bigger-picture.min.js')
            .pipe(this.dest('../../dist/js/vendors'))
            .on('end', () => console.log(`${this.utils.logTime(new Date())} - Static assets delivered ${clc.green('successfully.')}`))
        )
    }

    /*
    Minifying compiler section
    using for minifying output file in "dist" folder
    */

    // Minify for CSS files
    minifyCss = () => {
        return this.src('../../dist/css/*.css')
        .pipe(postcss([
            purgecss({
                content: ['../../dist/*.html', '../../dist/js/**/*.js'],
                safelist: {standard: [/@s$/, /@m$/]}
            })
        ]))
        .pipe(minify({minify: true, minifyCSS: true}))
        .pipe(this.dest('../../dist/css'))
    }

    // Minify for Js files
    minifyJs = () => {
        return this.src('../../src/assets/js/*.js')
        .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
        .pipe(this.dest('../../dist/js'))
    }

    /*
    Wacth section
    using for development mode to check if there any changes
    */
    blockitWatch = () => {
        this.watch('../../src/assets/scss/**/*.scss', this.series(this.buildCss))
        this.watch('../../src/assets/js/**/*.js', this.series(this.buildJs))
        this.watch('../../src/assets/img/**/*', this.series(this.buildImg))
        this. watch(['../../src/**/*.hbs', '../../src/data/**/*.json'], this.series(this.buildHtml))
        this.watch(['../../src/hooks/blog/search-post.hbs', '../../src/hooks/blog/search-result.hbs'], this.series(this.utils.hookSearch))
        this.watch('../../src/hooks/sections/previews/*', this.series(this.utils.hookSectionsPreview))
    }
}