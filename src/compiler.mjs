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

/*
Frontend compiler section
using for compile blockit frontend app
*/

// clean frontend blockit folder
const frontendClean = () => {
    return del(['../dist/views/**', '!../dist/views/index.html'], {force: true})
}

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
    .pipe(dest('../dist/views/assets'))
}

// image optimization task
const frontendImg = () => {
    return src('./frontend/assets/img/**/*')
    .pipe(newer('../dist/views/assets/img'))
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
    .pipe(dest('../dist/views/assets/img'))
}

// static assets task
const frontendStatic = () => {
    return src('./frontend/assets/static/favicon.ico')
    .pipe(dest('../dist/views/assets'))
}

/*
Backend compiler section
using for compile blockit backend app
*/

// clean backend blockit folder
const backendClean = () => {
    return del(['../dist/**', '!../dist/views', '!../dist/node_modules', '!../dist/package.json', '!../dist/package-lock.json'], {force: true})
}

// js compile task
const backendJs = () => {
    return src('./backend/**/**.mjs')
    .pipe(esbuild({
        bundle: false,
        outExtension: { '.js': '.mjs' },
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
    watch('./backend/**/*.mjs', series(backendJs))
}

// gulp task
task('build', series(frontendClean, frontendJs, frontendStatic, frontendImg, backendClean, backendStatic, backendJs))  // gulp --f compiler.mjs build
task('dev', blockitWatch) // gulp --f compiler.mjs dev