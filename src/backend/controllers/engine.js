// Required plugins
import fs from 'fs';
import path from 'path';
import indent from 'indent.js';
import Handlebars from 'handlebars';
import Utils from './utils.js';

// Handlebars helper
import ifAnd from '../helpers/ifAnd.js';
import ifEqual from '../helpers/ifEqual.js';
import getFrom from '../helpers/getFrom.js';
import ifPage from '../helpers/ifPage.js';
import unlessPage from '../helpers/unlessPage.js';

export default class Engine {
	constructor(options) {
		this.Handlebars = Handlebars;
		this.options = options;
		this.utils = new Utils();
	}

	// Load hbs partials function
	loadPartials = dir => {
		const partials = this.utils.loadFiles(dir);
		partials.forEach(each => {
			const name = path.basename(each, '.hbs');
			const file = fs.readFileSync(each, 'utf-8');
			this.Handlebars.registerPartial(name, file + '\n');
		});
	};

	// Load global data json function
	loadData = dir => {
		const dataArr = this.utils.loadFiles(dir);
		const dataGlobal = dataArr.filter(each => !each.includes('posts')).map(each => {
			const key = path.basename(each, '.json').replace(/-([a-z-0-9])/g, w => w[1].toUpperCase());
			return {
				[key]: JSON.parse(fs.readFileSync(each, 'utf-8')),
			};
		});
		return Object.assign({}, ...dataGlobal);
	};

	// Load hbs helper function
	loadHelpers = () => {
		this.Handlebars.registerHelper('ifand', ifAnd);
		this.Handlebars.registerHelper('ifequal', ifEqual);
		this.Handlebars.registerHelper('getfrom', getFrom);
	};

	// Load hbs pages function
	loadPages = dir => {
		fs.readdirSync(dir).forEach(async file => {
			const fullPath = path.join(dir, file);
			if (fs.lstatSync(fullPath).isDirectory()) {
				this.loadPages(fullPath);
			} else {
				this.compileHbs(fullPath);
			}
		});
	};

	// Minify html output function
	minifyHtml = code => code.replace(/\s{2,}/g, '').replace(/\n/g, '').replace(/\t/g, '').replace(/<!--.*?-->/g, '');

	// Compile hbs pages into html
	compileHbs = async fullPath => {
		const globalData = await this.loadData(this.options.data);

		// Merge global data with current page data
		const current = fs.readFileSync(fullPath, 'utf-8');
		const currentData = {
			layout: this.utils.frontmatter(current).data.layout,
			title: this.utils.frontmatter(current).data.title,
			breadcrumb: this.utils.frontmatter(current).data.breadcrumb,
			asBlog: this.utils.frontmatter(current).data.asBlog,
			asSingle: this.utils.frontmatter(current).data.asSingle === undefined ? false : this.utils.frontmatter(current).data.asSingle,
			page: path.basename(fullPath, '.hbs'),
			path: fullPath,
			root: fullPath.split(path.sep).length > 3 ? '../' : '',
			body: this.utils.frontmatter(current).content,
		};
		const generalData = {...currentData, ...globalData};

		// Special ad-hoc partials for #ifpage and #unlesspage
		this.Handlebars.registerHelper('ifpage', ifPage(generalData.page));
		this.Handlebars.registerHelper('unlesspage', unlessPage(generalData.page));

		// Choose wich layout to use
		const layout = fs.readFileSync(`./src/layouts/${generalData.layout}.hbs`, 'utf-8');
		this.Handlebars.registerPartial('body', generalData.body + '\n');

		// Write compiled handlebars to html
		const pagePathArr = generalData.path.split(path.sep);
		const page = this.Handlebars.compile(layout);

		// Create blog directory if not exist
		if (pagePathArr.length > 3 && !fs.existsSync(`./dist/${pagePathArr[2]}`)) {
			fs.mkdirSync(`./dist/${pagePathArr[2]}`);
		}

		// Inject blog data if page indentified as single blog
		if (generalData.asSingle) {
			const blogData = {...generalData, ...{blog: JSON.parse(fs.readFileSync(`./src/data/blog/posts/${generalData.page}.json`, 'utf-8'))}};

			if (blogData.blog.hidden === false && this.options.minify) {
				fs.writeFileSync(`./dist/${pagePathArr[2]}/${blogData.page}.html`, this.minifyHtml(page(blogData)));
			} else if (blogData.blog.hidden === false) {
				fs.writeFileSync(`./dist/${pagePathArr[2]}/${blogData.page}.html`, indent.html(page(blogData)));
			}
		} else if (this.options.minify) {
			fs.writeFileSync(`./dist/${generalData.page}.html`, this.minifyHtml(page(generalData)));
		} else {
			fs.writeFileSync(`./dist/${generalData.page}.html`, indent.html(page(generalData)));
		}
	};

	// Handlebar render steps function
	render = () => {
		// Register handlebars helpers
		this.loadHelpers();

		// Register handlebars partials
		this.loadPartials(this.options.partials);

		// Load and compile every hbs pages
		this.loadPages(this.options.pages);
	};
}
