// required plugins
import fs from 'fs'
import { execSync } from 'child_process'
import { JSDOM }  from 'jsdom'

// blockit method library function
export default class Methods {
    constructor(socket) {
        this.socket = socket
    }

    // dashboard data
    createDashboardData = () => {
        const data = {
            name: JSON.parse(fs.readFileSync('./package.json', 'utf-8')).title,
            version: JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version,
            theme: process.env.npm_package_title,
            pages: fs.readdirSync('../../src/pages', 'utf8').filter(file => file.match(/.(hbs)$/i)).filter(each => !each.match(/blog-page/g) && !each.match(/blog-find/g)).length,
            posts: fs.readdirSync('../../src/data/blog/posts', 'utf8').length,
            authors: JSON.parse(fs.readFileSync('../../src/data/setting.json', 'utf8')).authors.length
        }
        this.socket.emit('dashboardData', data) 
    }

    // pages data
    createPagesData = () => {
        fs.readdir('../../src/pages', (err, files) => {
            const data = files.filter(eachFile => eachFile.match(/.(hbs)$/i)).filter(each => !each.match(/blog-page/g) && !each.match(/blog-find/g)).map(file => {
                return {
                    page: file.split('.').slice(0, -1).join('.'),
                    title: fs.readFileSync(`../../src/pages/${file}`, 'utf8').match(/(?<=title:\s).*/g)[0],
                    date: fs.statSync(`../../src/pages/${file}`).mtime,
                    layout: fs.readFileSync(`../../src/pages/${file}`, 'utf8').match(/(?<=layout:\s).*/g)[0],
                    breadcrumb: fs.readFileSync(`../../src/pages/${file}`, 'utf8').match(/(?<=breadcrumb:\s).*/g)[0],
                    sections: fs.readFileSync(`../../src/pages/${file}`, 'utf8').match(/{{>(.*?)}}*/g).map(item => item.substring(4).slice(0, -3))
                }
            })
            this.socket.emit('pagesData', data)
        })
        fs.readFile('../../src/data/setting.json', 'utf8', (err, file) => {
            const data = JSON.parse(file).blog.asBlog !== false ? JSON.parse(file).blog.asBlog.split('.')[0] : false

            this.socket.emit('pagesCurrentBlog', data)
        })
    }

    // pages action data
    createPagesActionData = () => {
        fs.readdir('templates', (err, files) => {
            const sections = files.filter(eachFile => eachFile.match(/.(hbs)$/i))
            const exclusiveSectionsCheck = fs.readdirSync('../../src/hooks/sections', 'utf-8').filter(eachFile => !eachFile.includes('blog')).filter(eachFile => eachFile.match(/.(hbs)$/i))
            const exclusiveSections = this.utilCheckHook() && exclusiveSectionsCheck.length !== 0 ? exclusiveSectionsCheck : false
            const themeName = exclusiveSections !== false ? exclusiveSections[0].split('-')[1].charAt(0).toUpperCase() + exclusiveSections[0].split('-')[1].slice(1) : 'empty'

            const exclusiveData = {
                name: `Exclusive - ${themeName}`,
                sections: exclusiveSections,
                icon: 'fa-award'
            }

            const data = [
                {
                    name: 'Card',
                    sections: sections.filter(str => str.includes('card')),
                    icon: 'fa-sticky-note'
                },
                {
                    name: 'Client logo',
                    sections: sections.filter(str => str.includes('client-logo')),
                    icon: 'fa-shapes'
                },
                {
                    name: 'Contact',
                    sections: sections.filter(str => str.includes('contact')),
                    icon: 'fa-map-marker-alt'
                },
                {
                    name: 'Content',
                    sections: sections.filter(str => str.includes('content')),
                    icon: 'fa-file-alt'
                },
                {
                    name: 'Counter',
                    sections: sections.filter(str => str.includes('counter')),
                    icon: 'fa-hourglass-half'
                },
                {
                    name: 'Faq',
                    sections: sections.filter(str => str.includes('faq')),
                    icon: 'fa-question'
                },
                {
                    name: 'Feature',
                    sections: sections.filter(str => str.includes('feature')),
                    icon: 'fa-cubes'
                },
                {
                    name: 'Gallery',
                    sections: sections.filter(str => str.includes('gallery')),
                    icon: 'fa-images'
                },
                {
                    name: 'Pricing',
                    sections: sections.filter(str => str.includes('pricing')),
                    icon: 'fa-money-bill-wave'
                },
                {
                    name: 'Slideshow',
                    sections: sections.filter(str => str.includes('slideshow')),
                    icon: 'fa-layer-group'
                },
                {
                    name: 'Team',
                    sections: sections.filter(str => str.includes('team')),
                    icon: 'fa-users'
                },
                {
                    name: 'Testimonial',
                    sections: sections.filter(str => str.includes('testimonial')),
                    icon: 'fa-comment-dots'
                },
                {
                    name: 'Timeline',
                    sections: sections.filter(str => str.includes('timeline')),
                    icon: 'fa-history'
                },
                {
                    name: 'Utility',
                    sections: sections.filter(str => str.includes('utility')),
                    icon: 'fa-screwdriver-wrench'
                }
            ]

            exclusiveSections !== false && data.splice(5, 0, exclusiveData)
            this.socket.emit('pagesActionData', data)
        })
    }

