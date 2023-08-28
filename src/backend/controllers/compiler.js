// Required plugins
import fs from 'fs';
import path from 'path';
import sass from 'sass';
import babel from '@babel/core';
import chokidar from 'chokidar';
import Engine from './engine.js';
import Utils from './utils.js';

export default class Compiler {
	constructor(env) {
		this.utils = new Utils();
		this.env = env;
	}

	/*
    Theme compiler section
    using for compile HTML template using panini
    */

	// Clean dist folder
	buildClean = () => {
		const filesRm = [
			...this.utils.loadFiles('./dist', ['blog', 'img']),
			...this.utils.loadFiles('./dist/blog', ['data']),
			...this.utils.loadFiles('./dist/img', ['user']),
		];
		filesRm.forEach(each => fs.unlinkSync(each));
	};

	// Html compile task
	buildHtml = () => {
		this.utils.logMessage('begin');

		const minifyHtml = JSON.parse(fs.readFileSync('./src/data/setting.json', 'utf-8')).optimization.minifyAssets.html;

		new Engine({
			pages: './src/pages',
			layout: './src/layout',
			partials: './src/partials',
			data: './src/data',
			minify: minifyHtml,
		}).render();

		this.utils.logMessage('end', 'Html compiled successfully.');
	};

	// Css compile task
	buildCss = () => {
		this.utils.logMessage('begin');

		// If "css" folder not exist then create it
		this.utils.createDirectory('./dist/css');

		const style = sass.compile('./src/assets/scss/main.scss', {
			logger: sass.Logger.silent,
			style: 'expanded',
		});

		fs.writeFileSync('./dist/css/style.css', style.css);

		this.utils.logMessage('end', 'Css compiled successfully.');
	};

	// Js compile task
	buildJs = () => {
		this.utils.logMessage('begin');

		// If "js" and "vendors" folder not exist then create it
		this.utils.createDirectory('./dist/js');
		this.utils.createDirectory('./dist/js/vendors');

		// Config-theme.js
		const configThemeJs = this.utils.loadFiles('./src/assets/js', ['utilities', 'vendors']);
		configThemeJs.forEach(each => fs.copyFileSync(each, `./dist/js/${path.basename(each)}`));

		// Utilities.min.js
		const utilitiesJs = this.utils.loadFiles('./src/assets/js/utilities').map(each => fs.readFileSync(each, 'utf-8'));
		babel.transform(utilitiesJs.join(''), {root: './node_modules/blockit-builder', minified: true, comments: false}, (err, result) => {
			fs.writeFileSync('./dist/js/utilities.min.js', result.code);
		});

		// Js vendors
		const jsVendors = this.utils.loadFiles('./src/assets/js/vendors').filter(each => path.extname(each) === '.js');
		jsVendors.forEach(each => fs.copyFileSync(each, `./dist/js/vendors/${path.basename(each)}`));

		this.utils.logMessage('end', 'Js compiled successfully.');
	};

	// Image optimization task
	buildImg = async () => {
		this.utils.logMessage('begin');

		this.utils.loadFiles('./src/assets/img', ['blockit']).forEach(each => {
			this.utils.optimizeImg(each, './dist/img');
		});

		this.utils.loadFiles('./src/assets/img/blockit').forEach(each => {
			this.utils.optimizeImg(each, './dist/img/blockit');
		});

		this.utils.logMessage('end', 'Images optimized successfully.');
	};

