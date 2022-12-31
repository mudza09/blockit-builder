/* blog.js | https://www.indonez.com | Indonez | MIT License */
class Blog {
    constructor() {
        this.articleWrap = document.querySelectorAll('article')
        this.tagWrap = document.querySelector('.widget-tag')
        this.categoryWrap = document.querySelector('.widget-categories')
        this.latestWrap = document.querySelector('.widget-latest')
        this.urlParams = window.location.href.split( '/' )
        this.currentPage = this.urlParams.pop()
    }

    init() {
        if(document.querySelector('[data-title="blog"]') || document.querySelector('[data-title="blog-find"]')) {
            this.getData()
            .then(responses => {
                return Promise.all(responses.map(response => response.json()))
            })
            .then(data => {                
                this.createCategoryWidget(data)
                this.createLatestWidget(data)
                this.createTagWidget(data)
                this.createFindPage(data)
                this.createPagination(data)
                this.searchForm(data)
            })

            this.contentTruncate()
            this.trimLatestWidget()
        }

        this.removeUntagged()
    }

    getData() {
        return Promise.all([
            fetch('blog/data/data-blog.json'),
            fetch('blog/data/data-category.json'),
            fetch('blog/data/data-tag.json')
        ])
    }

    contentTruncate() {
        this.articleWrap.forEach(txt => {
            let currentText = txt.querySelector('p')
            let truncateText = this.trimLongTitle(currentText.innerText, 150)

            currentText.innerText = truncateText
        })
    }

    createCategoryWidget(data) {
        if(document.querySelector('.widget-categories') !== null) {
            data[1].sort((a, b) => {
                if(a.category < b.category) return -1
                if(a.category > b.category) return 1
                return 0
            })
            const categoryFilter = data[1].filter(item => item.category !== 'Uncategorized')
            categoryFilter.forEach(eachData => {
                this.categoryWrap.innerHTML += `<li><a href="blog-find.html?category=${eachData.category.toLowerCase()}" class="link-dark text-decoration-none d-flex justify-content-between align-items-center">${eachData.category}<span class="badge rounded-1">${eachData.totalPost}</span></a></li>`
            })
        }
    }

    createLatestWidget(data) {
        const path = location.pathname.split('/')
        path[path.length-1] = 'blog'

        if(document.querySelector('.widget-latest') !== null) {
            data[0].latestPost.forEach(each => {
                this.latestWrap.innerHTML += `
                <li class="list-group-item bg-transparent px-0">
                    <a href="${path.join('/')}/${each.link}" class="link-dark text-decoration-none">${this.trimLongTitle(each.title, 55)}</a><br>
                    <small class="text-muted"><i class="fas fa-clock fa-sm me-1"></i>${each.date}</small>
                </li>
                `
            })
        }
    }

    createTagWidget(data) {
        if(document.querySelector('.widget-tag') !== null) {
            data[0].tagLists.sort()
            const tagFilter = data[0].tagLists.filter(item => item !== 'untagged')
            tagFilter.forEach(eachTag => {
                if(eachTag.length !== 0) {
                    this.tagWrap.innerHTML += `<a href="blog-find.html?tag=${eachTag}"><span class="badge rounded-pill">#${eachTag}</span></a>`
                } else {
                    this.tagWrap.innerHTML = '<small class="text-muted">No tags available yet</small>'
                }
            })
        }
    }

    createPagination(data) {
        if(document.querySelector('[data-title="blog"]')) {
            const element = document.querySelector('.pagination')
            const totalPages = data[0].totalPages
            const page = !this.currentPage.includes('blog-page') ? 1 : parseInt(this.currentPage.substring(10).slice(0, -5))

            let liTag = ''
            let active = ''
            let beforePage = page - 1
            let afterPage = page + 1

            // hide pagination when only one page
            if(totalPages === 1) {
                element.remove()
            }

            // show the next button if the page value is greater than 1
            if(page > 3) { 
                liTag += `<li class="page-item"><a class="page-link" href="${data[0].asBlog}" aria-label="previous"><span aria-hidden="true">&laquo;</span></a></li>`
            }

            if(page == 1) {
                afterPage = afterPage + 2
            } else if(page == 2) {
                afterPage = afterPage + 1
            } else if(page !== totalPages && page < totalPages && page !== 1) {
                beforePage = beforePage - 1
            } else if (page == totalPages) {
                beforePage = beforePage - 2
            }

            for (let plength = beforePage; plength <= afterPage; plength++) {
                // if plength is greater than totalPage length then continue
                if (plength > totalPages) { 
                    continue
                }

                // if plength is 0 than add +1 in plength value
                if (plength == 0) { 
                    plength = plength + 1
                }

                // if page is equal to plength than assign active string in the active variable
                if(page == plength){ 
                    active = 'active'
                }else{ // else leave empty to the active variable
                    active = ''
                }
                liTag += `<li class="page-item ${active}"><a class="page-link" href="${plength == 1 ? data[0].asBlog : `blog-page-${plength}.html`}">${plength}</a></li>`
            }

            // show the next button if the page value is less than totalPage(20)
            if (page < totalPages - 1) { 
                liTag += `<li class="page-item"><a class="page-link" href="blog-page-${totalPages}.html" aria-label="next"><span aria-hidden="true">&raquo;</span></a></li>`
            }
            // add li tag inside ul tag
            element.innerHTML = liTag
        }
    }