    pagesDeletePage = (nameFile, sections) => {
        fs.readFile(`../../src/pages/${nameFile}.hbs`, 'utf8', (err, file) => {
            const blogStatus = file.match(/(?<=as_blog:\s).*/g)[0]
            if(blogStatus == 'false') {
                fs.unlinkSync(`../../dist/${nameFile}.html`)
                fs.unlinkSync(`../../src/pages/${nameFile}.hbs`)
                if(sections !== undefined) {
                    sections.forEach(item => !item.includes('section-slideshow') && fs.unlinkSync(`../../src/partials/sections/${item}.hbs`))
                }
            } else {
                fs.unlinkSync(`../../dist/${nameFile}.html`)
                fs.unlinkSync(`../../src/pages/${nameFile}.hbs`)
                fs.unlinkSync('../../dist/blog-find.html')
                fs.unlinkSync('../../src/pages/blog-find.hbs')
                fs.readdir('../../src/pages', (err, files) => {
                    files.filter(eachFile => eachFile.match(/.(hbs)$/i)).filter(each => each.match(/blog-page/g)).forEach(each => {
                        fs.unlinkSync(`../../dist/${each.split('.').slice(0, -1)[0]}.html`)
                        fs.unlinkSync(`../../src/pages/${each}`)
                    })
                })

                // set back "false" at asBlog setting.json
                fs.readFile('../../src/data/setting.json', 'utf8', (err, file) => {
                    const settingData = JSON.parse(file)
                    settingData.blog.asBlog = false
                    fs.writeFileSync('../../src/data/setting.json', JSON.stringify(settingData, null, 2))

                    this.socket.emit('pagesCurrentBlog', settingData.blog.asBlog)
                })

                // set back "false" blogPath value in some utilities js
                fs.readFile('../../src/assets/js/utilities/breadcrumb.js', 'utf8', (err, file) => {
                    const pathChange = file.replace(/(?<=this\.blogPath\s\=\s).*/g, false)
                    fs.writeFileSync('../../src/assets/js/utilities/breadcrumb.js', pathChange)
                })
                fs.readFile('../../src/assets/js/utilities/active-menu.js', 'utf8', (err, file) => {
                    const pathChange = file.replace(/(?<=this\.blogPath\s\=\s).*/g, false)
                    fs.writeFileSync('../../src/assets/js/utilities/active-menu.js', pathChange)
                })
            }
        })
    }

