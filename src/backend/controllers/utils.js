// Required plugins
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import sharp from 'sharp';
import svgo from 'svgo';
import Methods from './methods.js';

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
		const svg = svgo.optimize;

		switch (path.extname(file)) {
			case '.jpg':
			case '.jpeg': {
				sharp(file)
					.jpeg({mozjpeg: true})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.png': {
				sharp(file)
					.png({quality: 80})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.gif': {
				sharp(file)
					.gif({reoptimize: true})
					.toFile(`${destFolder}/${path.basename(file)}`);
				break;
			}

			case '.webp': {
				sharp(file)
					.webp({lossless: true})
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
			console.log('    builder url:    \x1b[35mhttp://localhost:3001   \x1b[0m');
			console.log('    preview url:    \x1b[35mhttp://localhost:3000\n \x1b[0m');
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

		if (status === 'completed') {
			console.log(`\n\x1b[7m\x1b[32m DONE \x1b[0m\x1b[32m Project "${packageInfo.title}" ready.\x1b[0m\n`);
		}
	};

	// Log time function
	logTime = time => `\x1b[36m[${new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h24'}).format(time)}]\x1b[0m`;

	// Frontmatter parse function
	frontmatter = (string, opts) => {
		const pattern = /(^-{3}(?:\r\n|\r|\n)([\w\W]*?)-{3}(?:\r\n|\r|\n))?([\w\W]*)*/;

		opts = opts || {};

		const parsed = {
			data: null,
			content: '',
		};

		const matches = string.match(pattern);

		if (matches[2] !== undefined) {
			const parse = opts.safeLoad ? yaml.safeLoad : yaml.load;
			parsed.data = parse(matches[2]) || {};
		}

		if (matches[3] !== undefined) {
			parsed.content = matches[3];
		}

		return parsed;
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

	// Compare object function
	compareObj = otherArray => function (current) {
		return otherArray.filter(other => other.name === current.name
                    && other.email === current.email
                    && other.role === current.role
                    && other.avatar === current.avatar).length === 0;
	};

	// Check hooks folder is exist
	checkHook() {
		const isExist = fs.readdirSync('./src/hooks', 'utf-8').length !== 0;
		return isExist;
	}

	// Hook search condition
	hookSearch = () => {
		if (fs.existsSync('./src/hooks/blog/search-post.hbs') && fs.existsSync('./src/hooks/blog/search-result.hbs')) {
			// If custom hooks is available
			this.hookSearchWrite('./src/hooks/blog/search-post.hbs', './src/hooks/blog/search-result.hbs');
		} else {
			// If custom hooks is not available
			this.hookSearchWrite('./node_modules/blockit-builder/hooks/blog/search-post.hbs', './node_modules/blockit-builder/hooks/blog/search-result.hbs');
		}
	};

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
		const themeName = process.env.npm_package_title.toLowerCase();
		const sections = ['section-card', 'section-client-logo', 'section-contact', 'section-content',	'section-counter', 'section-faq', 'section-feature', 'section-gallery', 'section-pricing', 'section-team', 'section-testimonial', 'section-timeline', 'section-utility'];
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
}
