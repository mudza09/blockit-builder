// Required plugins
import fs from 'fs';
import {JSDOM} from 'jsdom';
import sharp from 'sharp';
import svgo from 'svgo';
import Compiler from './compiler.js';
import Utils from './utils.js';

export default class Methods {
	constructor(socket) {
		this.socket = socket;
		this.utils = new Utils();
		this.compiler = new Compiler();
	}

	// Dashboard data
	createDashboardData = () => {
		const data = {
			name: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/package.json', 'utf-8')).title,
			theme: process.env.npm_package_title,
			version: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/package.json', 'utf-8')).version,
			pages: fs.readdirSync('./src/pages', 'utf8').filter(file => file.match(/.(hbs)$/i)).filter(each => !each.match(/blog-page/g) && !each.match(/blog-find/g)).length,
			posts: fs.readdirSync('./src/data/blog/posts', 'utf8').length,
			authors: JSON.parse(fs.readFileSync('./src/data/setting.json', 'utf8')).authors.length,
		};
		this.socket.emit('dashboardData', data);
	};

	// Pages data
	createPagesData = () => {
		fs.readdir('./src/pages', (err, files) => {
			const data = files.filter(eachFile => eachFile.match(/.(hbs)$/i)).filter(each => !each.match(/blog-page/g) && !each.match(/blog-find/g)).map(file => ({
				page: file.split('.').slice(0, -1).join('.'),
				title: fs.readFileSync(`./src/pages/${file}`, 'utf8').match(/(?<=title:\s).*/g)[0],
				date: fs.statSync(`./src/pages/${file}`).mtime,
				layout: fs.readFileSync(`./src/pages/${file}`, 'utf8').match(/(?<=layout:\s).*/g)[0],
				breadcrumb: fs.readFileSync(`./src/pages/${file}`, 'utf8').match(/(?<=breadcrumb:\s).*/g)[0],
				sections: fs.readFileSync(`./src/pages/${file}`, 'utf8').match(/{{>(.*?)}}*/g).map(item => item.substring(4).slice(0, -3)),
			}));
			this.socket.emit('pagesData', data);
		});
		fs.readFile('./src/data/setting.json', 'utf8', (err, file) => {
			const data = JSON.parse(file).blog.asBlog === false ? false : JSON.parse(file).blog.asBlog.split('.')[0];

			this.socket.emit('pagesCurrentBlog', data);
		});
	};

	// Pages action data
	createPagesActionData = () => {
		const exclusiveSectionsCheck = fs.readdirSync('./src/hooks/sections', 'utf-8').filter(eachFile => eachFile.match(/.(hbs)$/i));
		const exclusiveSections = this.utils.checkHook() && exclusiveSectionsCheck.length !== 0 ? exclusiveSectionsCheck : false;
		const themeName = exclusiveSections === false ? 'empty' : exclusiveSections[0].split('-')[1];

		const exclusiveData = {
			name: `Exclusive - ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`,
			sections: exclusiveSections,
			icon: 'ri-award-line',
		};

		const data = [
			{
				name: 'Card',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-card.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-sticky-note-line',
			},
			{
				name: 'Client logo',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-client-logo.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-bubble-chart-line',
			},
			{
				name: 'Contact',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-contact.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-road-map-line',
			},
			{
				name: 'Content',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-content.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-file-text-line',
			},
			{
				name: 'Counter',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-counter.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-timer-line',
			},
			{
				name: 'Faq',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-faq.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-questionnaire-line',
			},
			{
				name: 'Feature',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-feature.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-stack-line',
			},
			{
				name: 'Gallery',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-gallery.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-gallery-line',
			},
			{
				name: 'Pricing',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-pricing.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-price-tag-3-line',
			},
			{
				name: 'Slideshow',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/component-slideshow.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-slideshow-2-line',
			},
			{
				name: 'Team',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-team.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-user-line',
			},
			{
				name: 'Testimonial',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-testimonial.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-chat-quote-line',
			},
			{
				name: 'Timeline',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-timeline.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-history-line',
			},
			{
				name: 'Utility',
				sections: JSON.parse(fs.readFileSync('./node_modules/blockit-builder/templates/section-utility.json', 'utf-8')).map(each => each.sectionName),
				icon: 'ri-tools-line',
			},
		];

		if (exclusiveSections !== false) {
			data.splice(5, 0, exclusiveData);
		}

		this.socket.emit('pagesActionData', data);
	};

