// Required plugins
import os from 'os';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import svgo from 'svgo';
import Methods from './methods.js';
import {env} from '../index.js';

export default class Utils {
	// Create directory if not exist function
	createDirectory = dir => !fs.existsSync(dir) && fs.mkdirSync(dir);

	// General load files function
	loadFiles = (dir, ignore, response) => {
		if (!response) {
			response = [];
		}

		if (!ignore) {
			ignore = [];
		}

		fs.readdirSync(dir).forEach(file => {
			if (fs.statSync(`${dir}/${file}`).isDirectory()) {
				let ign = false;
				ignore.forEach(ignoreList => {
					if (ignoreList === file) {
						ign = true;
					}
				});
				if (!ign) {
					response.concat(this.loadFiles(`${dir}/${file}`, ignore, response));
				}
			} else {
				response.push(`${dir}/${file}`);
			}
		});
		return response;
	};

	// Optimize image condition
	optimizeImg = (file, destFolder) => {
		const {imageQuality} = JSON.parse(fs.readFileSync(this.checkBlockitConfig(), 'utf-8'));
		const svg = svgo.optimize;

		switch (path.extname(file)) {
			case '.jpg':
			case '.jpeg': {
				sharp(file)
					.jpeg({quality: imageQuality === undefined ? 80 : imageQuality.jpeg, mozjpeg: true})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.png': {
				sharp(file)
					.png({quality: imageQuality === undefined ? 80 : imageQuality.png})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.gif': {
				sharp(file)
					.gif({quality: imageQuality === undefined ? 80 : imageQuality.gif, progressive: true})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.webp': {
				sharp(file)
					.webp({quality: imageQuality === undefined ? 80 : imageQuality.webp})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.svg': {
				const svgString = fs.readFileSync(file, 'utf8');
				fs.writeFileSync(`${destFolder}/${path.basename(file)}`, svg(svgString).data);
				break;
			}
			// No Default
		}
	};

	// Log title function
	logHeading = () => {
		const packageInfo = JSON.parse(fs.readFileSync('./node_modules/blockit-builder/package.json', 'utf-8'));
		console.log(`\n${packageInfo.title} v${packageInfo.version} running on Node.js ${process.version}\n`);
		if (process.argv.pop() !== '--build') {
			console.log(`    builder url:    \x1b[35mhttp://${env.host}:${env.port.backend}   \x1b[0m`);
			console.log(`    preview url:    \x1b[35mhttp://${env.host}:${env.port.frontend}\n \x1b[0m`);
			console.log(`${this.logTime(new Date())} - Waiting for changes...`);
		}
	};

	// Log message function
	logMessage = (status, text) => {
		const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

		if (status === 'begin') {
			console.log('\x1b[33mProcessing...\x1b[0m');
		}

		if (status === 'end') {
			process.stdout.moveCursor(0, -1);
			console.log(`${this.logTime(new Date())} - ${text}`);
		}

		if (status === 'error') {
			process.stdout.moveCursor(0, -1);
			console.log(`${this.logTime(new Date())} - \x1b[31mError occurred:\x1b[0m ${text}`);
		}

		if (status === 'completed') {
			console.log(`\n\x1b[7m\x1b[32m DONE \x1b[0m\x1b[32m Project "${packageInfo.title}" ready.\x1b[0m\n`);
		}
	};

	// Log time function
	logTime = time => `\x1b[36m[${new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24'}).format(time)}]\x1b[0m`;

