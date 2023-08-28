// Required plugins
import fs from 'fs';
import glob from 'fast-glob';
import {performance} from 'perf_hooks';
import {deleteAsync} from 'del';
import {build} from 'esbuild';
import sassPlugin from 'esbuild-style-plugin';
import copyPlugin from 'esbuild-plugin-mxn-copy';
import {PurgeCSS} from 'purgecss';
import chokidar from 'chokidar';
import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import gifsicle from 'imagemin-gifsicle';
import svgo from 'imagemin-svgo';

// Log time function
const logTime = time => `\x1b[36m[${new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24'}).format(time)}]\x1b[0m`;

// Clean blockit
const cleanApp = async () => {
	await deleteAsync(['dist/**', '!dist/node_modules', '!dist/package.json', '!dist/package-lock.json'], {force: true});
};

// Frontend compile function
const frontendApp = async filename => {
	if (filename === undefined) {
		console.log(`${logTime()} - Processing...`);
	} else {
		console.log(`${logTime()} - Changes in file "${filename}"`);
	}

	await build({
		entryPoints: ['src/frontend/index.jsx'],
		outfile: 'dist/assets/app.js',
		bundle: true,
		jsx: 'automatic',
		platform: 'browser',
		loader: {
			'.js': 'jsx',
			'.ttf': 'file',
			'.woff': 'file',
			'.woff2': 'file',
			'.eot': 'file',
			'.svg': 'file',
		},
		plugins: [
			copyPlugin({
				copy: [
					{from: 'src/frontend/assets/static/favicon.ico', to: 'dist/assets/favicon.ico'},
					{from: 'src/frontend/assets/static/license.md', to: 'dist/license.md'},
					{from: 'src/frontend/assets/static/readme.md', to: 'dist/readme.md'},
				],
				verbose: false,
			}),
			sassPlugin(),
		],
		define: {'process.env.NODE_ENV': '"production"'},
		treeShaking: true,
		sourcemap: false,
		minify: !process.argv.includes('--dev'),
	}).catch(() => process.exit(1));

	const purgeStyle = await new PurgeCSS().purge({
		content: ['dist/assets/index.html', 'dist/assets/app.js'],
		css: ['dist/assets/app.css'],
		safelist: [
			'uk-tab',
			'uk-dropdown',
			'uk-tooltip',
			'ri-award-line',
			'ri-sticky-note-line',
			'ri-bubble-chart-line',
			'ri-road-map-line',
			'ri-file-text-line',
			'ri-timer-line',
			'ri-questionnaire-line',
			'ri-stack-line',
			'ri-gallery-line',
			'ri-price-tag-3-line',
			'ri-slideshow-2-line',
			'ri-user-line',
			'ri-chat-quote-line',
			'ri-history-line',
			'ri-tools-line',
		],
	});

	fs.writeFileSync('./dist/assets/app.css', purgeStyle[0].css);

	fs.readFile('src/frontend/assets/static/index.html', 'utf8', (err, data) => {
		fs.writeFileSync('./dist/index.html', data.replace((/ {2}|\r\n|\n|\r/gm), ''));
	});

	console.log(`${logTime()} - Finished build frontend app.`);
};

// Frontend image optimization
const frontendImg = async filename => {
	if (filename === undefined) {
		console.log(`${logTime()} - Processing...`);
	} else {
		console.log(`${logTime()} - Changes in file "${filename}"`);
	}

	const pluginOptions = [
		gifsicle({interlaced: true}),
		mozjpeg({quality: 80, progressive: true}),
		optipng({optimizationLevel: 5}),
		svgo({
			plugins: [
				{name: 'removeViewBox', active: true},
				{name: 'cleanupIDs', active: false},
			],
		}),
	];

	await imagemin(glob.sync(['src/frontend/assets/img/*'], {onlyFiles: true}), {
		destination: 'dist/assets/img',
		plugins: pluginOptions,
	});

	fs.mkdirSync('dist/assets/img/sections');
	fs.copyFileSync('src/frontend/assets/img/sections/readme.md', 'dist/assets/img/sections/readme.md');

	console.log(`${logTime()} - Finished optimize frontend images.`);
};

// Backend compile function
const backendApp = async filename => {
	if (filename === undefined) {
		console.log(`${logTime()} - Processing...`);
	} else {
		console.log(`${logTime()} - Changes in file "${filename}"`);
	}

	await build({
		entryPoints: ['src/backend/index.js'],
		outfile: 'dist/blockit.js',
		bundle: true,
		format: 'esm',
		platform: 'node',
		packages: 'external',
		plugins: [
			copyPlugin({
				copy: [
					{from: 'src/backend/helpers', to: 'dist/helpers'},
					{from: 'src/backend/babel.config.json', to: 'dist/'},
				],
				verbose: false,
			}),
		],
		sourcemap: false,
		minify: !process.argv.includes('--dev'),
	}).catch(() => process.exit(1));

	console.log(`${logTime()} - Finished build backend app.`);
};

// Build task
const startBuild = async () => {
	const start = performance.now() / 1000;

	await cleanApp();
	await frontendApp();
	await backendApp();
	await frontendImg();

	const end = performance.now() / 1000;
	console.log(`${logTime()} - Build complete in ${end.toPrecision(1) - start.toPrecision(1)} seconds.`);
};

// Dev task
const startDev = () => {
	console.log(`${logTime(new Date())} - Waiting for changes...`);

	chokidar.watch(['src/frontend/**/*.jsx', 'src/frontend/**/*.js']).on('change', path => frontendApp(path));
	chokidar.watch('src/frontend/assets/scss/**/*.scss').on('change', path => frontendApp(path));
	chokidar.watch('src/backend/index.js').on('change', path => backendApp(path));
	chokidar.watch('src/backend/controllers/*.js').on('change', path => backendApp(path));
};

const startApp = () => process.argv.includes('--dev') ? startDev() : startBuild();

startApp();