	pagesDeletePage = (nameFile, sections) => {
		fs.readFile(`./src/pages/${nameFile}.hbs`, 'utf8', (err, file) => {
			const blogStatus = file.match(/(?<=asBlog:\s).*/g)[0];
			if (blogStatus === 'false') {
				fs.unlinkSync(`./dist/${nameFile}.html`);
				fs.unlinkSync(`./src/pages/${nameFile}.hbs`);
				if (sections !== undefined) {
					sections.forEach(item => !item.includes('component-slideshow') && fs.unlinkSync(`./src/partials/sections/${item}.hbs`));
				}
			} else {
				fs.unlinkSync(`./dist/${nameFile}.html`);
				fs.unlinkSync(`./src/pages/${nameFile}.hbs`);
				fs.unlinkSync('./dist/blog-find.html');
				fs.unlinkSync('./src/pages/blog-find.hbs');
				fs.readdir('./src/pages', (err, files) => {
					files.filter(eachFile => eachFile.match(/.(hbs)$/i)).filter(each => each.match(/blog-page/g)).forEach(each => {
						fs.unlinkSync(`./dist/${each.split('.').slice(0, -1)[0]}.html`);
						fs.unlinkSync(`./src/pages/${each}`);
					});
				});

				// Set back "false" at asBlog setting.json
				fs.readFile('./src/data/setting.json', 'utf8', (err, file) => {
					const settingData = JSON.parse(file);
					settingData.blog.asBlog = false;
					fs.writeFileSync('./src/data/setting.json', JSON.stringify(settingData, null, 2));

					this.socket.emit('pagesCurrentBlog', settingData.blog.asBlog);
				});

				// Set back "false" blogPath value in some utilities js
				fs.readFile('./src/assets/js/utilities/breadcrumb.js', 'utf8', (err, file) => {
					const pathChange = file.replace(/(?<=this\.blogPath\s=\s).*/g, false);
					fs.writeFileSync('./src/assets/js/utilities/breadcrumb.js', pathChange);
				});
				fs.readFile('./src/assets/js/utilities/active-menu.js', 'utf8', (err, file) => {
					const pathChange = file.replace(/(?<=this\.blogPath\s=\s).*/g, false);
					fs.writeFileSync('./src/assets/js/utilities/active-menu.js', pathChange);
				});
			}
		});
	};

	pagesSavePage = objects => {
		if (objects.blogStatus) {
			fs.readFile('./src/data/setting.json', 'utf8', (err, file) => {
				const settingData = JSON.parse(file);

				// Write asBlog file name in setting.json
				settingData.blog.asBlog = `${objects.nameFile}.hbs`;
				fs.writeFileSync('./src/data/setting.json', JSON.stringify(settingData, null, 2));

				// Write blogPath value in some utilities js
				fs.readFile('./src/assets/js/utilities/breadcrumb.js', 'utf8', (err, file) => {
					const pathChange = file.replace(/(?<=this\.blogPath\s=\s).*/g, `'${objects.nameFile}.html'`);
					fs.writeFileSync('./src/assets/js/utilities/breadcrumb.js', pathChange);
				});
				fs.readFile('./src/assets/js/utilities/active-menu.js', 'utf8', (err, file) => {
					const pathChange = file.replace(/(?<=this\.blogPath\s=\s).*/g, `'${objects.nameFile}.html'`);
					fs.writeFileSync('./src/assets/js/utilities/active-menu.js', pathChange);
				});

				// Change frontmatter in blog.hbs, blog-single.hbs, and blog-find.hbs
				this.changeBlogFrontmatter(objects.data, './src/hooks/blog/pages/blog.hbs', './node_modules/blockit-builder/hooks/blog/pages/blog.hbs');
				this.changeBlogFrontmatter(objects.data, './src/hooks/blog/pages/blog-single.hbs', './node_modules/blockit-builder/hooks/blog/pages/blog-single.hbs');
				this.changeBlogFrontmatter(objects.data, './src/hooks/blog/pages/blog-find.hbs', './node_modules/blockit-builder/hooks/blog/pages/blog-find.hbs');

				// Change frontmatter in each blog post
				fs.readdir('./src/pages/blog', (err, files) => {
					files.forEach(post => this.changeBlogFrontmatter(objects.data, `./src/pages/blog/${post}`));
				});

				// Read all post file, data tag and process for create blog page
				fs.readFile('./src/data/blog/blog.json', 'utf8', (err, file) => {
					const postObj = JSON.parse(file);
					const dataTag = {
						defaultPage: fs.existsSync('./src/hooks/blog/pages/blog.hbs') ? fs.readFileSync('./src/hooks/blog/pages/blog.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/pages/blog.hbs', 'utf8'),
						singlePage: fs.existsSync('./src/hooks/blog/pages/blog-single.hbs') ? fs.readFileSync('./src/hooks/blog/pages/blog-single.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/pages/blog-single.hbs', 'utf8'),
						defaultSection: fs.existsSync('./src/hooks/blog/sections/section-blog.hbs') ? fs.readFileSync('./src/hooks/blog/sections/section-blog.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/sections/section-blog.hbs', 'utf8'),
						singleSection: fs.existsSync('./src/hooks/blog/sections/section-blog-single.hbs') ? fs.readFileSync('./src/hooks/blog/sections/section-blog-single.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/sections/section-blog-single.hbs', 'utf8'),
					};

					this.postPaginatorPage(postObj, dataTag);
				});

				// Write blog-find.hbs page
				const pathBlogFind = fs.existsSync('./src/hooks/blog/pages/blog-find.hbs') ? './src/hooks/blog/pages/blog-find.hbs' : './node_modules/blockit-builder/hooks/blog/pages/blog-find.hbs';
				fs.readFile(pathBlogFind, 'utf8', (err, file) => {
					const layoutChange = file.replace(/(?<=layout:\s).*/g, objects.data.layout);
					const titleChange = layoutChange.replace(/(?<=title:\s).*/g, objects.data.title);
					const breadcrumbChange = titleChange.replace(/(?<=breadcrumb:\s).*/g, objects.data.breadcrumb);

					fs.writeFileSync('./src/pages/blog-find.hbs', breadcrumbChange);
				});
			});
		} else {
			fs.writeFileSync(`./src/pages/${objects.nameFile}.hbs`, objects.data);

			// Set back "false" at asBlog setting.json
			if (objects.currentBlog === 'false') {
				fs.readFile('./src/data/setting.json', 'utf8', (err, file) => {
					const settingData = JSON.parse(file);
					settingData.blog.asBlog = false;
					fs.writeFileSync('./src/data/setting.json', JSON.stringify(settingData, null, 2));
				});
			}
		}
	};

