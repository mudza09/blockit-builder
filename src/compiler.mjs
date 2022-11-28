// gulp
import gulp from 'gulp'
const { task, src, dest, series, watch } = gulp

// required plugins
import del from 'del'
import merge from 'merge-stream'
import newer from 'gulp-newer'
import esbuild from 'gulp-esbuild'
import stylePlugin from 'esbuild-style-plugin'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'

// clean blockit
const clean = () => {
    return del(
        [
            '../dist/**',
            '!../dist/node_modules',
            '!../dist/package.json',
            '!../dist/package-lock.json'
        ], {force: true})
}

/*
Frontend compiler section
using for compile blockit frontend app
*/

// js compile task
const frontendJs = () => {
    return src('./frontend/index.js')
    .pipe(esbuild({
        outfile: 'app.js',
        bundle: true,
        loader: { 
            '.js': 'jsx',
            '.ttf': 'file',
            '.woff': 'file',
            '.woff2': 'file',
            '.eot': 'file',
            '.svg': 'file',
        },
        sourcemap: false,
        plugins: [stylePlugin()],
        minify: true
    }))
    .pipe(dest('../dist/app/assets'))
}

// image optimization task
const frontendImg = () => {
    return src('./frontend/assets/img/**/*')
    .pipe(newer('../dist/app/assets/img'))
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
    .pipe(dest('../dist/app/assets/img'))
}

// static assets task
const frontendStatic = () => {
    return merge(
        // favicon
        src('./frontend/assets/static/favicon.ico')
        .pipe(dest('../dist/app/assets')),

        // index.html
        src('./frontend/assets/static/index.html')
        .pipe(dest('../dist/app'))
    )
}

/*
Backend compiler section
using for compile blockit backend app
*/

// js compile task
const backendJs = () => {
    return src('./backend/index.js')
    .pipe(esbuild({
        outfile: 'index.js',
        bundle: true,
        platform: 'node',
        external: [
            'cli-color',
            'gulp-rename',
            'gulp-jsbeautifier',
            'gulp-imagemin',
            'gulp-minifier',
            'gulp-postcss',
            'gulp-newer',
            'gulp-concat',
            'gulp-babel',
            'gulp-sass',
            'gulp-task-err-handler',
            '@fullhuman/postcss-purgecss',
            'connect-history-api-fallback',
            'postcss-merge-longhand',
            'merge-stream',
            'autoprefixer',
            'browser-sync',
            'panini',
            'jsdom',
            'sass',
            '../../src/hooks/components/*',
            './node_modules/*'
        ],
        sourcemap: false,
        minify: true
    }))
    .pipe(dest('../dist'))
}

// static assets task
const backendStatic = () => {
    return merge(
        // hooks
        src('./backend/hooks/**/*')
        .pipe(dest('../dist/hooks')),

        // helpers
        src('./backend/helpers/*')
        .pipe(dest('../dist/helpers')),

        // templates
        src('./backend/templates/*')
        .pipe(dest('../dist/templates'))
    )
}

/*
Wacth and task section
using for development mode and each task lists
*/

// watch files task
const blockitWatch = () => {
    watch('./frontend/assets/scss/**/*.scss', series(frontendJs))
    watch('./frontend/**/*.js', series(frontendJs))
    watch('./frontend/assets/img/**/*', series(frontendImg))
    watch('./backend/**/*.js', series(backendJs))
}

// gulp task
task('build', series(clean, frontendJs, frontendStatic, frontendImg, backendStatic, backendJs))  // gulp --f compiler.mjs build
task('dev', blockitWatch) // gulp --f compiler.mjs dev