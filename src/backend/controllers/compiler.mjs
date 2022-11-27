// gulp
import gulp from 'gulp'
const { src, dest, series, watch } = gulp

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

const utils = new Utils()

/*
Theme compiler section
using for compile HTML template using panini
*/

// panini reload cache
const reloadPanini = async () => {
    await panini.refresh()
}

// clean dist folder
const buildClean = () => {
    return del(['../../dist/**', '../../dist/img/*', '!../../dist/blog', '!../../dist/blog/data', '!../../dist/img', '!../../dist/img/user'], {force: true})
}

// html compile task
const buildHtml = () => {
    const minifyHtml = JSON.parse(fs.readFileSync('../../src/data/setting.json', 'utf-8')).optimization.minifyAssets.html
    reloadPanini()

    return src('../../src/pages/**/*.hbs')
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
    .pipe(dest('../../dist'))
    .on('end', () => console.log(`${utils.logTime(new Date())} - HTML compiled ${clc.green('successfully.')}`))
}

// css compile task
const buildCss = () => {
    const sass = gulpSass(dartSass)

    return src('../../src/assets/scss/main.scss')
    .pipe(sass())
    .pipe(rename('style.css'))
    .pipe(beautify({css: {file_types: ['.css']}}))
    .pipe(postcss([autoprefixer(), shorthand()]))
    .pipe(dest('../../dist/css'))
    .on('end', () => console.log(`${utils.logTime(new Date())} - CSS compiled ${clc.green('successfully.')}`))
}

// js compile task
const buildJs = () => {
    return merge(
        // config-theme.js
        src('../../src/assets/js/*.js')
        .pipe(beautify({js: {file_types: ['.js']}}))
        .pipe(dest('../../dist/js')),

        // utilities.min.js
        src('../../src/assets/js/utilities/*.js')
        .pipe(newer('../../dist/js/vendors/utilities.min.js'))
        .pipe(babel({
			presets: [['@babel/preset-env', {
                'targets': '> 0.25%, not dead',
                'exclude': ['babel-plugin-transform-async-to-generator', 'babel-plugin-transform-regenerator']
            }]]
		}))
        .pipe(concat('utilities.min.js', {newLine: '\r\n\r\n'}))
        .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
        .pipe(dest('../../dist/js')),

        // js vendors
        src('../../src/assets/js/vendors/*.js')
        .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
        .pipe(dest('../../dist/js/vendors'))
        .on('end', () => console.log(`${utils.logTime(new Date())} - JS compiled ${clc.green('successfully.')}`))
    )
}

// image optimization task
const buildImg = () => {
    return src('../../src/assets/img/**/*')
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
    .pipe(dest('../../dist/img'))
    .on('end', () => console.log(`${utils.logTime(new Date())} - Images optimized ${clc.green('successfully.')}`))
}

// static assets task
const buildStatic = () => {
    return merge(
        // webfonts
        src('../../src/assets/fonts/*')
        .pipe(dest('../../dist/fonts')),

        // fontAwesome icons
        src([
            '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf',
            '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2',
            '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf',
            '../../node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'
        ])
        .pipe(dest('../../dist/fonts')),

        // favicon
        src('../../src/assets/favicon/favicon.ico')
        .pipe(dest('../../dist/img')),

        // apple touch icon
        src('../../src/assets/favicon/apple-touch-icon.png')
        .pipe(dest('../../dist/img')),

        // sendmail.php
        src('../../src/assets/php/sendmail.php')
        .pipe(dest('../../dist')),

        // bootstrap.bundle.min.js
        src('../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
        .pipe(rename('bootstrap.min.js'))
        .pipe(dest('../../dist/js/vendors')),

        // isotope.js
        src('../../node_modules/isotope-layout/dist/isotope.pkgd.min.js')
        .pipe(rename('isotope.min.js'))
        .pipe(dest('../../dist/js/vendors')),

        // bigger-picture.js
        src('../../node_modules/bigger-picture/dist/bigger-picture.min.js')
        .pipe(dest('../../dist/js/vendors'))
        .on('end', () => console.log(`${utils.logTime(new Date())} - Static assets delivered ${clc.green('successfully.')}`))
    )
}

/*
Wacth section
using for development mode to check if there any changes
*/
const blockitWatch = () => {
    watch('../../src/assets/scss/**/*.scss', series(buildCss))
    watch('../../src/assets/js/**/*.js', series(buildJs))
    watch('../../src/assets/img/**/*', series(buildImg))
    watch(['../../src/**/*.hbs', '../../src/data/**/*.json'], series(buildHtml))
    watch(['../../src/hooks/blog/search-post.hbs', '../../src/hooks/blog/search-result.hbs'], series(hookSearch))
    watch('../../src/hooks/sections/previews/*', series(hookSectionsPreview))
}

/*
Hook search section
using for watch every changes in search hook and apply that changes
*/

// hook search condition
const hookSearch = (done) => {
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
const hookSearchWrite = (pathPost, pathResult) => {
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
const hookSectionsPreview = () => {
    return src('../../src/hooks/sections/previews/*')
    .pipe(dest('./views/assets/img/sections'))
}

/*
Minifying compiler section
using for minifying output file in "dist" folder
*/

// Minify for CSS files
const minifyCss = () => {
    return src('../../dist/css/*.css')
    .pipe(postcss([
        purgecss({
            content: ['../../dist/*.html', '../../dist/js/**/*.js'],
            safelist: {standard: [/@s$/, /@m$/]}
        })
    ]))
    .pipe(minify({minify: true, minifyCSS: true}))
    .pipe(dest('../../dist/css'))
}

// Minify for Js files
const minifyJs = () => {
    return src('../../src/assets/js/*.js')
    .pipe(minify({minify: true, minifyJS: {sourceMap: false}}))
    .pipe(dest('../../dist/js'))
}

export {
    buildClean, 
    buildHtml, 
    buildCss, 
    buildJs, 
    buildImg, 
    buildStatic, 
    blockitWatch,
    minifyCss,
    minifyJs 
}