    pagesSavePage = (nameFile, blogStatus, data) => {
        if(!blogStatus) {
            fs.writeFileSync(`../../src/pages/${nameFile}.hbs`, data)
        } else {
            fs.readFile('../../src/data/setting.json', 'utf8', (err, file) => {
                const settingData = JSON.parse(file)

                // write asBlog file name in setting.json
                settingData.blog.asBlog = `${nameFile}.hbs`
                fs.writeFileSync('../../src/data/setting.json', JSON.stringify(settingData, null, 2))

                // write blogPath value in some utilities js
                fs.readFile('../../src/assets/js/utilities/breadcrumb.js', 'utf8', (err, file) => {
                    const pathChange = file.replace(/(?<=this\.blogPath\s\=\s).*/g, `'${nameFile}.html'`)
                    fs.writeFileSync('../../src/assets/js/utilities/breadcrumb.js', pathChange)
                })
                fs.readFile('../../src/assets/js/utilities/active-menu.js', 'utf8', (err, file) => {
                    const pathChange = file.replace(/(?<=this\.blogPath\s\=\s).*/g, `'${nameFile}.html'`)
                    fs.writeFileSync('../../src/assets/js/utilities/active-menu.js', pathChange)
                })

                // change frontmatter function
                function changeFrontMatter(path) {
                    const file = fs.readFileSync(path, 'utf8')
                    const layoutChange = file.replace(/(?<=layout:\s).*/g, data.layout)
                    const titleChange = layoutChange.replace(/(?<=title:\s).*/g, data.title)
                    const breadcrumbChange = titleChange.replace(/(?<=breadcrumb:\s).*/g, data.breadcrumb)
                    fs.writeFileSync(path, breadcrumbChange)
                }

                // change frontmatter in blog, blog-single, and blog-find
                fs.existsSync('../../src/hooks/pages/blog.hbs') ? changeFrontMatter('../../src/hooks/pages/blog.hbs') : changeFrontMatter('hooks/pages/blog.hbs')
                fs.existsSync('../../src/hooks/pages/blog-single.hbs') ? changeFrontMatter('../../src/hooks/pages/blog-single.hbs') : changeFrontMatter('hooks/pages/blog-single.hbs')
                fs.existsSync('../../src/hooks/pages/blog-find.hbs') ? changeFrontMatter('../../src/hooks/pages/blog-find.hbs') : changeFrontMatter('hooks/pages/blog-find.hbs')

                // change frontmatter in each blog post
                fs.readdir('../../src/pages/blog', (err, files) => {
                    files.forEach(post => changeFrontMatter(`../../src/pages/blog/${post}`))
                })

                // read all post file, data tag and process for create blog page
                fs.readFile('../../src/data/blog/blog.json', 'utf8', (err, file) => {
                    const postObj = JSON.parse(file)
                    const dataTag = {
                        defaultPage: fs.existsSync('../../src/hooks/pages/blog.hbs') ? fs.readFileSync('../../src/hooks/pages/blog.hbs', 'utf8') : fs.readFileSync('hooks/pages/blog.hbs', 'utf8'),                        
                        singlePage: fs.existsSync('../../src/hooks/pages/blog-single.hbs') ? fs.readFileSync('../../src/hooks/pages/blog-single.hbs', 'utf8') : fs.readFileSync('hooks/pages/blog-single.hbs', 'utf8'),
                        defaultSection: fs.existsSync('../../src/hooks/sections/section-blog.hbs') ? fs.readFileSync('../../src/hooks/sections/section-blog.hbs', 'utf8') : fs.readFileSync('hooks/sections/section-blog.hbs', 'utf8'),
                        singleSection: fs.existsSync('../../src/hooks/sections/section-blog-single.hbs') ? fs.readFileSync('../../src/hooks/sections/section-blog-single.hbs', 'utf8') : fs.readFileSync('hooks/sections/section-blog-single.hbs', 'utf8')
                    }

                    this.postPaginatorPage(postObj, dataTag)
                })

                // write blog-find.hbs page
                const pathBlogFind = fs.existsSync('../../src/hooks/pages/blog-find.hbs') ? '../../src/hooks/pages/blog-find.hbs' : 'hooks/pages/blog-find.hbs'
                fs.readFile(pathBlogFind, 'utf8', (err, file) => {
                    const layoutChange = file.replace(/(?<=layout:\s).*/g, data.layout)
                    const titleChange = layoutChange.replace(/(?<=title:\s).*/g, data.title)
                    const breadcrumbChange = titleChange.replace(/(?<=breadcrumb:\s).*/g, data.breadcrumb)

                    fs.writeFileSync('../../src/pages/blog-find.hbs', breadcrumbChange)
                })
            })
        }
    }

    readSectionData = nameFile => {
        const path = nameFile.split('-').length >= 4 ? `../../src/partials/sections/${nameFile}.hbs` : `templates/${nameFile}.hbs`
        fs.readFile(path, 'utf8', (err, file) => {
            const data = {
                blocks: [
                    {
                        id: nameFile,
                        type: "code",
                        data: {
                            language: "HTML",
                            text: file
                        }
                    }
                ]
            }
            this.socket.emit('resultSectionData', data)
        })
    }

    createSectionData = (sections, deletedSections) => {
        sections.forEach(item => {
            fs.readFile(`templates/${item.reference}.hbs`, 'utf8', (err, file) => {
                if(file.includes('<!-- slideshow content begin -->')) {
                    fs.writeFileSync(`../../src/partials/sections/${item.reference}.hbs`, item.updateData !== false ? item.updateData : file)
                } else {
                    fs.writeFileSync(`../../src/partials/sections/${item.reference}-${item.id}.hbs`, item.updateData !== false ? item.updateData : file)
                }
            })
        })
        if(deletedSections.length !== 0 || deletedSections[0] !== false) {
            deletedSections.forEach(item => {
                try {
                    if(fs.existsSync(`../../src/partials/sections/${item}.hbs`)) {
                        fs.unlinkSync(`../../src/partials/sections/${item}.hbs`)
                    }
                } catch(err) {
                    console.error(`file not found: ${err}`)
                }
            })
        }
    }

    // post editor
    createPostsData = () => {
        fs.readdir('../../src/data/blog/posts', (err, files) => {
            const data = files.map(file => {
                const raw = JSON.parse(fs.readFileSync(`../../src/data/blog/posts/${file}`, 'utf8'))
                return {
                    title: raw.title,
                    link: raw.link,
                    dateCreated: raw.dateCreated,
                    dateModified: raw.dateModified,
                    timeCreated: raw.timeCreated,
                    timeModified: raw.timeModified,
                    author: raw.author,
                    category: raw.category
                }
            })
            this.socket.emit('postsData', data)
        })
    }

