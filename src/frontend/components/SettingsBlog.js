import React, { useEffect, useRef } from 'react'

export default function SettingsBlog(props) {
    const blogForm = useRef(null)
    const authorRadio = useRef(null)
    const tagRadio = useRef(null)
    const shareRadio = useRef(null)
    const searchCheck = useRef(null)
    const categoriesCheck = useRef(null)
    const latestCheck = useRef(null)
    const tagCheck = useRef(null)
    

    // display radio
    const displayRadio = (condition) => {
        const form = blogForm.current
        condition.displayAuthor ? form.querySelector('#display-author-enable').checked = true : form.querySelector('#display-author-disable').checked = true
        condition.displayTag ? form.querySelector('#display-tag-enable').checked = true : form.querySelector('#display-tag-disable').checked = true
        condition.displayShareButtons ? form.querySelector('#display-share-enable').checked = true : form.querySelector('#display-share-disable').checked = true
    }

    // show widget check
    const showWidgetCheck = (condition) => {
        const form = blogForm.current
        if(condition.search) form.querySelector('#setting-widget-search').checked = true
        if(condition.categories) form.querySelector('#setting-widget-categories').checked = true
        if(condition.latestPosts) form.querySelector('#setting-widget-latest').checked = true
        if(condition.tags) form.querySelector('#setting-widget-tags').checked = true
    }

    // handle blog form
    const handleBlogForm = () => {
        const form = blogForm.current
        const authorRadioEnable = authorRadio.current.checked
        const tagRadioEnable = tagRadio.current.checked
        const shareRadioEnable = shareRadio.current.checked
        const searchCheckEnable = searchCheck.current.checked
        const categoriesCheckEnable = categoriesCheck.current.checked
        const latestCheckEnable = latestCheck.current.checked
        const tagCheckEnable = tagCheck.current.checked

        props.data.postPerPage = form.querySelector('#setting-posts-per-page').value
        props.data.showWidgets.search = searchCheckEnable ? true : false
        props.data.showWidgets.categories = categoriesCheckEnable ? true : false
        props.data.showWidgets.latestPosts = latestCheckEnable ? true : false
        props.data.showWidgets.tags = tagCheckEnable ? true : false
        props.data.showWidgets.allHide = searchCheckEnable == false && categoriesCheckEnable == false && latestCheckEnable == false && tagCheckEnable == false ? true : false
        props.data.displayAuthor = authorRadioEnable ? true : false
        props.data.displayTag = tagRadioEnable ? true : false
        props.data.displayShareButtons = shareRadioEnable ? true : false
        props.data.disqussShortname = form.querySelector('#setting-disquss').value
    }

    // handle add category
    const handleAddCategory = (e) => {
        e.preventDefault()

        const form = blogForm.current
        const newCategory = form.querySelector('#setting-category-input').value
        props.callback(newCategory, 'add')
        form.querySelector('#setting-category-input').value = ''
    }

    // handle delete category
    const handleDeleteCategory = (e, index) => {
        e.preventDefault()

        const deleteCategory = props.data.categories[index]
        props.callback(deleteCategory, 'delete')
    }

    useEffect(() => {
        if(props.data !== undefined) {
            displayRadio(props.data)
            showWidgetCheck(props.data.showWidgets)
        }
    }, [props.data])

    return (
        <li className="blog">
            <h4 className="uk-heading-line"><span>Blog</span></h4>
            <form className="uk-form-horizontal uk-margin-medium" onChange={handleBlogForm} ref={blogForm}>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-posts-per-page">Categories</label>
                    <div className="uk-form-stacked uk-grid-small uk-grid" data-uk-grid>
                        <div className="uk-width-expand">
                            <input className="uk-input uk-border-rounded" id="setting-category-input" type="text" placeholder="Add new category..." />
                        </div>
                        <div className="uk-width-auto">
                            <button id="setting-category-btn" className="uk-button uk-button-secondary uk-border-rounded uk-width-1-1" onClick={handleAddCategory}>
                                <i className="fas fa-plus-circle fa-sm uk-margin-small-right"></i>Add
                            </button>
                        </div>
                        <div id="setting-category-list" className="uk-width-1-1">
                        {
                            props.data !== undefined
                                ? props.data.categories.map((each, index) => {
                                    return (
                                        <span key={index} className="uk-label uk-border-pill setting-label-category">
                                            {each}
                                            <button className="delete-category uk-button uk-button-text fas fa-times" onClick={(e) => handleDeleteCategory(e, index)}></button>
                                        </span>
                                    )
                                })
                                : null
                        }                            
                        </div>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-posts-per-page">Posts per page</label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded setting-number-dimension" id="setting-posts-per-page" type="number" defaultValue={props.data !== undefined ? props.data.postPerPage : ''} />
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-show-widgets">Show widgets</label>
                    <div className="uk-form-controls uk-form-controls-text">
                        <label><input className="uk-checkbox" type="checkbox" id="setting-widget-search" ref={searchCheck} /> Search</label><br />
                        <label><input className="uk-checkbox" type="checkbox" id="setting-widget-categories" ref={categoriesCheck} /> Categories</label><br />
                        <label><input className="uk-checkbox" type="checkbox" id="setting-widget-latest" ref={latestCheck} /> Latest posts</label><br />
                        <label><input className="uk-checkbox" type="checkbox" id="setting-widget-tags" ref={tagCheck} /> Tags</label>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-display-author">Display author</label>
                    <div className="uk-form-controls uk-form-controls-text">
                        <label className="uk-margin-right"><input id="display-author-enable" className="uk-radio" type="radio" value="enable" name="setting-display-author" ref={authorRadio} /> Enable</label>
                        <label><input id="display-author-disable" className="uk-radio" type="radio" value="disable" name="setting-display-author" /> Disable</label>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-display-tags">Display tags</label>
                    <div className="uk-form-controls uk-form-controls-text">
                        <label className="uk-margin-right"><input id="display-tag-enable" className="uk-radio" type="radio" value="enable" name="setting-display-tags" ref={tagRadio} /> Enable</label>
                        <label><input id="display-tag-disable" className="uk-radio" type="radio" value="disable" name="setting-display-tags" /> Disable</label>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-display-share">Display share buttons</label>
                    <div className="uk-form-controls uk-form-controls-text">
                        <label className="uk-margin-right"><input id="display-share-enable" className="uk-radio" type="radio" value="enable" name="setting-display-share" ref={shareRadio} /> Enable</label>
                        <label><input id="display-share-disable" className="uk-radio" type="radio" value="disable" name="setting-display-share" /> Disable</label>
                    </div>
                </div>
                <div className="uk-margin">
                    <label className="uk-form-label" htmlFor="setting-disquss">Disquss shortname <i className="fas fa-info-circle fa-xs" data-uk-tooltip="title: Used for comments on blogs; pos: right"></i></label>
                    <div className="uk-form-controls">
                        <input className="uk-input uk-border-rounded" id="setting-disquss" type="text" defaultValue={props.data !== undefined ? props.data.disqussShortname : ''} />
                    </div>
                </div>
            </form>
        </li>
    )
}