	// Static assets task
	buildStatic = () => {
		this.utils.logMessage('begin');

		// If "fonts" folder not exist then create it
		this.utils.createDirectory('./dist/fonts');

		// Webfonts
		const webFonts = this.utils.loadFiles('./src/assets/fonts');
		webFonts.forEach(each => fs.copyFileSync(each, `./dist/fonts/${path.basename(each)}`));

		// FontAwesome icons
		const fontAwesome = this.utils.loadFiles('./node_modules/@fortawesome/fontawesome-free/webfonts');
		fontAwesome.filter(each => each.includes('fa-brands-400')).forEach(each => fs.copyFileSync(each, `./dist/fonts/${path.basename(each)}`));
		fontAwesome.filter(each => each.includes('fa-solid-900')).forEach(each => fs.copyFileSync(each, `./dist/fonts/${path.basename(each)}`));

		// Favicon and touch icon
		fs.copyFileSync('./src/assets/favicon/favicon.ico', './dist/img/favicon.ico');
		fs.copyFileSync('./src/assets/favicon/apple-touch-icon.png', './dist/img/apple-touch-icon.png');

		// Sendmail.php
		fs.copyFileSync('./src/assets/php/sendmail.php', './dist/sendmail.php');

		// Js vendors
		const {jsVendors} = JSON.parse(fs.readFileSync(this.utils.checkBlockitConfig(), 'utf-8'));
		if (jsVendors !== undefined) {
			jsVendors.forEach(each => {
				const name = path.basename(each).split('.');

				if (name.includes('min')) {
					fs.readFile(each, 'utf-8', (err, file) => {
						fs.writeFileSync(`./dist/js/vendors/${path.basename(each)}`, file.replace(/\/\/[#@]\s(source(?:Mapping)?URL)=\s*(\S+)/, '').replace(/[^\S\n\r]*\n$/, ''));
					});
				} else {
					babel.transformFile(each, {minified: true, comments: false}, (err, result) => {
						fs.writeFileSync(`./dist/js/vendors/${path.basename(each, '.js')}.min.js`, result.code);
					});
				}
			});
		}

		this.utils.logMessage('end', 'Static assets delivered successfully.');
	};

	/*
    Minifying compiler section
    using for minifying output file in "dist" folder
    */

	// Minify for CSS files
	minifyCss = () => {
		this.utils.logMessage('begin');

		const style = sass.compile('./src/assets/scss/main.scss', {
			logger: sass.Logger.silent,
			style: 'compressed',
		}).css;

		fs.writeFileSync('./dist/css/style.css', style);

		this.utils.logMessage('end', 'Css minifying successfully.');
	};

	// Minify for Js files
	minifyJs = () => {
		this.utils.logMessage('begin');

		const configThemeJs = this.utils.loadFiles('./src/assets/js', ['utilities', 'vendors']);
		const minifyData = configThemeJs.map(each => ({
			name: each,
			code: babel.transformFileSync(each, {root: './node_modules/blockit-builder', minified: true, comments: false}).code,
		}));
		minifyData.forEach(each => fs.writeFileSync(`./dist/js/${path.basename(each.name)}`, each.code));

		this.utils.logMessage('end', 'Js minifying successfully.');
	};

	/*
    Wacth section
    using for development mode to check if there any changes
    */
	previewWatch = instance => {
		const options = {
			ignoreInitial: true,
		};

		chokidar.watch('./src/assets/scss/**/*.scss').on('change', this.utils.debounce(() => {
			this.buildCss();
			instance.reload();
		}));
		chokidar.watch('./src/assets/js/**/*.js').on('change', this.utils.debounce(() => {
			this.buildJs();
			instance.reload();
		}));
		chokidar.watch('./src/assets/img/**/*', options).on('all', this.utils.debounce(() => {
			this.buildImg();
			instance.reload();
		}));
		chokidar.watch(['./src/**/*.hbs', './src/data/**/*.json'], options).on('all', this.utils.debounce(() => {
			this.buildHtml();
			instance.reload();
		}));
		chokidar.watch(['./src/hooks/blog/search-post.hbs', './src/hooks/blog/search-result.hbs']).on('change', () => this.utils.hookSearchWrite('./src/hooks/blog/search-post.hbs', './src/hooks/blog/search-result.hbs'));
		chokidar.watch(['./src/hooks/sections/*.hbs', './src/hooks/sections/previews/*.webp'], options).on('unlink', path => this.utils.hookSectionsRemove(path));
	};

	builderWatch = (instance, env) => {
		if (env === 'DEV') {
			chokidar.watch(['./node_modules/blockit-builder/assets/app.js', './node_modules/blockit-builder/assets/app.css']).on('change', this.utils.debounce(() => instance.reload()));
		}
	};
}
