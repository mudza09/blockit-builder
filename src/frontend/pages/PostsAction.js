import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, createSearchParams } from 'react-router-dom'
import ShortUniqueId from 'short-unique-id'
import bs from '../utils/bs'
import EditorJS from '../assets/js/editorjs/editorjs-disable-key-events'
import Header from '../assets/js/editorjs/header/bundle'
import ImageTool from '../assets/js/editorjs/image/bundle'
import List from '../assets/js/editorjs/list/bundle'
import Quote from '../assets/js/editorjs/quote/bundle'
import Delimiter from '../assets/js/editorjs/delimiter/bundle'
import Table from '../assets/js/editorjs/table/bundle'
import ButtonLoader from '../components/ButtonLoader'
import removeParam from '../utils/removeParam'
import postLink from '../utils/postLink'
import hbsTemplate from '../utils/hbsTemplate'
import PostsActionCategorySelect from '../components/PostsActionCategorySelect'
import PostsActionAuthorSelect from '../components/PostsActionAuthorSelect'
import PostsActionTagInput from '../components/PostsActionTagInput'
import PostsActionFeaturedImage from '../components/PostsActionFeaturedImage'

export default function PostsAction() {
    let navigate = useNavigate()
    let {mode} = useParams()
    const [data, setData] = useState({})
    const params = new URLSearchParams(location.search)

    // id generator
    const uid = new ShortUniqueId({ length: 6 })

    // button loader status
    const [buttonStatus, setButtonStatus] = useState(false)
    
    // post form variables
    const titleInput = useRef(null)
    const sidebarForm = useRef(null)
    const savePostButton = useRef(null)
    const [failAuthor, setFailAuthor] = useState(false)
    const [layoutTag, setLayoutTag] = useState({})

    // post form state
    const [titlePost, setTitlePost] = useState('')

    // get data from socket
    const socketPostsAction = () => {
        bs.socket.emit('getPostsActionData', postLink(params.get('title') !== null ? params.get('title') : 'empty'))
        bs.socket.once('postsActionData', data => {
            setData(data)
        })
    }

    // handle editor post
    const handleEditorPost = (postData) => {
        if(mode == 'add') {
            handleEditorJs('', postData.authors.select)
        } else if(mode == 'edit') {
            setTitlePost(postData.title)
            handleEditorJs(postData, postData.authors.select)
        }
    }

    // editor js init
    const handleEditorJs = (data, authorsData) => {
        const editor = new EditorJS({
            holder: document.querySelector('#editor-post'),
            minHeight: 60,
            placeholder: 'Then write your an awesome story!',
            data: data,
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: ['link'],
                    config: {
                        placeholder: 'Header',
                        levels: [1, 2, 3, 4, 5, 6],
                    }
                },
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            async uploadByFile(buffer, nameFile) {
                                let typeFile = '';
                                switch(buffer.type) {
                                    case 'image/jpeg':
                                        typeFile = 'jpg'
                                        break
                                    case 'image/png':
                                        typeFile = 'png'
                                        break
                                    case 'image/gif':
                                        typeFile = 'gif'
                                        break
                                    case 'image/svg+xml':
                                        typeFile = 'svg'
                                        break
                                }
                                nameFile = `image-post-${uid()}.${typeFile}`
                                bs.socket.emit('assetsUpload', buffer, nameFile)
                                const imageUrl = await new Promise(resolve => bs.socket.once('uploadDone', path => resolve(path)))
                                return {
                                    success: 1,
                                    file: {url: `http://localhost:3000/${imageUrl}`}
                                }
                            }
                        }
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true
                },
                quote: {
                    class: Quote,
                    inlineToolbar: false,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                delimiter: Delimiter,
                table: {
                    class: Table,
                }
            },
            logLevel: 'ERROR'
        })

        editor.isReady
        .then(() => {
            const saveBtn = savePostButton.current
            const oldTitle = []

            saveBtn.onclick = () => {
                const form = sidebarForm.current
                const titleName = titleInput.current
                const authorName = form.querySelector('#post-author')
                const categoryPost = form.querySelector('#post-category')
                const tagsPost = form.querySelector('#post-tags')
                const featuredImg = form.querySelector('.post-image').querySelector('img')

                editor.save().then((dataPost) => {
                    if(handleValidateForm(titleName, authorName, dataPost)) {
                        const nameFile = postLink(titleName.value)
                        const postData = {
                            title: titleName.value,
                            link: `${postLink(titleName.value)}.html`,
                            author: {
                                id: authorName.querySelector('option:checked').getAttribute('data-id'),
                                name: authorName.value,
                                avatar: avatarSrc(authorsData, authorName)
                            },
                            category: categoryPost.value == 0 ? 'Uncategorized' : categoryPost.value,
                            tags: tagsPost.value.length !== 0 ? tagsPost.value.replace(/\s/g, '').split(',') : ['untagged'],
                            image: featuredSrc(featuredImg)
                        }

                        oldTitle.push(nameFile)

                        // asign data from editor to post object
                        Object.assign(postData, dataPost)

                        // delete unused property
                        delete postData.version
                        delete postData.time

                        // set button loader status
                        setButtonStatus(true)

                        // date or time variables
                        const date = new Date()
                        const dateObj = {
                            year: new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date),
                            month: new Intl.DateTimeFormat('en', { month: 'long' }).format(date),
                            day: new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date),
                            time: new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hourCycle: 'h12' }).format(date)
                        }

                        // if add mode, navigate to edit mode after save it
                        if(mode == 'add') {
                            postData.dateCreated = `${dateObj.month} ${dateObj.day}, ${dateObj.year}`
                            postData.dateModified = postData.dateCreated
                            postData.timeCreated = `${dateObj.time}`
                            postData.timeModified = postData.timeCreated

                            setTimeout(() => {
                                mode = 'edit'
                                navigate({
                                    pathname: '/posts/edit',
                                    search: `?${createSearchParams({
                                        title: postData.title,
                                        date: postData.dateCreated,
                                        time: postData.timeCreated
                                    })}`
                                })
                                sessionStorage.setItem('dateCreated', postData.dateCreated)
                                sessionStorage.setItem('timeCreated', postData.timeCreated)
                            }, 2000)
                        } else if(mode == 'edit') {
                            const oldName = params.get('title') !== null ? postLink(params.get('title')) : oldTitle[0]
                            postData.dateCreated = data.dateCreated == undefined ? sessionStorage.getItem('dateCreated') : data.dateCreated
                            postData.dateModified = `${dateObj.month} ${dateObj.day}, ${dateObj.year}`
                            postData.timeCreated = data.timeCreated == undefined ? sessionStorage.getItem('timeCreated') : data.timeCreated
                            postData.timeModified = `${dateObj.time}`

                            setTimeout(() => {
                                navigate({
                                    pathname: '/posts/edit',
                                    search: `?${createSearchParams({
                                        title: postData.title,
                                        date: postData.dateCreated,
                                        time: postData.timeCreated
                                    })}`
                                })
                                sessionStorage.removeItem('dateCreated')
                                sessionStorage.removeItem('timeCreated')
                            }, 2000)

                            oldTitle.shift()

                            // rename title condition
                            if(oldName !== nameFile) bs.socket.emit('deletePostData', oldName, layoutTag)
                        }

                        // send post content data
                        bs.socket.emit('savePostContent', nameFile, postData, layoutTag)
                    }
                })
            }
        })
    }

    // validate input form
    const handleValidateForm = (title, author, post) => {
        let status = true
        if(title.value.length == 0) {
            title.classList.add('uk-animation-shake')
            setTimeout(() => title.classList.remove('uk-animation-shake'),500)
            status = false
        } else if(author.value == 0) {
            setFailAuthor(true)
            status = false
        } else if(post.blocks.length == 0) {
            document.querySelector('.ce-paragraph').classList.add('uk-animation-shake')
            setTimeout(() => document.querySelector('.ce-paragraph').classList.remove('uk-animation-shake'),500)
            status = false
        }
        return status
    }

    // find avatar image src in post
    const avatarSrc = (authorsData, authorsName) => {
        let avatar = ''
        authorsData.forEach((e) => {
            if(e.name == authorsName.value) avatar = e.avatar
        })
        return avatar
    }

    // find featured image src in post
    const featuredSrc = (element) => {
        let value = ''
        if(element.getAttribute('src') === '../assets/img/blockit-image-post.svg') {
            value = false
        } else {
            value = element.getAttribute('src').includes('../') ? String(element.getAttribute('src').substr(3)) : String(element.getAttribute('src').replace(`http://localhost:3000/`, ''))
            value = removeParam('browsersync', value)
        }
        return value
    }

    useEffect(() => socketPostsAction(), [])
    useEffect(() => {
        if(Object.keys(data).length !== 0) {
            handleEditorPost(data)
        }
    }, [data])
    useEffect(() => setLayoutTag(hbsTemplate), [])

    return (
        <div className="uk-section blockit-pages blockit-posts-action">
            <div className="uk-container">
                <div className="uk-grid">
                    <div className="uk-width-2-3">
                        <div className="post-wrap">
                            <form id="page-form" className="uk-grid-small" data-uk-grid>
                                <div className="uk-width-1-1 uk-margin-remove-bottom">
                                    <input 
                                        className="uk-input uk-form-large" 
                                        id="post-title" 
                                        placeholder="Add post title..." 
                                        type="text" 
                                        autoComplete="off" 
                                        ref={titleInput}
                                        defaultValue={titlePost}
                                    />
                                </div>
                                <div className="uk-width-1-1 uk-margin-remove-top">
                                    <div id="editor-post"></div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="uk-width-expand">
                        <div className="section-post-settings">
                            <div className="uk-card uk-card-default uk-card-body uk-border-rounded">
                                <ButtonLoader
                                    id="save-post"
                                    class="uk-button uk-button-primary uk-border-rounded uk-width-1-1 uk-margin-bottom"
                                    default="Save post"
                                    success="Saved successfully"
                                    refElement={savePostButton}
                                    status={buttonStatus}
                                />
                                <form id="page-form" className="uk-grid-small uk-margin-small-top" ref={sidebarForm} data-uk-grid>
                                    <PostsActionAuthorSelect data={data.authors} status={failAuthor} callback={setFailAuthor} />
                                    <PostsActionCategorySelect data={data.categories} />
                                    <PostsActionTagInput data={data.currentTags} mode={mode} />
                                    <PostsActionFeaturedImage data={data.currentImage} />
                                </form>
                                {mode == 'edit' && <p className="uk-text-small uk-text-muted uk-margin-small-top"><strong>Published :</strong> {params.get('date')} at {params.get('time')}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}