	readSectionData = nameFile => {
		const pathData = nameFile.split('-').length >= 4 ? `./src/partials/sections/${nameFile}.hbs` : `./node_modules/blockit-builder/templates/${nameFile.split('-').slice(0, -1).join('-')}.json`;

		fs.readFile(pathData, 'utf8', (err, file) => {
			if (nameFile.split('-').length >= 4) {
				const data = {
					blocks: [
						{
							id: nameFile,
							type: 'code',
							data: {
								language: 'HTML',
								text: file,
							},
						},
					],
				};
				this.socket.emit('resultSectionData', data);
			} else {
				const index = JSON.parse(file).findIndex(e => e.sectionName === nameFile);
				const data = {
					blocks: [
						{
							id: nameFile.split('-').length >= 4 ? nameFile : JSON.parse(file)[index].sectionName,
							type: 'code',
							data: {
								language: 'HTML',
								text: nameFile.split('-').length >= 4 ? file : JSON.parse(file)[index].sectionTag,
							},
						},
					],
				};
				this.socket.emit('resultSectionData', data);
			}
		});
	};

	createSectionData = (sections, deletedSections) => {
		sections.forEach(item => {
			fs.readFile(`./node_modules/blockit-builder/templates/${item.reference.split('-').slice(0, -1).join('-')}.json`, 'utf8', (err, file) => {
				JSON.parse(file).forEach(each => {
					if (each.sectionName === item.reference && !each.sectionName.includes('component-slideshow')) {
						if (item.updateData === 'new') {
							fs.writeFileSync(`./src/partials/sections/${item.reference}-${item.id}.hbs`, each.sectionTag);
						} else if (item.updateData !== false && item.updateData !== 'new') {
							fs.writeFileSync(`./src/partials/sections/${item.reference}-${item.id}.hbs`, item.updateData);
						}
					}
				});
			});
		});
		if (deletedSections.length !== 0 || deletedSections[0] !== false) {
			deletedSections.forEach(item => {
				try {
					if (fs.existsSync(`./src/partials/sections/${item}.hbs`)) {
						fs.unlinkSync(`./src/partials/sections/${item}.hbs`);
					}
				} catch (err) {
					console.error(`file not found: ${err}`);
				}
			});
		}
	};

	// Post editor
	createPostsData = () => {
		fs.readdir('./src/data/blog/posts', (err, files) => {
			const data = files.map(file => {
				const raw = JSON.parse(fs.readFileSync(`./src/data/blog/posts/${file}`, 'utf8'));
				return {
					title: raw.title,
					link: raw.link,
					dateCreated: raw.dateCreated,
					dateModified: raw.dateModified,
					timeCreated: raw.timeCreated,
					timeModified: raw.timeModified,
					author: raw.author,
					category: raw.category,
					hidden: raw.hidden,
				};
			});
			this.socket.emit('postsData', data);
		});
	};

	createPostsActionData = nameFile => {
		const settingData = JSON.parse(fs.readFileSync('./src/data/setting.json', 'utf8'));
		const postData = nameFile === 'empty' ? null : JSON.parse(fs.readFileSync(`./src/data/blog/posts/${nameFile}.json`, 'utf8'));
		const data = {
			authors: {
				current: postData === null ? '' : postData.author.name,
				select: settingData.authors,
			},
			categories: {
				current: postData === null ? '' : postData.category,
				select: settingData.blog.categories,
			},
			currentTags: postData === null ? '' : postData.tags,
			currentImage: postData === null ? false : postData.image,
			title: postData === null ? '' : postData.title,
			dateCreated: postData === null ? '' : postData.dateCreated,
			timeCreated: postData === null ? '' : postData.timeCreated,
			blocks: postData === null ? '' : postData.blocks,
			hidden: postData === null ? '' : postData.hidden,
		};
		this.socket.emit('postsActionData', data);
	};

	postPaginatorWidget = (items, currentPage, perPageItems, settingData) => {
		const page = currentPage || 1;
		const perPage = perPageItems || 10;
		const offset = (page - 1) * perPage;

		const paginatedItems = items.slice(offset).slice(0, perPageItems);
		const totalPages = Math.ceil(items.length / perPage);

		return {
			page,
			perPage,
			prevPage: page - 1 ? page - 1 : null,
			nextPage: (totalPages > page) ? page + 1 : null,
			totalPost: items.length,
			totalPages,
			displayAuthor: settingData.blog.displayAuthor,
			data: paginatedItems,

		};
	};