	// YAML parser function
	parseYAML = str => {
		const yamlRegex = /^---\n([\s\S]+?)\n---\n/;
		const match = str.match(yamlRegex);

		if (!match) {
			throw new Error('Invalid YAML front matter');
		}

		const yamlPart = match[1];
		const contentPart = str.slice(match[0].length).trim();

		const yamlLines = yamlPart.split('\n');
		const result = {};

		yamlLines.forEach(line => {
			const [key, value] = line.split(':').map(part => part.trim());
			if (value === 'false') {
				result[key] = false;
			} else if (value === 'true') {
				result[key] = true;
			} else if (typeof Number(value) === 'number' && !isNaN(Number(value))) {
				result[key] = Number(value);
			} else {
				result[key] = value.replace(/^['"]|['"]$/g, ''); // Remove quotes if present
			}
		});

		result.content = contentPart;
		return result;
	};

	// Makes sure build process is only triggered once
	debounce = (func, timeout = 800) => {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	};

	// Trim string function
	trimString(string) {
		const cut = string.indexOf(' ', 150);
		if (cut === -1) {
			return string;
		}

		return string.substring(0, cut) + ' ...';
	}

	// Check hooks folder is exist
	checkHook() {
		const isExist = fs.readdirSync('./src/hooks', 'utf-8').length !== 0;
		return isExist;
	}

	// Hook search process
	hookSearchWrite = (pathPost, pathResult) => {
		const postFormat = fs.readFileSync(pathPost, 'utf8');
		const resultFormat = fs.readFileSync(pathResult, 'utf8');

		fs.readFile('./src/assets/js/utilities/blog.js', 'utf8', (err, file) => {
			const rawResultFormat = /(?<=notFoundDiv.innerHTML\s=\s`)([^`]*)(?=`)/;
			const rawPostFormat = /(?<=return\s`)([^`]*)(?=`)/g;

			const processedResultFormat = file.replace(rawResultFormat, resultFormat);
			const processedPostFormat = processedResultFormat.replace(rawPostFormat, postFormat);

			fs.writeFileSync('./src/assets/js/utilities/blog.js', processedPostFormat);
		});
	};

	// Register hook sections and previews hook
	hookSections = () => {
		const themeName = process.env.npm_package_name;
		const sections = ['section-blank', 'section-card', 'section-client-logo', 'section-contact', 'section-content', 'section-counter', 'section-faq', 'section-feature', 'section-gallery', 'section-pricing', 'section-team', 'section-testimonial', 'section-timeline', 'section-utility'];
		const previews = fs.readdirSync('./src/hooks/sections/previews', 'utf-8');
		const slideshowData = JSON.parse(fs.readFileSync('./src/data/component.json', 'utf-8')).slideshow;

		const exclusiveData = fs.readdirSync('./src/hooks/sections', 'utf-8').filter(eachFile => eachFile.includes(themeName)).sort((a, b) => a.length - b.length).map(each => ({
			sectionName: each.split('.')[0],
			sectionTag: fs.readFileSync(`./src/hooks/sections/${each}`, 'utf8'),
		}));
		this.createDirectory('./node_modules/blockit-builder/templates');
		fs.writeFileSync(`./node_modules/blockit-builder/templates/section-${themeName}.json`, JSON.stringify(exclusiveData, null, 4));

		sections.forEach(each => {
			const sectionData = fs.readdirSync('./src/hooks/sections', 'utf8').filter(item => item.includes(each)).sort((a, b) => a.length - b.length).map(each => ({
				sectionName: each.split('.')[0],
				sectionTag: fs.readFileSync(`./src/hooks/sections/${each}`, 'utf8'),
			}));
			fs.writeFileSync(`./node_modules/blockit-builder/templates/${each.split('.')[0]}.json`, JSON.stringify(sectionData, null, 4));
		});

		previews.forEach(each => {
			fs.copyFileSync(`./src/hooks/sections/previews/${each}`, `./node_modules/blockit-builder/assets/img/sections/${each}`);
		});

		new Methods().saveSlideshow(slideshowData);
	};

	// Remove hook sections and previews hook
	hookSectionsRemove = fileName => {
		if (path.extname(fileName) === '.hbs' && fs.readdirSync('./src/hooks/sections', 'utf8').length === 1) {
			const themeName = path.basename(fileName, '.hbs').split('-').slice(0, -1).join('-');
			if (fs.existsSync(`./node_modules/blockit-builder/templates/${themeName}.json`)) {
				fs.unlinkSync(`./node_modules/blockit-builder/templates/${themeName}.json`);
			}
		}

		if (path.extname(fileName) === '.webp') {
			fs.unlinkSync(`./node_modules/blockit-builder/assets/img/sections/${path.basename(fileName)}`);
		}
	};

	// Check blockit.config or blockit-config
	checkBlockitConfig = () => {
		if (fs.existsSync('./blockit-config.json')) {
			return './blockit-config.json';
		}

		return './blockit.config.json';
	};

	// Check data folder, if exist move to new location
	checkDataFolder = () => {
		if (fs.existsSync('./dist/blog/data')) {
			fs.cpSync('./dist/blog/data', './dist/data', {recursive: true});
			fs.rmSync('./dist/blog/data', {recursive: true});
		}
	};

	// Get the IP address of server
	getServerIp = () => {
		const ifaces = os.networkInterfaces();
		let values = Object.keys(ifaces).map(name => ifaces[name]);
		values = [].concat(...values).filter(val => val.family === 'IPv4' && val.internal === false);

		return values.length ? values[0].address : '0.0.0.0';
	};
}