    createPostsActionData = (nameFile) => {
        const settingData = JSON.parse(fs.readFileSync('../../src/data/setting.json', 'utf8'))
        const postData = nameFile !== 'empty' ? JSON.parse(fs.readFileSync(`../../src/data/blog/posts/${nameFile}.json`, 'utf8')) : null
        const data = {
            authors: {
                current: postData !== null ? postData.author.name : '',
                select: settingData.authors
            },
            categories: {
                current: postData !== null ? postData.category : '',
                select: settingData.blog.categories
            },
            currentTags: postData !== null ? postData.tags : '',
            currentImage: postData !== null ? postData.image : false,
            title: postData !== null ? postData.title : '',
            dateCreated: postData !== null ? postData.dateCreated : '',
            timeCreated: postData !== null ? postData.timeCreated : '',
            blocks: postData !== null ? postData.blocks : '',
        }
        this.socket.emit('postsActionData', data)
    }

    postPaginatorWidget = (items, current_page, per_page_items, settingData) => {
        let page = current_page || 1,
        per_page = per_page_items || 10,
        offset = (page - 1) * per_page,

        paginatedItems = items.slice(offset).slice(0, per_page_items),
        total_pages = Math.ceil(items.length / per_page);

        return {
            page: page,
            per_page: per_page,
            prev_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total_post: items.length,
            total_pages: total_pages,
            display_author: settingData.blog.displayAuthor,
            data: paginatedItems
            
        }
    }