	postPaginatorPage = (postObj, dataTag) => {
		// Post per page in settings page
		const settingData = JSON.parse(fs.readFileSync('./src/data/setting.json', 'utf8'));

		// Read and send post list data
		setTimeout(() => {
			const displayPost = settingData.blog.postPerPage;
			const dataSend = this.postPaginatorWidget(postObj.post, 1, displayPost, settingData);
			const {totalPages} = dataSend;

			// Create blog-page data and hbs
			if (settingData.blog.asBlog !== false) {
				let count = 1;
				while (count <= totalPages) {
					// Blog page data json
					const nameFile = `blog-page-${count}`;
					const dataRes = this.postPaginatorWidget(postObj.post.filter(each => !each.hidden), count, displayPost, settingData);
					fs.writeFileSync(`./src/data/blog/${nameFile}.json`, JSON.stringify(dataRes, null, 2));

					// Blog page and section hbs
					const pageChange = dataTag.defaultPage.replace(/(?<={{> section-blog-)(.*?)(?= }})/g, count);
					if (count === 1) {
						fs.writeFileSync(`./src/pages/${settingData.blog.asBlog}`, pageChange);
					} else {
						fs.writeFileSync(`./src/pages/blog-page-${count}.hbs`, pageChange);
					}

					const sectionFirstChange = dataTag.defaultSection.replace(/{{#each(.*?).data}}/g, `{{#each blogPage${count}.data}}`);
					const sectionSecondChange = sectionFirstChange.replace(/{{#if(.*?).displayAuthor}}/g, `{{#if @root.blogPage${count}.displayAuthor}}`);
					fs.writeFileSync(`./src/partials/blog/section-blog-${count}.hbs`, sectionSecondChange);

					count++;
				}
			}

			// Delete unused blog-page-number
			fs.readdir('./src/data/blog', (err, files) => {
				const deleteFiles = files.filter(f => f.match(/(blog-page-)/g));
				let startFiles = totalPages + 1;
				const totalFiles = deleteFiles.length;

				while (startFiles <= totalFiles) {
					if (fs.existsSync(`./src/data/blog/blog-page-${startFiles}.json`)) {
						fs.unlinkSync(`./src/data/blog/blog-page-${startFiles}.json`);
					}

					if (fs.existsSync(`./src/pages/blog-page-${startFiles}.hbs`)) {
						fs.unlinkSync(`./src/pages/blog-page-${startFiles}.hbs`);
					}

					if (fs.existsSync(`./dist/blog-page-${startFiles}.html`)) {
						fs.unlinkSync(`./dist/blog-page-${startFiles}.html`);
					}

					startFiles++;
				}
			});

			// Delete unused section-blog-number
			fs.readdir('./src/partials/blog', (err, files) => {
				const usedSections = files.filter(each => each.match(/section-blog/g)).sort((a, b) => a.length - b.length).filter((each, index) => index < totalPages);
				const unusedSections = files.filter(each => each.match(/section-blog/g)).filter(each => !usedSections.includes(each));

				unusedSections.forEach(section => {
					if (fs.existsSync(`./src/partials/blog/${section}`)) {
						fs.unlinkSync(`./src/partials/blog/${section}`);
					}
				});
			});

			// Create data-blog.json`
			const latestPost = postObj.post.filter(each => !each.hidden).slice(0, 3).map(each => (
				{
					title: each.title, link: each.link, date: each.dateCreated,
				}
			));

			const firstRawTag = postObj.post.map(e => e.tags);
			const secondRawTag = firstRawTag.filter(tag => tag).reduce((acc, tag) => acc.concat(tag), []).map(tag => tag);
			const tagLists = secondRawTag.filter((item, pos) => secondRawTag.indexOf(item) === pos);

			const firstRawCategory = postObj.post.map(e => e.category);
			const categoryLists = firstRawCategory.filter((item, pos) => firstRawCategory.indexOf(item) === pos);

			const asBlogValue = settingData.blog.asBlog === false ? false : `${settingData.blog.asBlog.split('.').slice(0, -1)}.html`;
			const blogJsObj = {asBlog: asBlogValue, totalPages, tagLists, latestPost};
			fs.writeFileSync('./dist/blog/data/data-blog.json', JSON.stringify(blogJsObj));

			// Create data-category.json
			fs.readFile('./src/data/blog/blog.json', 'utf8', (err, buffer) => {
				const data = JSON.parse(buffer);
				const categoryData = categoryLists.map(item => this.createCategoryPost(data.post, item));
				fs.writeFileSync('./dist/blog/data/data-category.json', JSON.stringify(categoryData));
			});

			// Create data-category.json & data-tag.json
			fs.readFile('./src/data/blog/blog.json', 'utf8', (err, buffer) => {
				const data = JSON.parse(buffer);
				const tagData = tagLists.map(item => this.createTagPost(data.post, item));
				tagData.forEach(item => {
					item.posts.forEach(e => {
						delete e.tags;
						delete e.blocks;
					});
				});
				fs.writeFileSync('./dist/blog/data/data-tag.json', JSON.stringify(tagData));
			});
		}, 600);
	};

	createCategoryPost = (array, categoryName) => {
		const categoryResult = array.filter(post => post.category === categoryName);
		categoryResult.forEach(post => {
			post.content = this.utils.trimString(post.blocks[0].data.text);
			post.date = post.dateCreated;
			delete post.author.id;
			delete post.blocks;
			delete post.share;
			delete post.category;
			delete post.tags;
			delete post.dateCreated;
			delete post.timeCreated;
			if (!post.image) {
				delete post.image;
			}
		});

		return {
			category: categoryName,
			totalPost: categoryResult.length,
			posts: categoryResult,
		};
	};

	createTagPost = (array, tagName) => {
		const tagResult = [];
		array.forEach(post => {
			post.tags.forEach(tag => {
				if (tag === tagName) {
					tagResult.push(post);
				}
			});
		});

		tagResult.forEach(post => {
			post.content = this.utils.trimString(post.blocks[0].data.text);
			post.date = post.dateCreated === undefined ? post.date : post.dateCreated;
			delete post.author.id;
			delete post.share;
			delete post.dateCreated;
			delete post.timeCreated;
			if (!post.image) {
				delete post.image;
			}
		});

		return {
			tag: tagName,
			totalPost: tagResult.length,
			posts: tagResult,
		};
	};

	postCreatePage = dataTag => {
		fs.readdir('./src/data/blog/posts', (err, files) => {
			const postObj = {
				post: files.map(file => JSON.parse(fs.readFileSync(`./src/data/blog/posts/${file}`, 'utf8'))),
			};
			postObj.post.sort((a, b) => new Date(`${b.dateCreated} ${b.timeCreated}`) - new Date(`${a.dateCreated} ${a.timeCreated}`));

			fs.readFile('./src/data/blog/blog.json', 'utf-8', (err, oldBlog) => {
				const reference = JSON.parse(oldBlog).post.map(post => {
					delete post.dateModified;
					delete post.timeModified;
					return post;
				});
				const modified = postObj.post.map(post => {
					delete post.dateModified;
					delete post.timeModified;
					return post;
				});

				// If there any change then write blog.json
				if (JSON.stringify(reference) !== JSON.stringify(modified)) {
					const unhiddenPost = {
						post: postObj.post.filter(each => !each.hidden),
					};
					fs.writeFileSync('./src/data/blog/blog.json', JSON.stringify(unhiddenPost, null, 2));
				}
			});

			this.postPaginatorPage(postObj, dataTag);
		});
	};

	postsSaveContent = async (nameFile, dataPost, dataTag) => {
		fs.unlink('./dist/blog/*.html', () => {
			const sectionPageChange = dataTag.singlePage.replace(/(?<={{> post-title)(.*?)(?= }})/g, `-${nameFile}`);
			fs.writeFileSync(`./src/data/blog/posts/${nameFile}.json`, JSON.stringify(dataPost, null, 2));

			if (dataPost.hidden && fs.existsSync(`./dist/blog/${dataPost.link}`)) {
				fs.unlinkSync(`./dist/blog/${dataPost.link}`);
			}

			if (dataPost.hidden === false) {
				fs.writeFileSync(`./src/partials/blog/post-title-${nameFile}.hbs`, dataTag.singleSection);
				fs.writeFileSync(`./src/pages/blog/${nameFile}.hbs`, sectionPageChange);
			}

			this.postCreatePage(dataTag);
		});
	};

	postsDeletePost = (nameFile, dataTag) => {
		const files = [
			`./src/data/blog/posts/${nameFile}.json`,
			`./src/pages/blog/${nameFile}.hbs`,
			`./src/partials/blog/post-title-${nameFile}.hbs`,
			`./dist/blog/${nameFile}.html`,
		];

		return Promise.all(files.map(each => fs.unlinkSync(each)))
			.then(
				this.socket.emit('deleteDone', 'success'),
				this.postCreatePage(dataTag),
			);
	};

	createEditorData = nameFile => {
		fs.readFile(`./src/data/blog/posts/${nameFile}.json`, 'utf8', (err, data) => this.socket.emit('editorData', data));
	};

	postsTagSources = () => {
		const tagData = {
			defaultPage: fs.existsSync('./src/hooks/blog/pages/blog.hbs') ? fs.readFileSync('./src/hooks/blog/pages/blog.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/pages/blog.hbs', 'utf8'),
			singlePage: fs.existsSync('./src/hooks/blog/pages/blog-single.hbs') ? fs.readFileSync('./src/hooks/blog/pages/blog-single.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/pages/blog-single.hbs', 'utf8'),
			defaultSection: fs.existsSync('./src/hooks/blog/sections/section-blog.hbs') ? fs.readFileSync('./src/hooks/blog/sections/section-blog.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/sections/section-blog.hbs', 'utf8'),
			singleSection: fs.existsSync('./src/hooks/blog/sections/section-blog-single.hbs') ? fs.readFileSync('./src/hooks/blog/sections/section-blog-single.hbs', 'utf8') : fs.readFileSync('./node_modules/blockit-builder/hooks/blog/sections/section-blog-single.hbs', 'utf8'),
		};
		this.socket.emit('tagSourcesData', tagData);
	};

	findBlogTitle = (object, key, value) => {
		if (Object.prototype.hasOwnProperty.call(object, key) && object[key] === value) {
			return object;
		}

		for (const k of Object.keys(object)) {
			if (typeof object[k] === 'object') {
				const o = this.findBlogTitle(object[k], key, value);
				if (o !== null && typeof o !== 'undefined') {
					return o;
				}
			}
		}

		return null;
	};

	createBlogTitle = data => {
		if (this.findBlogTitle(data, 'link', 'blog/page-1.html') !== null) {
			const blogTitle = this.findBlogTitle(data, 'link', 'blog/page-1.html').title;

			fs.readdir('./src/pages/blog', (err, files) => {
				files.forEach(each => {
					fs.readFile(`./src/pages/blog/${each}`, 'utf8', (err, data) => {
						const newAttribute = data.replace(/(?<=data-title=")([^"]*)/g, blogTitle.toLowerCase());
						const newTitle = newAttribute.replace(/(?<=title:\s).*/g, blogTitle);
						fs.writeFileSync(`./src/pages/blog/${each}`, newTitle);
					});
				});
			});
		}
	};

	changeBlogFrontmatter = (data, srcPath, nodePath) => {
		const file = fs.existsSync(srcPath) ? fs.readFileSync(srcPath, 'utf8') : fs.readFileSync(nodePath, 'utf8');
		const layoutChange = file.replace(/(?<=layout:\s).*/g, data.layout);
		const titleChange = layoutChange.replace(/(?<=title:\s).*/g, data.title);
		const breadcrumbChange = titleChange.replace(/(?<=breadcrumb:\s).*/g, data.breadcrumb);

		if (fs.existsSync(srcPath)) {
			fs.writeFileSync(srcPath, breadcrumbChange);
		} else {
			fs.writeFileSync(nodePath, breadcrumbChange);
		}
	};

	// Navigation editor
	createNavigationData = () => {
		const data = {
			nav: JSON.parse(fs.readFileSync('./src/data/navigation.json', 'utf8')),
			select: fs.readdirSync('./src/pages', 'utf8').filter(each => !each.match(/blog-page/g) && !each.match(/blog-find/g)).filter(file => file.match(/.(hbs)$/i)),
		};
		this.socket.emit('navigationData', data);
	};

	saveNavigationData = data => {
		fs.writeFileSync('./src/data/navigation.json', JSON.stringify(data, null, 2));
		this.createBlogTitle(data);
	};

	assetsUpload = (buffer, nameFile, typeFile) => {
		const resizeObj = {};
		if (nameFile.includes('author')) {
			Object.assign(resizeObj, {width: 72, height: 72});
		} else if (nameFile.includes('featured')) {
			Object.assign(resizeObj, {width: 1130});
		} else if (nameFile.includes('post')) {
			Object.assign(resizeObj, {width: 980});
		} else {
			Object.assign(resizeObj, {width: null});
		}

		if (typeFile === 'svg') {
			const svg = svgo.optimize;
			fs.writeFileSync(`./dist/img/user/${nameFile}`, svg(buffer).data);
			this.socket.emit('uploadDone', `img/user/${nameFile}`);
		} else {
			sharp(buffer)
				.resize(resizeObj)
				.toFile(`./dist/img/user/${nameFile}`, err => {
					if (err) {
						throw err;
					}

					this.socket.emit('uploadDone', `img/user/${nameFile}`);
				});
		}
	};

	assetsDelete = nameFile => {
		if (fs.existsSync(`./dist/img/user/${nameFile}`)) {
			fs.unlink(`./dist/img/user/${nameFile}`, err => {
				if (err) {
					throw err;
				}

				this.socket.emit('deleteDone', 'success');
			});
		}
	};

	// Settings editor
	saveSettingsData = (data, dataTag) => {
		// Colors setting
		fs.readFile('./src/assets/scss/_colors.scss', 'utf8', (err, file) => {
			const temp = file;
			const primaryColorChange = temp.replace(/(?<=primary:\s)([^;]*)/g, data.colors.primaryColor);
			const secondaryColorChange = primaryColorChange.replace(/(?<=secondary:\s)([^;]*)/g, data.colors.secondaryColor);
			const successColorChange = secondaryColorChange.replace(/(?<=success:\s)([^;]*)/g, data.colors.successColor);
			const infoColorChange = successColorChange.replace(/(?<=info:\s)([^;]*)/g, data.colors.infoColor);
			const warningColorChange = infoColorChange.replace(/(?<=warning:\s)([^;]*)/g, data.colors.warningColor);
			const dangerColorChange = warningColorChange.replace(/(?<=danger:\s)([^;]*)/g, data.colors.dangerColor);
			const lightColorChange = dangerColorChange.replace(/(?<=light:\s)([^;]*)/g, data.colors.lightColor);
			const darkColorChange = lightColorChange.replace(/(?<=dark:\s)([^;]*)/g, data.colors.darkColor);
			const backgroundColorChange = darkColorChange.replace(/(?<=body-bg:\s)([^;]*)/g, data.colors.backgroundColor);
			const textColorChange = backgroundColorChange.replace(/(?<=body-color:\s)([^;]*)/g, data.colors.textColor);
			const linkColorChange = textColorChange.replace(/(?<=link-color:\s)([^;]*)/g, data.colors.linkColor);

			if (temp !== linkColorChange) {
				fs.writeFileSync('./src/assets/scss/_colors.scss', linkColorChange);
			}
		});

		fs.readFile('./src/data/setting.json', 'utf-8', (err, oldData) => {
			// Write setting.json file
			if (oldData !== JSON.stringify(data, null, 2)) {
				fs.writeFileSync('./src/data/setting.json', JSON.stringify(data, null, 2));
			}

			// Recreate blog pagination page
			this.postCreatePage(dataTag);

			// Update author and avatar data
			this.updateAuthorData(oldData, data, dataTag);

			// Minify assets
			this.runMinifying(oldData, data);
		});
	};

	runMinifying = (oldData, data) => {
		const assetsCss = data.optimization.minifyAssets.css;
		const assetsJs = data.optimization.minifyAssets.js;
		const dataCompareCss = JSON.parse(oldData).optimization.minifyAssets.css !== assetsCss;
		const dataCompareJs = JSON.parse(oldData).optimization.minifyAssets.js !== assetsJs;

		if (dataCompareCss && assetsCss) {
			this.compiler.minifyCss();
		} else if (dataCompareCss && !assetsCss) {
			this.compiler.buildCss();
		}

		if (dataCompareJs && assetsJs) {
			this.compiler.minifyJs();
		} else if (dataCompareJs && !assetsJs) {
			this.compiler.buildJs();
		}
	};

	saveEmail = data => {
		fs.readFile('./dist/sendmail.php', 'utf8', (err, phpFile) => {
			const currentEmail = String(phpFile.match(/(?<=emailTo = ).*/g));
			if (currentEmail !== `"${data}";`) {
				const emailChange = phpFile.replace(/(?<=emailTo = ).*/g, `"${data}";`);
				fs.writeFileSync('./dist/sendmail.php', emailChange);
			}
		});
	};

	saveMap = iframe => {
		fs.readdir('./src/partials/sections', (err, files) => {
			const sectionContacts = files.filter(eachFile => eachFile.match(/section-contact/g));
			sectionContacts.forEach(each => {
				fs.readFile(`./src/partials/sections/${each}`, 'utf8', (err, data) => {
					const headerComment = data.split('\n')[0];
					const htmlBody = new JSDOM(data);

					const mapIframeEl = htmlBody.window.document.querySelector('iframe');
					if (mapIframeEl !== null) {
						mapIframeEl.src = iframe;
						const result = headerComment.concat('\n', htmlBody.window.document.documentElement.childNodes[1].innerHTML);
						fs.writeFileSync(`./src/partials/sections/${each}`, result);
					}
				});
			});
		});
	};

	saveSocialMedia = () => {
		const socialData = JSON.parse(fs.readFileSync('src/data/component.json', 'utf8')).socialMedia;
		const socialLists = socialData.filter(each => Object.values(each)[0].length !== 0).map(each => {
			const social = Object.keys(each)[0];
			const link = Object.values(each)[0];

			return `\t<div><a href="${link}" class="color-${social} text-decoration-none"><i class="fab fa-${social === 'facebook' ? 'facebook-square' : social}"></i> ${social.charAt(0).toUpperCase() + social.slice(1)}</a></div>`;
		}).join('\n');

		// File that contains element of social media tag
		fs.readFile('src/partials/components/component-social-media.hbs', 'utf8', (err, file) => {
			const headerComment = file.split('\n')[0];
			const htmlBody = new JSDOM(file);

			const socialMediaEl = htmlBody.window.document.querySelector('.social-media-list') === null ? false : htmlBody.window.document.querySelector('.social-media-list');

			// Social media jsdom
			if (socialMediaEl) {
				socialMediaEl.innerHTML = `\n${socialLists}\n`;
			}

			const result = headerComment.concat('\n', htmlBody.window.document.documentElement.childNodes[1].innerHTML);

			fs.writeFileSync('src/partials/components/component-social-media.hbs', result);
		});
	};

	saveFooter = () => {
		const footerData = JSON.parse(fs.readFileSync('./src/data/component.json', 'utf8')).footer;
		fs.readFile('./src/partials/components/component-footer.hbs', 'utf8', (err, file) => {
			const headerComment = file.split('\n')[0];
			const htmlBody = new JSDOM(file);
			const {logoIndex, showClass, hideClass, logoClass, copyrightClass} = footerData.hooks;

			const copyrightEl = htmlBody.window.document.querySelector(`.${copyrightClass}`);
			const footerLogoEl = htmlBody.window.document.querySelector(`.${logoClass}`) === null ? false : htmlBody.window.document.querySelector(`.${logoClass}`);

			// Footer logo jsdom
			if (footerData.siteLogo.exist) {
				if (footerData.siteLogo.enabled) {
					footerLogoEl.children[logoIndex].classList.add(showClass);
					footerLogoEl.children[logoIndex].classList.remove(hideClass);
					footerLogoEl.children[logoIndex].setAttribute('src', `{{root}}${footerData.siteLogo.logo.src}`);
					footerLogoEl.children[logoIndex].setAttribute('width', footerData.siteLogo.logo.width);
					footerLogoEl.children[logoIndex].setAttribute('height', footerData.siteLogo.logo.height);
				} else {
					footerLogoEl.children[logoIndex].classList.add(hideClass);
					footerLogoEl.children[logoIndex].classList.remove(showClass);
				}
			}

			// Footer copyright text jsdom
			copyrightEl.innerHTML = footerData.copyrightText;

			const hbsFix = htmlBody.window.document.documentElement.childNodes[1].innerHTML.replace(/&gt;/g, '>');
			const result = headerComment.concat('\n', hbsFix);
			fs.writeFileSync('./src/partials/components/component-footer.hbs', result);
		});
	};

	saveSlideshow = data => {
		let slideshowTag = fs.readFileSync('./node_modules/blockit-builder/hooks/slideshow/slideshow-wrapper.hbs', 'utf8');
		if (fs.existsSync('./src/hooks/slideshow/slideshow-wrapper.hbs')) {
			slideshowTag = fs.readFileSync('./src/hooks/slideshow/slideshow-wrapper.hbs', 'utf8');
		}

		const slideshowAll = [
			{
				sectionName: 'component-slideshow-1',
				slides: data[0].slides,
			},
			{
				sectionName: 'component-slideshow-2',
				slides: data[1].slides,
			},
			{
				sectionName: 'component-slideshow-3',
				slides: data[2].slides,
			},
			{
				sectionName: 'component-slideshow-4',
				slides: data[3].slides,
			},
		];

		const slideshowExist = slideshowAll.filter(each => each.slides.length !== 0);
		const slideshowDelete = slideshowAll.filter(item => !slideshowExist.includes(item)).map(each => each.sectionName);

		data.forEach((each, index) => {
			if (each.slides.length !== 0) {
				const slideData = each.slides.map(item => item.text);
				const modifiedTag = slideshowTag.replace(/\{{(.*slide-id)\}}/g, slideData.join(' '));

				fs.writeFileSync('./node_modules/blockit-builder/templates/component-slideshow.json', JSON.stringify(slideshowExist, null, 4));
				fs.writeFileSync(`./src/partials/components/component-slideshow-${index + 1}.hbs`, modifiedTag);
			}
		});

		// Delete unused slideshow file
		slideshowDelete.forEach(each => {
			if (fs.existsSync(`./src/partials/components/${each}.hbs`)) {
				fs.unlinkSync(`./src/partials/components/${each}.hbs`);
			}
		});
	};

	createSettingsData = () => {
		fs.readFile('./src/data/setting.json', 'utf8', (err, data) => this.socket.emit('settingsData', JSON.parse(data)));
	};

	createFooterData = () => {
		fs.readFile('./src/partials/components/component-footer.hbs', 'utf8', (err, file) => {
			const data = {
				blocks: [
					{
						id: 'footer-content',
						type: 'code',
						data: {
							language: 'HTML',
							text: file,
						},
					},
				],
			};
			this.socket.emit('footerData', data);
		});
	};

	saveFooterEditor = data => {
		if (Object.keys(data).length !== 0) {
			fs.writeFileSync('./src/partials/components/component-footer.hbs', data);
		}
	};

	createSlideItem = slideId => {
		if (fs.existsSync('./src/hooks/slideshow/slideshow-item.hbs')) {
			// If custom hooks is available
			this.createSlideData('./src/hooks/slideshow/slideshow-item.hbs', slideId);
		} else {
			// If custom hooks is not available
			this.createSlideData('./node_modules/blockit-builder/hooks/slideshow/slideshow-item.hbs', slideId);
		}
	};

	createSlideData = (path, slideId) => {
		fs.readFile(path, 'utf8', (err, file) => {
			const data = {
				blocks: [
					{
						id: slideId,
						type: 'code',
						data: {
							language: 'HTML',
							text: file,
						},
					},
				],
			};
			this.socket.emit('slideItem', data);
		});
	};

	createComponentsData = () => {
		fs.readFile('./src/data/component.json', 'utf8', (err, data) => this.socket.emit('componentsData', JSON.parse(data)));
	};

	updateAuthorData = (oldData, newData, dataTag) => {
		const oldAuthor = JSON.parse(oldData).authors;
		const newAuthor = newData.authors;

		// Compare author name and avatar data
		const originalObj = oldAuthor.filter(this.utils.compareObj(newAuthor));
		const updatedObj = newAuthor.filter(this.utils.compareObj(oldAuthor));
		const compareResult = originalObj.concat(updatedObj);

		// Blog post object
		const postObj = {post: []};

		// Read all post and merge data to blog.json
		fs.readdir('./src/data/blog/posts', (err, files) => {
			files.forEach(file => {
				const data = JSON.parse(fs.readFileSync(`./src/data/blog/posts/${file}`, 'utf8'));
				if (compareResult.length !== 0) {
					Object.values(data).forEach(prop => {
						if (prop.id === compareResult[0].id && prop.name !== compareResult[1].name) {
							prop.name = compareResult[1].name;
							prop.avatar = compareResult[1].avatar;
						} else if (prop.id === compareResult[0].id && prop.avatar !== compareResult[1].avatar) {
							prop.name = compareResult[1].name;
							prop.avatar = compareResult[1].avatar;
						}
					});
					fs.writeFileSync(`./src/data/blog/posts/${file}`, JSON.stringify(data, null, 2));
				}

				postObj.post.push(data);
			});

			postObj.post.sort((a, b) => new Date(`${b.dateCreated} ${b.timeCreated}`) - new Date(`${a.dateCreated} ${a.timeCreated}`));
			fs.writeFileSync('./src/data/blog/blog.json', JSON.stringify(postObj, null, 2));

			this.postPaginatorPage(postObj, dataTag);
		});
	};

	// Components editor
	saveComponentsData = data => {
		fs.writeFileSync('./src/data/component.json', JSON.stringify(data, null, 2));
		this.saveEmail(data.contactMap.email);
		this.saveMap(data.contactMap.mapSrc);
		this.saveSlideshow(data.slideshow);
		this.saveFooter();
		this.saveSocialMedia();
	};
}