    createFindPage(data) {
        if(document.querySelector('[data-title="blog-find"]')) {
            const params = new URLSearchParams(window.location.search)
            const textEl = document.querySelector('.blog-find-text')
            const headingEl = document.querySelector('.blog-find-heading')

            if(params.has('category')) {
                const categoryName = this.capitalizeText(params.get('category'))
                textEl.textContent = 'Post with category :'
                headingEl.innerHTML = `<i class="fas fa-folder-open fa-xs me-1 position-relative" style="top: 3px;"></i>${categoryName}`

                // write posts category into the dom
                data[1].filter(post => {
                    if(post.category.toLowerCase() === categoryName.toLowerCase()) {
                        const postWrap = document.querySelector('.blog-find')
                        const selectedPost = post.posts
                        setTimeout(() => {
                            selectedPost.forEach((each) => {
                                const articleDiv = document.createElement('div')
                                    articleDiv.innerHTML = this.postFormat(each)
                                    postWrap.appendChild(articleDiv)
                            }, 0);
                        })
                    }
                })
            }
            if(params.has('tag')) {
                const tagName = params.get('tag')

                textEl.textContent = 'Post with tag :'
                headingEl.innerHTML = `<i class="fas fa-tag fa-xs me-1 position-relative" style="top: 3px;"></i>${tagName}`

                // write posts tag into the dom
                data[2].filter(post => {
                    if(post.tag.toLowerCase() === tagName.toLowerCase()) {
                        const postWrap = document.querySelector('.blog-find')
                        const selectedPost = post.posts

                        selectedPost.forEach((post) => {
                            const articleDiv = document.createElement('div')
                            articleDiv.innerHTML = this.postFormat(post)
                            postWrap.appendChild(articleDiv)
                        })
                    }
                })
            }
        }
    }

    searchForm(data) {
        if(document.forms['blog-search'] !== undefined) {
            const inputSearch = document.forms['blog-search']

            const category = data[1].map(item => {
                item.posts.map(x => x.category = item.category)
                return item
            }).map(arr => arr.posts)
            const posts = [].concat(...category)

            inputSearch.addEventListener('submit', e => {
                e.preventDefault()

                // bootstrap input validation
                if (!inputSearch.checkValidity()) {
                    e.preventDefault()
                    e.stopPropagation()
                    inputSearch.classList.add('was-validated')
                } else {
                    const term = e.target[0].value.toLowerCase()
                    const params = new URLSearchParams()

                    params.append('result', term)
                    location.href = `blog-find.html?${params.toString()}`
                }
            })

            this.searchProcess(posts)
        }
    }

    searchProcess(data) {
        const params = new URLSearchParams(window.location.search)
        const textEl = document.querySelector('.blog-find-text')
        const headingEl = document.querySelector('.blog-find-heading')
        const postWrap = document.querySelector('.blog-find')
        const notFoundArr = []

        if(document.querySelector('[data-title="blog-find"]') && params.has('result')) {
            data.forEach(post => {
                const title = post.title.toLowerCase()
                const body = post.content.toLowerCase()

                textEl.textContent = 'Search result for :'
                headingEl.innerHTML = `<i class="fas fa-search fa-xs me-1 position-relative" style="top: 3px;"></i>${params.get('result')}`

                notFoundArr.push(title.indexOf(params.get('result')))
                notFoundArr.push(body.indexOf(params.get('result')))

                if(title.indexOf(params.get('result')) > -1 || body.indexOf(params.get('result')) > -1) {
                    const articleDiv = document.createElement('div')
                    articleDiv.innerHTML = this.postFormat(post)
                    postWrap.appendChild(articleDiv)
                }
            })

            if(this.checkDiff(notFoundArr) !== true) {
                const notFoundDiv = document.createElement('div')
                notFoundDiv.innerHTML = `<article class="card mb-4 mb-lg-0">
    <div class="card-body text-center px-4 py-5">
        <h2 class="fw-bold">Nothing Found</h3>
        <p class="text-muted mb-0">Sorry, but nothing matched your search terms.</p>
    </div>
</article>`
                postWrap.appendChild(notFoundDiv)
            }
        } 
    }

    postFormat({link, title, content, author, date, category}) {
        return `<article class="card mb-4">
    <div class="card-body blog-card p-3 p-md-4">
        <h3 class="fw-bold">
            <a href="/blog/${link}" class="link-dark text-decoration-none">${title}</a>
        </h3>
        <p>${content}</p>
        <div class="blog-author d-flex align-items-center">
            <img class="rounded-circle me-1" src="${author.avatar}" alt="author" width="32" height="32">
            <small class="text-muted">
                ${author.name}<span class="mx-1">•</span>${date}
            </small>
        </div>
    </div>
    <div class="card-footer blog-footer d-flex justify-content-between align-items-center px-3 px-md-4 py-2">
        <span class="badge bg-primary">${category}</span>
        <a href="${link}" class="btn btn-link text-decoration-none p-0">Read more<i class="fas fa-angle-right fa-xs ms-1"></i></a>
    </div>
</article>`
    }

    checkDiff(a) {
        return a.length !== 0 && new Set(a).size !== 1;
    }

    trimLatestWidget() {
        if(document.querySelector('.widget-latest') !== null) {
            const latestWrap = document.querySelector('.widget-latest')
            const titleList = latestWrap.querySelectorAll('a')
            titleList.forEach(title => title.textContent = this.trimLongTitle(title.textContent, 55))
        }
    }

    capitalizeText(string) {
        const arr = string.split(" ")
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
        }
        const result = arr.join(" ")
        return result
    }

    trimLongTitle(string, number) {
        let cut = string.indexOf(' ', number)
        if(cut == -1) return string
        return string.substring(0, cut) + ' ...'
    }

    removeUntagged() {
        if(document.querySelector('.article-tags') !== null) {
            const tagWrap = document.querySelector('.article-tags')
            if(tagWrap.querySelector('a').textContent == 'untagged') tagWrap.remove()
        }
    }
}

new Blog().init()