    postPaginatorPage = (postObj, dataTag) => {
        // post per page in settings page
        const settingData = JSON.parse(fs.readFileSync('../../src/data/setting.json', 'utf8'))

        // read and send post list data
        setTimeout(() => {
            const displayPost = settingData.blog.postPerPage
            const dataSend = this.postPaginatorWidget(postObj.post, 1, displayPost, settingData)
            const totalPages = dataSend.total_pages

            // create blog-page data and hbs
            if(settingData.blog.asBlog !== false) {
                let count = 1
                while (count <= totalPages) {
                    // blog page data json
                    const nameFile = `blog-page-${count}`
                    const dataRes = this.postPaginatorWidget(postObj.post, count, displayPost, settingData)
                    fs.writeFileSync(`../../src/data/blog/${nameFile}.json`, JSON.stringify(dataRes, null, 2))

                    // blog page and section hbs
                    const pageChange = dataTag.defaultPage.replace(/(?<={{> section-blog-)(.*?)(?= }})/g, count)
                    if(count == 1) {
                        fs.writeFileSync(`../../src/pages/${settingData.blog.asBlog}`, pageChange)
                    } else {
                        fs.writeFileSync(`../../src/pages/blog-page-${count}.hbs`, pageChange)
                    }
                    const sectionFirstChange = dataTag.defaultSection.replace(/{{#each(.*?).data}}/g, `{{#each blog-page-${count}.data}}`)
                    const sectionSecondChange = sectionFirstChange.replace(/{{#if(.*?).display_author}}/g, `{{#if @root.blog-page-${count}.display_author}}`)
                    fs.writeFileSync(`../../src/partials/blog/section-blog-${count}.hbs`, sectionSecondChange)

                    count++
                }
            }

            // delete unused blog-page-number
            fs.readdir('../../src/data/blog', (err, files) => {
                const deleteFiles = files.filter(f => f.match(/(blog-page-)/g))
                let startFiles = totalPages + 1
                let totalFiles = deleteFiles.length

                while (startFiles <= totalFiles) {
                    if(fs.existsSync(`../../src/data/blog/blog-page-${startFiles}.json`)) fs.unlinkSync(`../../src/data/blog/blog-page-${startFiles}.json`)
                    if(fs.existsSync(`../../src/pages/blog-page-${startFiles}.hbs`)) fs.unlinkSync(`../../src/pages/blog-page-${startFiles}.hbs`)
                    if(fs.existsSync(`../../dist/blog-page-${startFiles}.html`)) fs.unlinkSync(`../../dist/blog-page-${startFiles}.html`)

                    startFiles++
                }
            })

            // delete unused section-blog-number
            fs.readdir('../../src/partials/blog', (err, files) => {
                const usedSections = files.filter(each => each.match(/section-blog/g)).sort((a, b) => a.length - b.length).filter((each, index) => index < totalPages)
                const unusedSections = files.filter(each => each.match(/section-blog/g)).filter(each => !usedSections.includes(each))

                unusedSections.forEach(section => {
                    if(fs.existsSync(`../../src/partials/blog/${section}`)) fs.unlinkSync(`../../src/partials/blog/${section}`)
                })
            })

            // create data-blog.json
            const latestPost = []
            for (let i = 0; i < 3; i++) {
                latestPost.push({title: postObj.post[i].title, link: postObj.post[i].link, date: postObj.post[i].dateCreated})
            }

            const firstRawTag = postObj.post.map((e) => e.tags)
            const secondRawTag = firstRawTag.filter(tag => tag).reduce((acc, tag) => acc.concat(tag), []).map(tag => tag)
            const tagLists = secondRawTag.filter((item, pos) => secondRawTag.indexOf(item) == pos)

            const firstRawCategory = postObj.post.map((e) => e.category)
            const categoryLists = firstRawCategory.filter((item, pos) => firstRawCategory.indexOf(item) == pos)

            const asBlogValue = settingData.blog.asBlog !== false ? `${settingData.blog.asBlog.split('.').slice(0, -1)}.html` : false
            const blogJsObj = {asBlog: asBlogValue, totalPages, tagLists, latestPost}
            fs.writeFileSync('../../dist/blog/data/data-blog.json', JSON.stringify(blogJsObj))

            // create data-category.json
            fs.readFile('../../src/data/blog/blog.json', 'utf8', (err, buffer) => {
                const data = JSON.parse(buffer)
                const categoryData = categoryLists.map(item => this.createCategoryPost(data.post, item))
                fs.writeFileSync('../../dist/blog/data/data-category.json', JSON.stringify(categoryData))
            })

            // create data-category.json & data-tag.json
            fs.readFile('../../src/data/blog/blog.json', 'utf8', (err, buffer) => {
                const data = JSON.parse(buffer)
                const tagData = tagLists.map(item => this.createTagPost(data.post, item))
                tagData.forEach(item => {
                    item.posts.forEach(e => {
                        delete e.tags
                        delete e.blocks
                    })
                })
                fs.writeFileSync('../../dist/blog/data/data-tag.json', JSON.stringify(tagData))
            })
        },600)
    }

    createCategoryPost = (array, categoryName) => {
        const categoryResult = array.filter(post => post.category === categoryName)
        categoryResult.forEach((post) => {
            post.content = this.utilTrimString(post.blocks[0].data.text)
            post.date = post.dateCreated
            delete post.author.id
            delete post.blocks
            delete post.share
            delete post.category
            delete post.tags
            delete post.dateCreated
            delete post.timeCreated
            if(!post.image) delete post.image
        })

        return {
            category: categoryName,
            totalPost: categoryResult.length,
            posts : categoryResult
        }
    }

    createTagPost = (array, tagName) => {
        const tagResult = []
        array.forEach(post => {
            post.tags.filter(tag => {
                if(tag === tagName) tagResult.push(post)
            })
        })

        tagResult.forEach((post) => {
            post.content = this.utilTrimString(post.blocks[0].data.text)
            post.date = post.dateCreated !== undefined ? post.dateCreated : post.date
            delete post.author.id
            delete post.share
            delete post.dateCreated
            delete post.timeCreated
            if(!post.image) delete post.image
        })

        return {
            tag: tagName,
            totalPost: tagResult.length,
            posts : tagResult
        }
    }

    postCreatePage = dataTag => {
        fs.readdir('../../src/data/blog/posts', (err, files) => {
            const postObj = {
                post: files.map(file => {
                    return JSON.parse(fs.readFileSync(`../../src/data/blog/posts/${file}`, 'utf8'))
                })
            }
            postObj.post.sort((a, b) => new Date(`${b.dateCreated} ${b.timeCreated}`) - new Date(`${a.dateCreated} ${a.timeCreated}`))

            fs.readFile('../../src/data/blog/blog.json', 'utf-8', (err, oldBlog) => {
                const reference = JSON.parse(oldBlog).post.map(post => {
                    delete post.dateModified
                    delete post.timeModified
                    return post
                })
                const modified = postObj.post.map(post => {
                    delete post.dateModified
                    delete post.timeModified
                    return post
                })

                // if there any change then write blog.json
                if(JSON.stringify(reference) !== JSON.stringify(modified)) {
                    fs.writeFileSync('../../src/data/blog/blog.json', JSON.stringify(postObj, null, 2))
                }
            })

            this.postPaginatorPage(postObj, dataTag)
        })
    }

    postsSaveContent = async (nameFile, dataPost, dataTag) => {
        fs.unlink('../../dist/blog/*.html', err => {
            fs.writeFileSync(`../../src/data/blog/posts/${nameFile}.json`, JSON.stringify(dataPost, null, 2))

            const sectionSingleChange = dataTag.singleSection.replace(/(post-title)/g, nameFile)
            fs.writeFileSync(`../../src/partials/blog/post-title-${nameFile}.hbs`, sectionSingleChange)

            const sectionPageChange = dataTag.singlePage.replace(/(?<={{> post-title)(.*?)(?= }})/g, `-${nameFile}`)
            fs.writeFileSync(`../../src/pages/blog/${nameFile}.hbs`, sectionPageChange)

            this.postCreatePage(dataTag)
        })
    }

    postsDeletePost = (nameFile, dataTag) => {
        const files = [
            `../../src/data/blog/posts/${nameFile}.json`, 
            `../../src/pages/blog/${nameFile}.hbs`, 
            `../../src/partials/blog/post-title-${nameFile}.hbs`, 
            `../../dist/blog/${nameFile}.html`
        ]
        return Promise.all(files.map(each => {
            fs.unlinkSync(each)
        }))
        .then(
            this.socket.emit('deleteDone', 'success'),
            this.postCreatePage(dataTag)
        )
    }

    createEditorData = nameFile => {
        fs.readFile(`../../src/data/blog/posts/${nameFile}.json`, 'utf8', (err, data) => this.socket.emit('editorData', data))
    }

    postsTagSources = () => {
        const tagData = {
            defaultPage: fs.existsSync('../../src/hooks/pages/blog.hbs') ? fs.readFileSync('../../src/hooks/pages/blog.hbs', 'utf8') : fs.readFileSync('hooks/pages/blog.hbs', 'utf8'),
            singlePage: fs.existsSync('../../src/hooks/pages/blog-single.hbs') ? fs.readFileSync('../../src/hooks/pages/blog-single.hbs', 'utf8') : fs.readFileSync('hooks/pages/blog-single.hbs', 'utf8'),
            defaultSection: fs.existsSync('../../src/hooks/sections/section-blog.hbs') ? fs.readFileSync('../../src/hooks/sections/section-blog.hbs', 'utf8') : fs.readFileSync('hooks/sections/section-blog.hbs', 'utf8'),
            singleSection: fs.existsSync('../../src/hooks/sections/section-blog-single.hbs') ? fs.readFileSync('../../src/hooks/sections/section-blog-single.hbs', 'utf8') : fs.readFileSync('hooks/sections/section-blog-single.hbs', 'utf8')
        }
        this.socket.emit('tagSourcesData', tagData)
    }

    findBlogTitle = (object, key, value) => {
        if (object.hasOwnProperty(key) && object[key] === value) {
            return object;
        }
    
        for (const k of Object.keys(object)) {
            if (typeof object[k] === "object") {
                const o = this.findBlogTitle(object[k], key, value)
                if (o !== null && typeof o !== 'undefined')
                    return o;
            }
        }
    
        return null
    }

    createBlogTitle = (data) => {
        if(this.findBlogTitle(data, 'link', 'blog/page-1.html') !== null) {
            const blogTitle = this.findBlogTitle(data, 'link', 'blog/page-1.html').title

            fs.readdir('../../src/pages/blog', (err, files) => {
                files.forEach(each => {
                    fs.readFile(`../../src/pages/blog/${each}`, 'utf8', (err, data) => {
                        const newAttribute = data.replace(/(?<=data-title=")([^"]*)/g, blogTitle.toLowerCase())
                        const newTitle = newAttribute.replace(/(?<=title:\s).*/g, blogTitle)
                        fs.writeFileSync(`../../src/pages/blog/${each}`, newTitle)
                    })
                })
            })
        }
    }

    // navigation editor
    createNavigationData = () => {
        const data = {
            nav: JSON.parse(fs.readFileSync('../../src/data/navigation.json', 'utf8')).nav,
            select: fs.readdirSync('../../src/pages', 'utf8').filter(each => !each.match(/blog-page/g) && !each.match(/blog-find/g)).filter(file => file.match(/.(hbs)$/i))
        }
        this.socket.emit('navigationData', data)
    }

    saveNavigationData = data => {
        fs.writeFileSync('../../src/data/navigation.json', JSON.stringify(data, null, 2))
        this.createBlogTitle(data)
    }

    assetsUpload = (buffer, nameFile) => {
        fs.writeFile(`../../dist/img/user/${nameFile}`, buffer, err => {
            this.socket.emit('uploadDone', `img/user/${nameFile}`)
        })
    }

    assetsDelete = nameFile => {
        fs.unlink(`../../dist/img/user/${nameFile}`, err => {
            this.socket.emit('deleteDone', 'success')
        })
    }

    // settings editor
    saveSettingsData = (data, dataTag) => {
        // colors setting
        fs.readFile('../../src/assets/scss/_colors.scss', 'utf8', (err, file) => {
            const temp = file
            const primaryColorChange = temp.replace(/(?<=primary:\s)([^;]*)/g, data.colors.primaryColor)
            const secondaryColorChange = primaryColorChange.replace(/(?<=secondary:\s)([^;]*)/g, data.colors.secondaryColor)
            const successColorChange = secondaryColorChange.replace(/(?<=success:\s)([^;]*)/g, data.colors.successColor)
            const infoColorChange = successColorChange.replace(/(?<=info:\s)([^;]*)/g, data.colors.infoColor)
            const warningColorChange = infoColorChange.replace(/(?<=warning:\s)([^;]*)/g, data.colors.warningColor)
            const dangerColorChange = warningColorChange.replace(/(?<=danger:\s)([^;]*)/g, data.colors.dangerColor)
            const lightColorChange = dangerColorChange.replace(/(?<=light:\s)([^;]*)/g, data.colors.lightColor)
            const darkColorChange = lightColorChange.replace(/(?<=dark:\s)([^;]*)/g, data.colors.darkColor)
            const backgroundColorChange = darkColorChange.replace(/(?<=body-bg:\s)([^;]*)/g, data.colors.backgroundColor)
            const textColorChange = backgroundColorChange.replace(/(?<=body-color:\s)([^;]*)/g, data.colors.textColor)
            const linkColorChange = textColorChange.replace(/(?<=link-color:\s)([^;]*)/g, data.colors.linkColor)

            if(temp !== linkColorChange) {
                fs.writeFileSync('../../src/assets/scss/_colors.scss', linkColorChange)
            }
        })

        fs.readFile('../../src/data/setting.json', 'utf-8', (err, oldData) => {
            // write setting.json file
            if(oldData !== JSON.stringify(data, null, 2)) fs.writeFileSync('../../src/data/setting.json', JSON.stringify(data, null, 2))

            // recreate blog pagination page
            this.postCreatePage(dataTag)

            // update author and avatar data
            this.updateAuthorData(oldData, data, dataTag)

            // minify assets
            this.runMinifying(oldData, data)
        })
    }

    runMinifying = (oldData, data) => {
        const assetsCss = data.optimization.minifyAssets.css
        const assetsJs = data.optimization.minifyAssets.js
        const dataCompareCss = JSON.parse(oldData).optimization.minifyAssets.css !== assetsCss
        const dataCompareJs = JSON.parse(oldData).optimization.minifyAssets.js !== assetsJs

        if(dataCompareCss && assetsCss) {
            execSync("gulp -S --f index.mjs minifyCss")
        } else if(dataCompareCss && !assetsCss) {
            execSync("gulp -S --f index.mjs compileCss")
        }

        if(dataCompareJs && assetsJs) {
            execSync("gulp -S --f index.mjs minifyJs")
        } else if(dataCompareJs && !assetsJs) {
            execSync("gulp -S --f index.mjs compileJs")
        }
    }

    saveEmail = data => {
        fs.readFile('../../dist/sendmail.php', 'utf8', (err, phpFile) => {
            const currentEmail = String(phpFile.match(/(?<=emailTo = ).*/g))
            if(currentEmail !== `"${data}";`) {
                const emailChange = phpFile.replace(/(?<=emailTo = ).*/g, `"${data}";`)
                fs.writeFileSync('../../dist/sendmail.php', emailChange)
            }
        })
    }

    saveMap = iframe => {
        fs.readdir('../../src/partials/sections', (err, files) => {
            const sectionContacts = files.filter(eachFile => eachFile.match(/section-contact/g))
            sectionContacts.forEach(each => {
                fs.readFile(`../../src/partials/sections/${each}`, 'utf8', (err, data) => {
                    const headerComment = data.split('\n')[0]
                    const htmlBody = new JSDOM(data)

                    const mapIframeEl = htmlBody.window.document.querySelector('iframe')
                    if(mapIframeEl !== null) {
                        mapIframeEl.src = iframe
                        const result = headerComment.concat('\n', htmlBody.window.document.documentElement.childNodes[1].innerHTML)
                        fs.writeFileSync(`../../src/partials/sections/${each}`, result)
                    }
                })
            })
        })
    }

    saveSocialMedia = () => {
        fs.existsSync('../src/hooks/components/social-media.mjs')
            ? import('../../src/hooks/components/social-media.mjs').then(module => module.default()) // custom hooks is available
            : import('../hooks/components/social-media.mjs').then(module => module.default()) // custom hooks is not available
    }

    saveFooter = () => {
        fs.existsSync('../src/hooks/components/footer.mjs')
            ? import('../../src/hooks/components/footer.mjs').then(module => module.default()) // custom hooks is available
            : import('../hooks/components/footer.mjs').then(module => module.default()) // custom hooks is not available
    }

    saveSlideshow = data => {
        let slideshowTag = fs.readFileSync('hooks/slideshow/slideshow-wrapper.hbs', 'utf8')
        if(fs.existsSync('../src/hooks/slideshow/slideshow-wrapper.hbs')) {
            slideshowTag = fs.readFileSync('../src/hooks/slideshow/slideshow-wrapper.hbs', 'utf8')
        }

        const slideshowAll = ['section-slideshow-1.hbs', 'section-slideshow-2.hbs', 'section-slideshow-3.hbs', 'section-slideshow-4.hbs']
        const slideshowExist = data.map((each, index) => each.slides.length !== 0 ? index : false).filter(each => each !== false).map(each => `section-slideshow-${each+1}.hbs`)
        const slideshowDelete = slideshowAll.filter(x => !slideshowExist.includes(x))

        data.forEach((each, index) => {
            if(each.slides.length !== 0) {
                const slideData = each.slides.map(item => item.text)
                const modifiedTag = slideshowTag.replace(/\{{(.*slide-id)\}}/g, slideData.join(' '))
                fs.writeFileSync(`templates/section-slideshow-${index + 1}.hbs`, modifiedTag)
                fs.writeFileSync(`../../src/partials/sections/section-slideshow-${index + 1}.hbs`, modifiedTag)
            }
        })
        
        // delete unused slideshow file
        fs.readdir('templates', (err, files) => {
            files.filter(item => slideshowDelete.includes(item)).forEach(each => {
                fs.unlinkSync(`templates/${each}`)
                fs.unlinkSync(`../../src/partials/sections/${each}`)
            })
        })
    }

    createSettingsData = () => {
        fs.readFile('../../src/data/setting.json', 'utf8', (err, data) => this.socket.emit('settingsData', JSON.parse(data)))
    }

    createFooterData = () => {
        fs.readFile('../src/partials/components/component-footer.hbs', 'utf8', (err, file) => {
            const data = {
                blocks: [
                    {
                        id: "footer-content",
                        type: "code",
                        data: {
                            language: "HTML",
                            text: file
                        }
                    }
                ]
            }
            this.socket.emit('footerData', data)
        })
    }

    saveFooterEditor = data => {
        if(Object.keys(data).length !== 0) {
            fs.writeFileSync('../src/partials/components/component-footer.hbs', data)
        }
    }

    createSlideItem = slideId => {
        if(fs.existsSync('../src/hooks/slideshow/slideshow-item.hbs')) {
            // if custom hooks is available
            this.createSlideData('../src/hooks/slideshow/slideshow-item.hbs', slideId)
        } else {
            // if custom hooks is not available
            this.createSlideData('hooks/slideshow/slideshow-item.hbs', slideId)
        }
    }

    createSlideData = (path, slideId) => {
        fs.readFile(path, 'utf8', (err, file) => {
            const data = {
                blocks: [
                    {
                        id: slideId,
                        type: "code",
                        data: {
                            language: "HTML",
                            text: file
                        }
                    }
                ]
            }
            this.socket.emit('slideItem', data)
        })
    }

    createComponentsData = () => {
        fs.readFile('../../src/data/component.json', 'utf8', (err, data) => this.socket.emit('componentsData', JSON.parse(data)))
    }

    updateAuthorData = (oldData, newData, dataTag) => {
        const oldAuthor = JSON.parse(oldData).authors
        const newAuthor = newData.authors

        // compare author name and avatar data
        const originalObj = oldAuthor.filter(this.utilCompareObj(newAuthor))
        const updatedObj = newAuthor.filter(this.utilCompareObj(oldAuthor))
        const compareResult = originalObj.concat(updatedObj)

        // blog post object
        const postObj = { post: [] }

        // read all post and merge data to blog.json
        fs.readdir('../../src/data/blog/posts', (err, files) => {
            files.forEach(file => {
                let data = JSON.parse(fs.readFileSync(`../../src/data/blog/posts/${file}`, 'utf8'))
                if(compareResult.length !== 0) {
                    Object.values(data).find(prop => {
                        if(prop.id === compareResult[0].id && prop.name !== compareResult[1].name) {
                            prop.name = compareResult[1].name, 
                            prop.avatar = compareResult[1].avatar
                        } else if(prop.id === compareResult[0].id && prop.avatar !== compareResult[1].avatar) {
                            prop.name = compareResult[1].name, 
                            prop.avatar = compareResult[1].avatar
                        }
                    })
                    fs.writeFileSync(`../../src/data/blog/posts/${file}`, JSON.stringify(data, null, 2))
                }
                postObj.post.push(data)
            })

            postObj.post.sort((a, b) => new Date(`${b.dateCreated} ${b.timeCreated}`) - new Date(`${a.dateCreated} ${a.timeCreated}`))
            fs.writeFileSync('../../src/data/blog/blog.json', JSON.stringify(postObj, null, 2))

            this.postPaginatorPage(postObj, dataTag)
        })
    }

    // components editor
    saveComponentsData = data => {
        fs.writeFileSync('../../src/data/component.json', JSON.stringify(data, null, 2))
        this.saveEmail(data.contactMap.email)
        this.saveMap(data.contactMap.mapSrc)
        this.saveSlideshow(data.slideshow)
        this.saveFooter()
        this.saveSocialMedia()
    }

    // utility
    utilCompareObj = otherArray => {
        return function(current){
            return otherArray.filter(function(other){
                return other.name == current.name &&
                    other.email == current.email &&
                    other.role == current.role &&
                    other.avatar == current.avatar
            }).length == 0;
        }
    }

    utilTrimString(string) {
        let cut = string.indexOf(' ', 150)
        if(cut == -1) return string
        return string.substring(0, cut) + ' ...'
    }

    utilCheckHook() {
        const isExist = fs.readdirSync('../../src/hooks', 'utf-8').length !== 0 ? true : false
        return isExist;
    }

    utilEnvPort = () => {
        const data = JSON.parse(fs.readFileSync('../../src/hooks/settings/env.json', 'utf-8'))
        this.socket.emit('envPortData', data) 
    }
}